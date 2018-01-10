var Logger=require('../logger');

var log=new Logger(null);

var long_message_object={
 error: "error text",
 conditions: {
     errorcondition: 1,
     errorcondition: 2
 }
}

log.log(long_message_object);