var couchdb=require('../couchdb');
var Logger=require('../logger');

var query= (response,opts)=>{
    var localOpts;
    (!opts)? localOpts={group: true}: localOpts=opts;

    return new Promise(async(resolve,reject)=>{

    try{
    var db=couchdb.getDBConnection();

    var logger=new Logger(null);

    var res=await couchdb.select('test2/group-by-components-names',localOpts,response);

    var rows=res.rows;

    rows.forEach(function(value,key){
        logger.log(value.key.toString());
    })
    resolve(res);
    }catch(err){
        console.log(err.stack);
        reject(err);
    }
 });
}

module.exports={
    query
};