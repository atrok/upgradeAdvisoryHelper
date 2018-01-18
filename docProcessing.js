'use strict';

var cradle = require('./cradle_setup');
var docx=require('./docx');
var couchdb=require('./couchdb');
var parser=require('./preparing');
var html=require('./html');
const {ArrayResult}=require('./result');
const ApplicationTypes=require('./apptypes');

var start = (response,components,recreateViews)=>{
  return new Promise(async(resolve,reject)=>{
 try{

  await couchdb.initialize(recreateViews, response);//set true if need to recreate view

  var db=couchdb.getDBConnection();

  var obj={components:[]};
  var apptypes=new ApplicationTypes();

 for(var i=0; i<components.length; i++){
   try{

    var p=apptypes.findByTypeID(components[i].APPTYPE_ID);

    var application=(null===p)?components[i].APPLICATION_TYPE:p.name;

  var opts = {
    startkey: [application,components[i].RELEASE],
      endkey: [application, {}],
    // group: true
    //descending: true
    };

  var component=parser.findComponent(obj,application);
 

  var new_releases=await couchdb.select('test/features-by-release', opts,null);
  components[i].RECORDS_FOUND=new_releases.rows.length;


   if(new_releases.rows.length===0){
    console.log('Can\'t find '+application+' among available release notes');  
    components[i].DELTA_SAME='undefuned';
    components[i].DELTA_LATEST='undefined';
    }else{

    var cur_release_index=component.current_release.push({
      release:components[i].RELEASE,
      family:new_releases.rows[0].value.family,
      date:new_releases.rows[0].value.release_date,
      release_type:new_releases.rows[0].value.release_type
     })-1;

     // Populate latest release of the same family info
    var delta_same_family_res=await couchdb.select('test/group-releases-by-family',{
     startkey: [application,components[i].RELEASE,component.current_release.family,{},{}],
     endkey: [application,{},component.current_release.family,{},{}],
     group: true},
    null);

    component.current_release[cur_release_index].delta_same_family=delta_same_family_res.rows.length;
    components[i].DELTA_SAME=delta_same_family_res.rows.length;

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
     startkey: [application,components[i].RELEASE,component.current_release.family],
     endkey: [application,{},{}],
     group: true},
    null);

    component.current_release[cur_release_index].delta_latest_release=delta_latest_release_res.rows.length;
    components[i].DELTA_LATEST=delta_latest_release_res.rows.length;

    obj=parser.processed_obj(new_releases,obj);
   }
  }catch(err){
    console.log(err.stack);
    reject(err);
  }
  };

  var doc_result=new ArrayResult(components);
  html.displayTableResults(response, doc_result);

  //console.log(JSON.stringify(obj));
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