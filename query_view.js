'use strict';

var cradle = require('./cradle_setup');
var docx=require('./docx');
var couchdb=require('./create_views');
var parser=require('./preparing');

var start = async (response,components,recreateViews)=>{
 try{

  await couchdb.initialize(recreateViews, response);//set true if need to recreate view

  var db=couchdb.getDBConnection();

  var obj={components:[]};

 for(var i=0; i<components.length; i++){
  var opts = {
    startkey: [components[i].APPLICATION_TYPE,components[i].RELEASE],
      endkey: [components[i].APPLICATION_TYPE, {}],
    // group: true
    //descending: true
    };

  var component=parser.findComponent(obj,components[i].APPLICATION_TYPE);

  var new_releases=await couchdb.select('test/features-by-release', opts,response);



   if(new_releases.rows.length===0){
    console.log('Can\'t find '+components[i].APPLICATION_TYPE+' among available release notes');  
    }else{

     component.current_release={
      release:components[i].RELEASE,
      family:new_releases.rows[0].value.family,
      date:new_releases.rows[0].value.release_date,
      release_type:new_releases.rows[0].value.release_type
     };

    var delta_same_family_res=await couchdb.select('test/group-releases-by-family',{
     startkey: [components[i].APPLICATION_TYPE,components[i].RELEASE,component.current_release.family],
     endkey: [components[i].APPLICATION_TYPE,{},component.current_release.family],
     group: true},
    response);

    component.delta_same_family=delta_same_family_res.rows.length;

    var delta_latest_release_res=await couchdb.select('test/group-releases-by-family',{
     startkey: [components[i].APPLICATION_TYPE,components[i].RELEASE,component.current_release.family],
     endkey: [components[i].APPLICATION_TYPE,{},{}],
     group: true},
    response);

    component.delta_latest_release=delta_latest_release_res.rows.length;
    obj=parser.processed_obj(new_releases,obj);
   }
  };

  docx.createDocx(obj, function (err, res) {
    if (err) {
      //response.write(err);
      console.log(err);
      throw new Error(err);
    };
    console.log(res);
  });

  return obj;

 }catch(e){
  console.log(e.stack);
  throw e;
 };
};

module.exports={start};