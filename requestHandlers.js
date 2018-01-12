var couchdb = require('./couchdb');
var upgradeAdvisory = require('./upgradeAdvisory');
var components = require('./queries/groupbycomponents');
var html = require('./html');
var fs = require('fs');
var path = require('path');
var docProcessing = require('./docProcessing');
const {OracleDBResult,CouchDBResult, DocProcessingResult} = require('./result');

function start(response) {
    console.log("Request handler 'start' was called.");

    response.writeHead(200, { "Content-Type": "text/plain" });
    html.htmlHeader(response, 'Upgrade Advisory Helper', 'Upgrade Advisory Helper');
    html.htmlMenu(response);
    html.htmlFooter(response);
    //response.end();
}

function upload(response) {
    console.log("Request handler 'upload' was called.");
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write("Hello Upload");
    response.end();
}

async function recreateViews(response) {
    console.log("Request handler 'recreateViews' was called.");
    response.writeHead(200, { "Content-Type": "text/plain" });

    html.htmlHeader(response, 'Upgrade Advisory Helper', 'UAHelper: Recreate VIews');
    html.htmlMenu(response);

    await couchdb.initialize('true', response);

    html.htmlFooter(response);
}

async function prepareAdvisory(response) {
    console.log("Request handler 'prepareAdvisory' was called.");
    response.writeHead(200, { "Content-Type": "text/plain" });

    html.htmlHeader(response, 'Upgrade Advisory Helper', 'UAHelper: Prepare Upgrade Advisory Document');
    html.htmlMenu(response);

    await upgradeAdvisory.init(response);

    //html.htmlFooter(response);

}

async function testPrepareAdvisory(response, args) {
    console.log("Request handler 'prepareAdvisory' was called.");
    response.writeHead(200, { "Content-Type": "text/plain" });

    html.htmlHeader(response, 'Upgrade Advisory Helper', 'UAHelper: Test Upgrade Advisory Document');
    html.htmlMenu(response);

    var component=[{
        APPLICATION_TYPE: args.apptype||"Interaction Server",
        RELEASE: args.release||"8.5.103.22"
    }]
    var res=await docProcessing.start(response, component);

    html.displayResults(response,res);

    html.htmlFooter(response);

}

async function getComponents(response) {
    console.log("Request handler 'getComponents' was called.");
    response.writeHead(200, { "Content-Type": "text/plain" });
    html.htmlHeader(response, 'Upgrade Advisory Helper', 'UAHelper: Get Components');
    html.htmlMenu(response);
    try {
        var res = await components.query(response, null);

        var couch_result=new CouchDBResult(res);
        html.displayTableResults(response, couch_result);

        html.htmlFooter(response);
    } catch (err) {
        html.handleError(response, 'Failed to populate table with results', err);
        html.htmlFooter(response);
    }
}

function getFile(response, args) {
    console.log("Request handler 'getFile' was called.");

    // html.htmlMenu(response);
    if (!args || !args.filename) {
        response.writeHead(404, { "Content-Type": "text/plain" });
        html.htmlHeader(response, 'Upgrade Advisory Helper', 'UAHelper: Get Components');
        html.htmlMenu(response);
        html.handleError(response, 'No reference to the file has been provided in the url', null);
        return;
    }
    var filename = args.filename;

    fs.exists(filename, function (exists) {
        if (!exists) {
            response.writeHead(404, { "Content-Type": "text/plain" });
            html.htmlHeader(response, 'Upgrade Advisory Helper', 'UAHelper: Get Components');
            html.htmlMenu(response);
            html.handleError(response, 'File ' + filename + ' is not found', null);
            return;
        }


        try {
            response.writeHead(200, {
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Content-Disposition": "attachment;filename=" + filename
            });

            fs.createReadStream(path.resolve(__dirname, filename)).pipe(response);
        } catch (err) {
            console.log(err.stack);
            response.writeHead(200, { "Content-Type": "text/plain" });
            html.htmlHeader(response, 'Upgrade Advisory Helper', 'UAHelper: Get Components');
            html.htmlMenu(response);
            html.handleError(response, 'Failed to access the file', err);
            // html.htmlFooter(response);
        }
    });
}

exports.start = start;
exports.upload = upload;
exports.recreateViews = recreateViews;
exports.prepareAdvisory = prepareAdvisory;
exports.getComponents = getComponents;
exports.getFile = getFile;
exports.testPrepareAdvisory=testPrepareAdvisory;