var couchdb=require('../create_views');
var Logger=require('../logger');

var start= (response)=>{
    return new Promise(async(resolve,reject)=>{

    try{
    var db=couchdb.getDBConnection();

    var logger=new Logger(response);

    var res=await couchdb.select('test2/group-by-components-names',{group:true},response);

    var rows=res.rows;

    rows.forEach(function(value,key){
        logger.log(value.key.toString());
    })
    resolve("Done!");
    }catch(err){
        console.log(err.stack);
        reject(err);
    }
 });
}

module.exports={
    start
};