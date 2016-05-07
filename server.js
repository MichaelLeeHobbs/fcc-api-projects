'use strict';
//Lets require/import the HTTP module
const http = require('http');
const moment = require("moment");

//Lets define a port we want to listen to
const PORT=8080; 

//We need a function which handles requests and send response
function handleRequest(request, response){
    const regexIsNaturalDate = /^\w*(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}/;
    const regexIsNumberOnly = /^\d+$/;
    const regexLeadingEndingSlashes = /^\/|\/$/g;
  
    // handle leading or ending slash
    let input = decodeURI(request.url).replace(regexLeadingEndingSlashes, '');
    let isNum = regexIsNumberOnly.test(input);
    let isNatural = regexIsNaturalDate.test(input);
    

    let result = { "unix": null, "natural": null };
    if (isNum) {
        result.unix = parseInt(input, 10);
        result.natural = moment(input, "X").format("MMMM DD, YYYY");
    } else if (isNatural) {
      result.natural = input;
      result.unix = moment(input,  "MMMM DD, YYYY").unix();
    }
    response.end(JSON.stringify(result));
}

//Create a server
let server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});