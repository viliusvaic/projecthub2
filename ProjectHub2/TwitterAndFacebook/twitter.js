var request = require('request');

var consumer_key = null;
var consumer_secret = null;
var encrypted_secret = null;
var bearer_token = null;
var tweetsData = null;
var hashtagTweetsData = null;
// var tweetsList = null;

function setValues(cons_key, cons_secret, callback) {
    consumer_key = cons_key;
    consumer_secret = cons_secret;
    encrypted_secret = new Buffer(consumer_key + ':' + consumer_secret).toString('base64');
    
    var oauthOptions = {
        url: 'https://api.twitter.com/oauth2/token',
        headers: {'Authorization': 'Basic ' + encrypted_secret, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        body: 'grant_type=client_credentials' 
    };
    request.post(oauthOptions, function(e, r, body) {  // body is not a JSON
        bearer_token = body.substr(39, 114);
        callback(bearer_token);
        return;
        }); 
}

function setTweetsByHashtag(data, callback) {   
    hashtagTweetsData = data;
    callback();
    return;
}

function setUserTweets(data, callback) {    
    tweetsData = data;
    callback();
    return;
}

function printUserTweets() {
    for (var i = 0; i < tweetsData.length; i++) {
        if (tweetsData[i].hasOwnProperty('extended_entities')) {
            console.log('-------------------------------------');
            console.log('id:', tweetsData[i]['id']); 
            console.log('date:', tweetsData[i]['created_at']);
            console.log('text:', tweetsData[i]['text']);
            console.log('url:', tweetsData[i]['extended_entities']['media'][0]['media_url']);
            console.log('favourite:', tweetsData[i]['favorite_count']);
            console.log('retweet:', tweetsData[i]['retweet_count']);    
        }    
    }
}

function printHashtagTweets() {
       for (var i = 0; i < hashtagTweetsData['statuses'].length; i++) {
        console.log('-------------------------------------');
        console.log('id:', hashtagTweetsData['statuses'][i]['id']); 
        console.log('date:', hashtagTweetsData['statuses'][i]['created_at']);
        console.log('text:', hashtagTweetsData['statuses'][i]['text']);
        console.log('favourite:', hashtagTweetsData['statuses'][i]['favorite_count']);
        console.log('retweet:', hashtagTweetsData['statuses'][i]['retweet_count']);
    } 
}

function printValues() {
    console.log('Print values:', consumer_key, consumer_secret, bearer_token);
} 

function getUserTweets(user, callback) {
     var oauthOptions = {
     url: 'https://api.twitter.com//1.1/statuses/user_timeline.json?count=100&screen_name=' + user,
     headers: {'Authorization': 'Bearer ' + bearer_token} };
     makeApiCall(oauthOptions, setUserTweets, callback);
}

function getUserTweetsByHashtag(user, hashtag, callback) {
    var oauthOptions = {
        url: 'https://api.twitter.com/1.1/search/tweets.json?q=%23' + hashtag + '%20from%3A' + user,
        headers: {'Authorization': 'Bearer ' + bearer_token} };  
        makeApiCall(oauthOptions, setTweetsByHashtag, callback);
}

// callback1 - set value somewhere,
// callback2 - pass function to callback1
function makeApiCall(oauthOptions, callback1, callback2) {
    request.get(oauthOptions, function(e, r, body) {
        try {
            var data  = JSON.parse(body);
            } catch (error) {
                console.log('not JSON')
                }
     callback1(data, callback2);
     return;
     });     
}

module.exports.setValues = setValues;
module.exports.printValues = printValues;
module.exports.getUserTweets = getUserTweets;
module.exports.getUserTweetsByHashtag = getUserTweetsByHashtag;
module.exports.printUserTweets = printUserTweets;
module.exports.printHashtagTweets = printHashtagTweets;