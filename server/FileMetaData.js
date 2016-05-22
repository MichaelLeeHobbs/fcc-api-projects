'use strict';
const fs = require("fs");

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