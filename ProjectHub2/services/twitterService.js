var request = require('request');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/projecthub';
var collectionName = 'mergedDb';

var myOptions = {
    'encrypted_secret' : '',
    'bearer_token' : '',
    'user' : 'Greta7411',
    'consumer_key' : 'fY76y640YGjAr1fPonV769GWJ',
    'consumer_secret' : 'ZNj0vnbrRF6Y5Mx00SZpYwBVebMWNPmIjKSXrucG5SYFtXVZtJ',
    'hashtag' : 'test',
    'db_collection_name' : 'twitterFeed' 
}

function getBearerToken(options, callback) {
    options['encrypted_secret'] = new Buffer(options['consumer_key'] + ':' + options['consumer_secret']).toString('base64');
    var oauthOptions = {
        url: 'https://api.twitter.com/oauth2/token',
        headers: {'Authorization': 'Basic ' + options['encrypted_secret'], 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        body: 'grant_type=client_credentials' 
    };
    request.post(oauthOptions, function(e, r, body) {  // body is not a JSON
    options['bearer_token'] = body.substr(39, 114);
    callback(options);
    return;
    }); 
}

function makeApiCall(oauthOptions, callback) {
    console.log(oauthOptions);
    request.get(oauthOptions, function(e, r, body) {
        try {
            var data = JSON.parse(body);
            } catch (error) {
                console.log('not JSON')
                }
     callback(data);
     return;
     });   
}

// ~~~~~~~~~~~~~~~~~ tweets ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function printOptionsDataAndGetTweets(options) {
    console.log(options)
    // getTwitterTweets(options, printTwitterTweets);
    getTwitterTweets(options, setTwitterTweetsToDb);
}

function getTwitterTweets(options, callback) {
    var oauthOptions = {
     url: 'https://api.twitter.com//1.1/statuses/user_timeline.json?count=100&screen_name=' + options['user'],
     headers: {'Authorization': 'Bearer ' + options['bearer_token']} };
     makeApiCall(oauthOptions, callback);
}

function printTwitterTweets(data) {
     console.log('\n\n\n');
    for (var i = 0; i < data.length; i++) {
        if (data[i].hasOwnProperty('extended_entities')) {
            console.log('-------------------------------------');
            console.log('id:', data[i]['id']); 
            console.log('date:', data[i]['created_at']);
            console.log('screen_name:', data[i]['user']['screen_name']);
            console.log('text:', data[i]['text']);
            console.log('url:', data[i]['extended_entities']['media'][0]['media_url']);
            console.log('favorite:', data[i]['favorite_count']);
            console.log('retweet:', data[i]['retweet_count']);
            console.log('type: ', data[i]['extended_entities']['media'][0]['type']);
            if (data[i]['extended_entities']['media'][0]['type'] == 'video')
            {
                console.log('video_url:', data[i]['extended_entities']['media'][0]['video_info']['variants'][0]['url']);
            }  
            else if (data[i]['extended_entities']['media'][0]['type'] == 'animated_gif') {
                console.log('animated_gif_url:', data[i]['extended_entities']['media'][0]['video_info']['variants'][0]['url'])
            }
        }    
    }
}

function setTwitterTweetsToDb(data) {
    MongoClient.connect(url, function (err, db) {
        var collection = db.collection(collectionName);
        var object = {};
        for (var i = 0; i < data.length; i++) {
            if (data[i].hasOwnProperty('extended_entities')) {;
                object['_id'] = 'tw' + data[i]['id'];
                var date = new Date(data[i]['created_at']);
                object['date'] = date;
                object['screen_name'] = data[i]['user']['screen_name'];
                object['text'] = data[i]['text'];
                object['url'] = data[i]['extended_entities']['media'][0]['media_url'];
                object['favourite'] = data[i]['favorite_count'];
                object['retweet'] = data[i]['retweet_count']; 
                object['type'] = data[i]['extended_entities']['media'][0]['type']
                if (data[i]['extended_entities']['media'][0]['type'] == 'video') {
                    object['video_url'] =  data[i]['extended_entities']['media'][0]['video_info']['variants'][0]['url'];
                }  
                else if (data[i]['extended_entities']['media'][0]['type'] == 'animated_gif') {
                    object['animated_gif_url'] =  data[i]['extended_entities']['media'][0]['video_info']['variants'][0]['url'];
                }
                collection.save(object);
            } 
        }  
        db.close();    
    })   
}

getBearerToken(myOptions, printOptionsDataAndGetTweets);

// ~~~~~~~~~~~~~~~~~ hashtags ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function printOptionsDataAndGetHashtags(options) {
    console.log(options)
    var hashtagsData;
    getTwitterHashtags(options, hashtagsData, printTwitterHashtags);
}

function getTwitterHashtags(options, data, callback) {
    var oauthOptions = {
        url: 'https://api.twitter.com/1.1/search/tweets.json?q=%23' + options['hashtag'] + '%20from%3A' + options['user'],
        headers: {'Authorization': 'Bearer ' + options['bearer_token']} };  
        makeApiCall(oauthOptions, data, callback);
}

function printTwitterHashtags(data) {
    console.log('\n\n\n');
    for (var i = 0; i < data['statuses'].length; i++) {
        console.log('-------------------------------------');
        console.log('id:', data['statuses'][i]['id']); 
        console.log('date:', data['statuses'][i]['created_at']);
        console.log('text:', data['statuses'][i]['text']);
        console.log('favorite:', data['statuses'][i]['favorite_count']);
        console.log('retweet:', data['statuses'][i]['retweet_count']);
    } 
}

// getBearerToken(myOptions, printOptionsDataAndGetHashtags);