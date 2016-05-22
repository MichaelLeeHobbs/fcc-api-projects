'use strict';
//Lets require/import the HTTP module
const request = require('request');

const SECONDS_IN_DAY = 86400;
const MS_IN_SECOND = 1000;

module.exports = class Search {

    constructor(hostname, bingApiKey) {
        this._hostname = hostname;
        this._bingApiKey = bingApiKey;
        this._recentSearchesSet = new Set();
        this._data = '';
    }

    handleRequest(req, res, next) {
        if (req.params.search) return this._search(req, res, next);
        if (req.baseUrl === '/api/latest/imagesearch') return this._recentSearches(req, res, next);

        next();
    }

    _newSearch(search) {
        let recentSearch = {
            term: search,
            date: new Date()
        };
        this._recentSearchesSet.add(recentSearch);
        timeout: setTimeout(() => {
            this._recentSearchesSet.delete(recentSearch);
        }, SECONDS_IN_DAY * MS_IN_SECOND);
    }

    _genrateOptions(search, count, offset) {
        return {
            // https://api.datamarket.azure.com/Bing/Search/v1/Image?Query=%27cat%27&Adult=%27Strict%27
            uri: `https://api.datamarket.azure.com/Bing/Search/v1/Image?$format=json&Query='${search}'&$top=${count}&$skip=${offset}&Market='en-us'&Adult='Strict'`,
            method: 'GET',
            auth: {
                user: this._bingApiKey,
                pass: this._bingApiKey
            },
            headers: {
                "Ocp-Apim-Subscription-Key": this._bingApiKey
            }
        };
    }

    _onResponse(res) {
        console.log('statusCode: ', res.statusCode);
        console.log('headers: ', res.headers);
        console.log('rRes.body: ', res.body);
    }

    _onData(data) {
        return (chunk)=>data.value += chunk;
    }

    _onEnd(res, data) {
        return ()=>{
            let response = [];
            data.value = JSON.parse(data.value);
            data.value['d']['results'].forEach((item) => {
                response.push({
                    url: item["MediaUrl"],
                    snippet: item["Title"],
                    thumbnail: item["Thumbnail"]["MediaUrl"],
                    context: item["SourceUrl"]
                });
            });
            res.end(JSON.stringify(response, null, 2));
        };
    }

    _onError(res) {
        return (error)=>{
            console.error(error);
            res.end(error);
        };
    }

    _search(req, res, next) {
        let count = 50;
        let offset = (Number.isNaN(req.query.offset)) ? Number.parse(req.query.offset) * count : '0';
        let search = encodeURIComponent(req.params.search);

        this._newSearch(search);

        let options = this._genrateOptions(search, count, offset);

        let data = { value: '' };
        request
            .get(options)
            //.on('response', this._onResponse)
            .on('data', this._onData(data))
            .on('end', this._onEnd(res, data))
            .on('error', this._onError(res));
    }

    _recentSearches(req, res, next) {
        res.end(this._setToJson(this._recentSearchesSet));
    }

    _setToJson(setObj) {
        let result = [];
        setObj.forEach((obj)=>{
            let newObj = obj;
            newObj.term = decodeURIComponent(newObj.term);
            result.push(newObj);
        });
        return JSON.stringify(result);
    }


};