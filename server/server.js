'use strict';
const express = require('express');
const app = express();
const MSUrlShortener = require("./MSUrlShortener.js");
const path = require('path');

const HOSTNAME = 'https://fcc-ms-url-shortener-michaelleehobbs.c9users.io/';
const urlShortener = new MSUrlShortener(HOSTNAME);

// use arrow function so we get proper binding of this
app.use(['/new/:url', '/:id(\d*)' ], (request, response, next)=>urlShortener.handleRequest(request, response, next));

app.use('/', express.static(path.resolve('../client')));

app.get('/', function (req, res) {
  res.sendFile(path.resolve('client/index.html'));
});

app.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});