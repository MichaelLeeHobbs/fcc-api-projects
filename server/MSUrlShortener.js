'use strict';
//Lets require/import the HTTP module
const http = require('http');

const PORT = process.env.PORT;
const IP = process.env.IP;
const HOSTNAME = 'https://fcc-ms-url-shortener-michaelleehobbs.c9users.io/';

module.exports = class MSUrlShortener {
  constructor(hostname) {
    this._hostname = hostname;
    this._urlMap = new Map();
    this._urlReverseMap = new Map();
    this._idGenerator = this.getId();
  }

  handleRequest(request, response, next) {
    if (request.params.url) {
      response.end(JSON.stringify(this.shortenUrl(request.params.url)));
      return;
    }

    if (request.params.id) {
      let result = this.redirect(request.params.id);
      if (result.error) {
        response.end(JSON.stringify(result));
      } else {
        response.redirect(result);
      }
    }
    next();
  }

  shortenUrl(url) {
    let shortUrl;
    let id;
    if (this._urlReverseMap.has(url)) {
      shortUrl = HOSTNAME + this._urlReverseMap.get(url);
    } else {
      id = `${this.id}`;
      shortUrl = HOSTNAME + id;
      this._urlMap.set(id, url);
      this._urlReverseMap.set(url, id);
    }
    return { "original_url": url, "short_url": shortUrl };
  }

  redirect(url) {
    return (this._urlMap.has(url)) ? `https://${this._urlMap.get(url)}` : { "error": "Url not in database." };
  }

  isValidUrl(url) {
    const regexUrl = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    return regexUrl.test(url);
  }

  *getId() {
    let nextId = 0;
    while(true) {
      yield nextId++;
      if (nextId === Number.MAX_SAFE_INTEGER) {
        nextId = 0;
      }
    }
  }

  get id() { return this._idGenerator.next().value; }

  trimLeadingSlash(url) {
    const regexLeadingSlashes = /^\//g;
    return url.replace(regexLeadingSlashes, '');
  }
};