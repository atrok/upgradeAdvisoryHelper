var http = require("http");
var url = require("url");
const URLSearchParams= require('url');

function start(route, handle) {
 function onRequest(request, response) {
 var pathname = url.parse(request.url).pathname;
 var args=url.parse(request.url,true).query;
 console.log("Request for " + pathname + " received.");

 route(handle, pathname,response,(!args)?null:args);

}

http.createServer(onRequest).listen(7000);
 console.log("Server has started.");
}

exports.start = start;
