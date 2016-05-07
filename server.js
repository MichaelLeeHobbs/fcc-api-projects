'use strict';
//Lets require/import the HTTP module
const http = require('http');
const moment = require("moment");

//Lets define a port we want to listen to
const PORT = process.env.PORT; 
const IP = process.env.IP;

// helper function for debuging - allows us to JSON.stringify objects with circular structure
function censor(censor) {
  let i = 0;

  return function(key, value) {
    if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
      return '[Circular]'; 

    if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
      return '[Unknown]';

    ++i; // so we know we aren't using the original object anymore

    return value;  
  }
}


//We need a function which handles requests and send response
function handleRequest(request, response){
    const regexSoftware = /\((.*?)\)/;

    let ipAddress = request.headers['x-forwarded-for'];
    let language = request.headers['accept-language'].split(',')[0];
    let software =  regexSoftware.exec(request.headers['user-agent'])[1];
    let result = {
        "ipaddress": ipAddress,
        "language": language,
        "software": software
    }

    response.end(JSON.stringify(result));
}





//Create a server
let server = http.createServer(handleRequest);

//Lets start our server
server.listen(process.env.PORT, process.env.IP, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});