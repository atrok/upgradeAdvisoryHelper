var docProcessing=require('../docProcessing');


var args=null;

var p=async(args)=>{
    var component=[{
        APPLICATION_TYPE: "Stat Server",
        APPTYPE_ID: -1,
        RELEASE: "8.5.000.29"
    }]
    var res = await docProcessing.start(null, component)
    console.assert(null!==res,'Expected object', res);
};

p();
