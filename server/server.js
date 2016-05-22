'use strict';
const HOSTNAME = 'https://fcc-ms-url-shortener-michaelleehobbs.c9users.io/';

const express = require('express');
const multer  = require('multer');
const path = require('path');
const secrets = require("../env/secrets.js");
const morgan = require('morgan');

const TimeStamp = require("./TimeStamp.js");
const RHP = require("./RHP.js");
const MSUrlShortener = require("./MSUrlShortener.js");
const Search = require("./Search.js");
const FileMetaData = require("./FileMetaData.js");

const app = express();
const upload = multer({ dest: 'uploads/' });

const timeStamp = new TimeStamp(HOSTNAME);
const rhp = new RHP(HOSTNAME);
const urlShortener = new MSUrlShortener(HOSTNAME);
const search = new Search(HOSTNAME, secrets.bingApiKey);
const fileMetaData = new FileMetaData(HOSTNAME);

// logging
app.use(morgan('dev'));

// use arrow function so we get proper binding of this
app.use(['/new/:url', '/:id(\\d*)/'], (req, res, next) => urlShortener.handleRequest(req, res, next));

app.use('/api/timestamp/:input', (req, res, next) => timeStamp.handleRequest(req, res, next));

app.use('/api/rhp', (req, res, next) => rhp.handleRequest(req, res, next));

app.use(['/api/latest/imagesearch', '/api/imagesearch/:search?'], (req, res, next) => search.handleRequest(req, res, next));

app.use('/api/filemetadata', upload.single('afile'), (req, res, next) => fileMetaData.handleRequest(req, res, next));

app.use('/', express.static(path.resolve('../client')));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(process.env.PORT, function() {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});