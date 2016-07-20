var request = require('superagent');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/projecthub';
var collectionName = 'mergedDb';

var myOptions = {
    'channelName' : 'RoomiChannel',
    'channelId' : 'UCHK-8VxbXtmeSky7RGuc41Q',
    'key' : 'AIzaSyADWHp-qDlNWW55BYP8fjQ5ALeGDm8Uo2A'
}

function getChannelId(options, callback) {
    request.get('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + options['channelName'] +'&type=channel&key=' + options['key'])
       .end(function(err, res, callback){
           options['channelId'] = res['body']['items'][0]['id']['channelId'];
           callback();
   });
}

function makeApiCall(options, callback) {
    request.get('https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=' + options['channelId'] + '&maxResults=50&order=date&key=' + options['key'])
    .end(function(err, res){
           callback(res['body']);
   });
}

function printVideosData(data) {
    for(var i = 0; i < data['items'].length; i++) {
        console.log('---------------------------------------');
        console.log('id:', data['items'][i]['id']['videoId']);
        console.log('date:', data['items'][i]['snippet']['publishedAt']);
        console.log('title:', data['items'][i]['snippet']['title']);
        console.log('description:', data['items'][i]['snippet']['description']);
        console.log('thumbnail:', data['items'][i]['snippet']['thumbnails']['high']['url']);
    }
}

function setVideosDataToDb(data) {
     MongoClient.connect(url, function (err, db) {
        var collection = db.collection(collectionName);
        var object = {};
        for(var i = 0; i < data['items'].length; i++) {
            object['_id'] = 'yt' + data['items'][i]['id']['videoId']
            object['date'] = data['items'][i]['snippet']['publishedAt'];
            object['title'] = data['items'][i]['snippet']['title'];
            object['description'] = data['items'][i]['snippet']['description'];
            object['thumbnail'] = data['items'][i]['snippet']['thumbnails']['high']['url'];
            collection.save(object);
            }
    db.close(); 
    }); 
}

makeApiCall(myOptions, setVideosDataToDb);