var request = require('request');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/projecthub';
var collectionName = 'mergedDb';

var myOptions = {
    'appId' : '1749939841956026',
    'appSecret' : 'dfc5fd5baf5cf628928c88a4690e47c7',
    'hashtag' : '#hashtag',
    'pageId' : '1735542490035878'
}

// hashtag optional
function makeApiCall(oauthOptions, callback, hashtag) {
    request.get(oauthOptions, function(e, r, body) {
        try {
            var data  = JSON.parse(body);
            } catch (error) {
                console.log('not JSON')
                }      
    callback(data, hashtag);
    });
}

// ~~~~~~~~~~~~~~~~~~~~~~ posts ~~~~~~~~~~~~~~~~~~~~~~~

function getPagePosts(options, callback) {
    var oauthOptions = {
        url: 'https://graph.facebook.com/v2.6/' + options['pageId'] + '?fields=albums{photos{created_time,id,name,likes.limit(1).summary(true),comments.limit(1).summary(true),images, from}}&access_token=' + options['appId'] + '|' + options['appSecret'],
        JSON: true
    };
    makeApiCall(oauthOptions, callback);  
}

function printPagePosts(data) {
    console.log('\n\n\n')
    for (var i = 0; i < data['albums']['data'].length; i++) // albums
    {
       console.log('~~~~~~~~~~~~~~~~~~~~~~~~ album: ', i);
       for (var j = 0; j < data['albums']['data'][i]['photos']['data'].length; j++) { // items in albums
           console.log('-------------------');
           console.log('id:', data['albums']['data'][i]['photos']['data'][j]['id']);
           console.log('created_time:', data['albums']['data'][i]['photos']['data'][j]['created_time']);
           console.log('from: ', data['albums']['data'][i]['photos']['data'][j]['from']);
            if (data['albums']['data'][i]['photos']['data'][j].hasOwnProperty('name'))
                console.log('description:', data['albums']['data'][i]['photos']['data'][j]['name']);
            else
                console.log('description: ');
             
            console.log('url:', data['albums']['data'][i]['photos']['data'][j]['images'][0]['source']);
            console.log('likes:', data['albums']['data'][i]['photos']['data'][j]['likes']['summary']['total_count']);
            console.log('comments:', data['albums']['data'][i]['photos']['data'][j]['comments']['summary']['total_count']);
        }
    }
}

function setPagePostsToDb(data) {
    MongoClient.connect(url, function (err, db) {
        var collection = db.collection(collectionName);
        var object = {};
        for (var i = 0; i < data['albums']['data'].length; i++) // albums
        {
        for (var j = 0; j < data['albums']['data'][i]['photos']['data'].length; j++) { // items in albums
            object['_id'] =  'fb' + data['albums']['data'][i]['photos']['data'][j]['id'];
            var date = new Date(data['albums']['data'][i]['photos']['data'][j]['created_time']);
            object['date'] = date;
            object['from'] = data['albums']['data'][i]['photos']['data'][j]['from'];
                if (data['albums']['data'][i]['photos']['data'][j].hasOwnProperty('name'))
                    object['description'] = data['albums']['data'][i]['photos']['data'][j]['name'];
                else
                    object['description'] = '';
                
                object['url'] = data['albums']['data'][i]['photos']['data'][j]['images'][0]['source'];
                object['likes'] = data['albums']['data'][i]['photos']['data'][j]['likes']['summary']['total_count'];
                object['comments'] = data['albums']['data'][i]['photos']['data'][j]['comments']['summary']['total_count'];
                collection.save(object);
            }
        }
    db.close(); 
    }); 
}

getPagePosts(myOptions, setPagePostsToDb)

// ~~~~~~~~~~~~~~~~~~~~~~ hashtags ~~~~~~~~~~~~~~~~~~~~~~~

function getHashtagPosts(options, callback) {
    var oauthOptions = {
        url: 'https://graph.facebook.com/v2.6/' + options['pageId'] + '?fields=feed{id,from,created_time,message,comments.limit(1).summary(true),sharedposts.limit(1).summary(true),likes.limit(1).summary(true)}&access_token='  + options['appId'] + '|' + options['appSecret'],
        JSON: true
    };
    makeApiCall(oauthOptions, callback, options['hashtag']);   
}

function printHashtagPosts(data, hashtag) {
    console.log('\n\n\n');
    for (var i = 0; i < data['feed']['data'].length; i++) {
        if (data['feed']['data'][i].hasOwnProperty('message'))
            if (data['feed']['data'][i]['message'].indexOf(hashtag) > -1) {
                console.log('-------------------');
                console.log('id', data['feed']['data'][i]['id']);
                console.log('created_time', data['feed']['data'][i]['created_time']);
                console.log('from', data['feed']['data'][i]['from']);
                console.log('message: ', data['feed']['data'][i]['message']);
                console.log('likes', data['feed']['data'][i]['likes']['summary']['total_count']);
                console.log('comments', data['feed']['data'][i]['comments']['summary']['total_count']);
            }
    }
}

// getHashtagPosts(myOptions, printHashtagPosts);
