'use strict';

var cradle = require('./cradle_setup');
var docx=require('./docx');
var couchdb=require('./couchdb');
var parser=require('./preparing');
var html=require('./html');
const {ArrayResult}=require('./result');

var start = (response,components,recreateViews)=>{
  return new Promise(async(resolve,reject)=>{
 try{

  await couchdb.initialize(recreateViews, response);//set true if need to recreate view

  var db=couchdb.getDBConnection();

  var obj={components:[]};

 for(var i=0; i<components.length; i++){
   try{
  var opts = {
    startkey: [components[i].APPLICATION_TYPE,components[i].RELEASE],
      endkey: [components[i].APPLICATION_TYPE, {}],
    // group: true
    //descending: true
    };

  var component=parser.findComponent(obj,components[i].APPLICATION_TYPE);
 

  var new_releases=await couchdb.select('test/features-by-release', opts,null);
  components[i].RECORDS_FOUND=new_releases.rows.length;


   if(new_releases.rows.length===0){
    console.log('Can\'t find '+components[i].APPLICATION_TYPE+' among available release notes');  
    components[i].DELTA_SAME='undefuned';
    components[i].DELTA_LATEST='undefined';
    }else{

     component.current_release={
      release:components[i].RELEASE,
      family:new_releases.rows[0].value.family,
      date:new_releases.rows[0].value.release_date,
      release_type:new_releases.rows[0].value.release_type
     };

     // Populate latest release of the same family info
    var delta_same_family_res=await couchdb.select('test/group-releases-by-family',{
     startkey: [components[i].APPLICATION_TYPE,components[i].RELEASE,component.current_release.family,{},{}],
     endkey: [components[i].APPLICATION_TYPE,{},component.current_release.family,{},{}],
     group: true},
    null);

    component.delta_same_family=delta_same_family_res.rows.length;
    components[i].DELTA_SAME=component.delta_same_family;

    var ind=delta_same_family_res.rows.length-1;
    var rows=delta_same_family_res.rows;

    component.latest_same_family={
      release:rows[ind].key[1],
      family:rows[ind].key[2],
      date:rows[ind].key[3],
      release_type:rows[ind].key[4]
    }

    // Populate delta of latest release of the latest family 
    var delta_latest_release_res=await couchdb.select('test/group-releases-by-family',{
     startkey: [components[i].APPLICATION_TYPE,components[i].RELEASE,component.current_release.family],
     endkey: [components[i].APPLICATION_TYPE,{},{}],
     group: true},
    null);

    component.delta_latest_release=delta_latest_release_res.rows.length;
    components[i].DELTA_LATEST=component.delta_latest_release;

    obj=parser.processed_obj(new_releases,obj);
   }
  }catch(err){
    reject(err);
  }
  };

  var doc_result=new ArrayResult(components);
  html.displayTableResults(response, doc_result);

  var filename= await docx.createDocx(obj);

  var link='<a href=\'/getFile?filename='+filename+'\'>'+filename+'</a>';

  resolve(link);

 }catch(e){
  console.log(e.stack);
  reject(e);
 };
})
};

module.exports={start};