var requestSuperAgent = require('superagent');
var request = require('request');
var cheerio = require('cheerio');
var util = require('util')
var async = require('async');

var tempData = [];

var myOptions = {
    'channelName' : 'RoomiChannel',
    'channelId' : 'UCHK-8VxbXtmeSky7RGuc41Q',
    'key' : 'AIzaSyADWHp-qDlNWW55BYP8fjQ5ALeGDm8Uo2A'
}

function getChannelId(options, callback) {
    requestSuperAgent.get('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + options['channelName'] +'&type=channel&key=' + options['key'])
       .end(function(err, res, callback){
           options['channelId'] = res['body']['items'][0]['id']['channelId'];
           callback();
   });
}

// ~~~~~~~~~~~~~~~~~~~ videos ~~~~~~~~~~~~~~~~~~~~~

makeApiCall(myOptions, makeYoutubeMediaArray);

function makeApiCall(options, callback) {
    requestSuperAgent.get('https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=' + options['channelId'] + '&maxResults=50&order=date&key=' + options['key'])
    .end(function(err, res){
           callback(res['body']);
   });
}

function makeMediaObject(data) {
    var dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    var object = {};
    object['_id'] = 'yt' + data.id.videoId;
    var date = new Date(data.snippet.publishedAt);
    object.date = date.toLocaleString('ko-KR', dateOptions);
    object.title = data.snippet.title;
    object.text = data.snippet.description;
    object.thumbnail = data.snippet.thumbnails.high.url;
    return object;
}

function makeYoutubeMediaArray(data) {
    var array = [];
    var object = {};
    data.items.forEach(function(item) {
        object = makeMediaObject(item);
        array.push(object);
    });
    return array;
}

// ~~~~~~~~~~~~~~~~~~~ hashtags ~~~~~~~~~~~~~~~~~~~~~

function getHashtagsVideoList(hashtag) {
    var url = 'https://www.youtube.com/results?search_query=%23' + hashtag;
    request(url, function(err, resp, body) {
        var $ = cheerio.load(body);
        var $data = $('.yt-lockup-title');
        async.each($data, getVideoUrlAndInfo, function (err) {
            getHashtags(null);
            });
        });   
}

function getVideoUrlAndInfo(element, callback) {
    getVideoInfo('https://youtube.com' + element.children[0].attribs.href, callback);
}

function getVideoInfo(url, callback) {
    var object = {};
    tempData = [];
    request(url, function(err, resp, body) {
        var $ = cheerio.load(body);
        var data = $('.watch-title-container');
        object['_id'] = 'yt' + url.substr(28);
        object.videoUrl = url;
        object.title = data['0'].children[0].next.attribs.title;
        data = $('.yt-user-info');
        object.from = data['0'].children[0].next.children[0].data;
        data = $('.watch-view-count');
        object.viewCount = data['0'].children[0].data;
        data = $('.watch-time-text');
        object.date = data['0'].children[0].data.slice(data['0'].children[0].data.indexOf(2), data['0'].children[0].data.length);
        data = $('.yt-uix-button-panel');
        object.text = data.text();
        object.text = object.text.slice(object.text.indexOf(object.date) + object.date.length); 
        console.log(object['_id']); 
        tempData.push(object);
        callback(null);
    })   
}

function getHashtags(err) {
    return tempData;
}

module.exports.getHashtagsVideos = getHashtagsVideoList;