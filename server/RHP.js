'use strict';
module.exports = class RequestHeaderPacket {

    constructor(hostname, bingApiKey) {
        this._hostname = hostname;
    }

    //We need a function which handles requests and send response
    handleRequest(request, response){
        const regexSoftware = /\((.*?)\)/;

        // request.ip has the wrong value for some reason so we use the get method to get the ip from the header
        // http://expressjs.com/en/4x/api.html#req.ip - Contains the remote IP address of the request.
        let ipAddress = request.get('x-forwarded-for');
        let language = request.get('accept-language').split(',')[0];
        let software =  regexSoftware.exec(request.get('user-agent'))[1];
        let result = {
            "ipaddress": ipAddress,
            "language": language,
            "software": software
        };

        response.json(result).end();
    }
};
