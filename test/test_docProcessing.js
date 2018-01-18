var docProcessing=require('../docProcessing');


var args=null;

var p=async(args)=>{
    var component=[{
        APPLICATION_TYPE: "Contact Server",
        APPTYPE_ID: 63,
        RELEASE: "8.5.100.00"
    }]
    var res = await docProcessing.start(null, component)
    console.assert(null!==res,'Expected object', res);
};

p();
