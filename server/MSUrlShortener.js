'use strict';
//Lets require/import the HTTP module
const http = require('http');

module.exports = class MSUrlShortener {
  constructor(hostname) {
    this._hostname = hostname;
    this._urlMap = new Map();
    this._urlReverseMap = new Map();
    this._idGenerator = this.getId();
    this.shortenUrl('https://www.google.com');
  }

  handleRequest(request, response, next) {
    //console.log(`request = ${JSON.stringify(request.params)}`);
    let url = request.params.url;
    if (url) {
      if (request.params.proto) {
        url = request.params.proto + '//' + url;
      }
      response.end(JSON.stringify(this.shortenUrl(url)));
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
      shortUrl = this._hostname + this._urlReverseMap.get(url);
    } else {
      id = `${this.id}`;
      shortUrl = this._hostname + '/' + id;
      this._urlMap.set(id, url);
      this._urlReverseMap.set(url, id);
    }
    return { "original_url": url, "short_url": shortUrl };
  }

  redirect(url) {
    return (this._urlMap.has(url)) ? `${this._urlMap.get(url)}` : { "error": "Url not in database." };
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
        // we set it to 1 and not 0 so the default google shorten url will not be overwritten
        // However, the universe will end before we ever reach MAX_SAFE_INTEGER
        nextId = 1;
      }
    }
  }

  get id() { return this._idGenerator.next().value; }

  trimLeadingSlash(url) {
    const regexLeadingSlashes = /^\//g;
    return url.replace(regexLeadingSlashes, '');
  }
};
