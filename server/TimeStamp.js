'use strict';
const moment = require("moment");

module.exports = class TimeStamp {

    constructor(hostname, bingApiKey) {
        this._hostname = hostname;
    }

    //We need a function which handles requests and send response
    handleRequest(request, response){
        const regexIsNaturalDate = /^\w*(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}/;
        const regexIsNumberOnly = /^\d+$/;
        const regexLeadingEndingSlashes = /^\/|\/$/g;

        // handle leading or ending slash
        let input = request.params.input;
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
}