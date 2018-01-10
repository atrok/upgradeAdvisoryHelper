var couchdb=require('./create_views');
var upgradeAdvisory=require('./webapp');
var components=require('./test/test_queryVIew');
var html=require('./html');

function start(response) {
 console.log("Request handler 'start' was called.");

 response.writeHead(200, {"Content-Type": "text/plain"});
 html.htmlHeader(response,'Upgrade Advisory Helper', 'Upgrade Advisory Helper');
 html.htmlMenu(response);
 html.htmlFooter(response);
 //response.end();
}

function upload(response) {
 console.log("Request handler 'upload' was called.");
 response.writeHead(200, {"Content-Type": "text/plain"});
 response.write("Hello Upload");
 response.end();
}

async function recreateViews(response){
    console.log("Request handler 'recreateViews' was called.");
    response.writeHead(200, {"Content-Type": "text/plain"});

    html.htmlHeader(response,'Upgrade Advisory Helper', 'UAHelper: Recreate VIews');
    html.htmlMenu(response);

    await couchdb.initialize('true',response);
    
    html.htmlFooter(response);
}

async function prepareAdvisory(response){
    console.log("Request handler 'prepareAdvisory' was called.");
    response.writeHead(200, {"Content-Type": "text/plain"});
    
    html.htmlHeader(response,'Upgrade Advisory Helper', 'UAHelper: Prepare Upgrade Advisory Document');
    html.htmlMenu(response);

    await upgradeAdvisory.init(response);

    html.htmlFooter(response);

}

async function getComponents(response){
    console.log("Request handler 'getComponents' was called.");
    response.writeHead(200, {"Content-Type": "text/plain"});
    html.htmlHeader(response,'Upgrade Advisory Helper', 'UAHelper: Get Components');
    html.htmlMenu(response);
    try{
        var res= await components.start(response);
        html.displayTableResults(response,res);

        html.htmlFooter(response);
    }catch(err){
        response.write(err.stack); 
        html.htmlFooter(response);
    }
}

exports.start = start;
exports.upload = upload;
exports.recreateViews= recreateViews;
exports.prepareAdvisory= prepareAdvisory;
exports.getComponents=getComponents;