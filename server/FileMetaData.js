'use strict';
const fs = require("fs");

const PORT = process.env.PORT;
const IP = process.env.IP;

module.exports = class FileMetaData {

    constructor(hostname) {
        this._hostname = hostname;
    }

    handleRequest(req, res, next) {
        if (req.file) {
            res.json({filesize: req.file.size}).end();
            fs.unlink(req.file.path);
            return;
        }
        res.status(400).end();
    }

};