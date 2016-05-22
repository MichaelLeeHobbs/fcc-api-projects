'use strict';
const env = require('../env/env.json');

exports.config = function() {
    console.log('Running in mode: ' + process.env.NODE_ENV);
    let node_env = process.env.NODE_ENV || 'development';
    return env[node_env];
};