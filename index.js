var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/recreateViews"]= requestHandlers.recreateViews;
handle["/prepareAdvisory"]=requestHandlers.prepareAdvisory;
handle["/getComponents"]=requestHandlers.getComponents;

server.start(router.route, handle);
