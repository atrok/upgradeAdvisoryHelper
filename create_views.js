'use strict';

var cradle = require('cradle');
var StringBuilder= require('./stringbuilder');
var Logger= require('./logger');


cradle.setup({
    host: '172.21.80.22',
    port: 5984,
    cache: true,
    raw: true,
    forceSave: true,
    auth: { username: 'admin', password: 'Genesys#1'}
  });

const view_all='all';
const view_group_releases_by_component="group-releases-by-component";
const view_features_by_release="features-by-release";
const database_name='sitemap-data-genesys_rn_85';

var isCreated=false;

var FULL_MASK=0x1F;// 11111

var view_names= [
  {name:'all',flag:0x1, function:{
    all: {
      map: function (doc) {
          emit(doc["component"], doc);
      }
    }}},
  {name:"group-releases-by-component",flag:0x2, function:{
    "group-releases-by-component": {
      map: function (doc) {
          if(doc.release&& doc.component){
          emit([doc.component,doc.release],1);
      }
      },
      reduce: function(keys, values) {
        return sum(values);
      }
    }}},
  {name:"features-by-release",flag:0x4, function:{
    "features-by-release": {
      map: function (doc) {
          if(doc.release&& doc.component){
           var family=doc.release.slice(0,3);
          emit([doc.component,doc.release,doc.restricted],{
            _id: doc._id, 
            _rev: doc._rev,
            aix: doc.aix,
            component: doc.component,
            'component-href':doc['component-href'],
            family: family,
            'family-href': doc['family-href'],
            features: doc.features,
            linux: doc.linux,
            release: doc.release,
            release_date: doc.release_date,
            release_type: doc.release_type,
            'release-href': doc['release-href'],
            restrictions: doc.restrictions,
            solaris: doc.solaris,
            solution_name: doc.solution_name,
            upgrade_notes: doc.upgrade_notes,
            'web-scraper-start-url': doc['web-scraper-start-url'],
            windows: doc.windows
          });
        }
      }
    }
  }},
  {name:"short-release-info",flag:0x8, function:{
    "short-release-info": {
      map: function (doc) {
          if(doc.release&& doc.component){
            var family=doc.release.slice(0,3);
          emit([doc.component,doc.release,family,doc.release_date,doc.release_type],1);
        }
      },
      reduce: function(keys, values) {
        return sum(values);
      }
    }
  }},
  {name:"group-releases-by-family",flag:0x10, function:{
    "group-releases-by-family": {
      map: function (doc) {
          if(doc.release){
            var family=doc.release.slice(0,3);
          emit([doc.component,doc.release,family],1);
      }
      },
      reduce: function(keys, values) {
        return sum(values);
      }
    }}}
];




function check_views(response,create_view){
  var logger=response;
  return new Promise((resolve, reject) =>{
    var mask=0x0;

    var db = new(cradle.Connection)().database(database_name);

    logger.log( "Start working with DB "+database_name);

    db.get('_all_docs', {
      startkey:"\"_design\"",
      endkey:"\"_design0\"",
      include_docs: true
    },async function(err, res) {
      logger.log( 'Check exisiting views in _all_docs, processing results:');
      
      if (!res['rows']) err=res.json;

      if (err){
              logger.log(err);
              reject(new Error("Failed to check views"));
              }else{
                //console.log(typeof res);
                var r={};
                var revision;
                try{
                  res.rows.forEach(function(row, key) {
                    logger.log( 'View id: '+row.id+', rev: '+row.value.rev);
                    var views=Object.getOwnPropertyNames(row.doc.views);
                    view_names.forEach(function(value){
                      if(views.find(x=>x==value.name)) {
                        mask=mask | value.flag;
                        logger.log( "'"+value.name+"' function, adjusted mask:"+parseInt(mask).toString(2));
                      }
                    });

                    revision=row.value.rev;
                });
                var p=await create_view(logger,mask,revision);// create views using  one object/map
                resolve(p);
              }catch(err){
                logger.log(err.stack);
                reject(err);
              }
      }
    });
  }); /// Promise ending
};

function create_view(logger,mask,revision){

  return new Promise(resolve =>{

  if (mask!=FULL_MASK){
    logger.log('Masks aren\'t equal: '+parseInt(mask).toString(2)+" vs. "+parseInt(FULL_MASK).toString(2));
    var func={};

    view_names.forEach(function(value){

      // Check mask against views predefined bitmask and include its function if missing
      if(mask&value.flag){
        logger.log("View already exists: "+value.name);
      }else{
       logger.log("Missing view "+value.name);
      }
      Object.assign(func,value.function);
    });

      var db=new(cradle.Connection)().database(database_name);
      logger.log("Creating new view");
      db.save('_design/test', (revision) ? revision: '', func , function (err, res) {
      //db.save('_design/test', func , function (err, res) {
        if(err){
          logger.log(err);
          resolve(err);
          return;
        }
        //console.log("Created succesfully");
        resolve("Created succesfully, id:"+res.id+", rev: "+res.rev); // returning Promise after views are created;
      });
      
  }else{
   resolve('No need to create view'); /// returning promise as there is no need to create views;
  }
});//Promise ending
};


// query to get data from CouchDB
// where opts is an object like {key: ['Interaction Server','8.5.107.22']}
// return promise to use in async/await operations

 function select(view,opts,response){

  var logger=new Logger(response);
  return new Promise(async (resolve, reject)=>{
    var db=getDBConnection();
    logger.log('Getting data from '+view+' with options')
    logger.log(opts);
    try{
      var error;
      var result;
    db.view(view, opts, function (err, res) {
      if(err){ 
        logger.log(err);
        reject(err)
      }else{
        
        logger.log("Found "+res.rows.length+" records");
      

      resolve(res);
      }
    });
  }catch(err){
    throw err;
  }
  });
 };

var logger=null;

function initialize(recreate, response){
  var logger=new Logger(response);
  return new Promise(async (resolve,reject)=>{
    try{
      if (recreate==='true') FULL_MASK=0x15;
    var p = await check_views(logger, create_view);
    logger.log(p);
    resolve();
    //response.end();
    }catch(e){
      logger.log(e.stack);
      //response.end();
      //throw e;
    }
  });
};

 function getDBConnection(){
   return new(cradle.Connection)().database(database_name); 
 };



/*
db.view('test/features-by-release', {key: ['Interaction Server','8.5.107.22']}, function (err, res) {
  //console.log('Getting data from '+view+' with options '+opts);
  console.log(typeof res);
  res.rows.forEach(function(value){
  
    console.log(value);
  });
   if(err) console.log(err);
  //current_release=res;
  
});
*/
//DBSetup.initialize();
//console.log('In process of DB initialization');






module.exports={
 initialize,
 getDBConnection,
 select,
 view_names
};