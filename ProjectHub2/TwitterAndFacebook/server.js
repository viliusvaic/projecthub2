// async bilioteka
var twitter = require('./twitter.js');
var facebook = require('./facebook.js')
var hapi = require('hapi');

var server = new hapi.Server();

server.connection({
    host: 'localhost',
    port: 3000
});

// ~~~~~~~~~ Twitter ~~~~~~~~~~~

var user = 'Greta7411';
var hashtag = 'test';
var consumer_key = 'fY76y640YGjAr1fPonV769GWJ';
var consumer_secret = 'ZNj0vnbrRF6Y5Mx00SZpYwBVebMWNPmIjKSXrucG5SYFtXVZtJ';

server.route({
    method: 'GET',
    path: '/TwitterTweets',
    handler: setValuesForTwitterTweets
});

server.route({
    method: 'GET',
    path: '/TwitterHashtags',
    handler: setValuesForTwitterHashtags
});

function setValuesForTwitterTweets(){
    twitter.setValues(consumer_key, consumer_secret, getTwitterTweets); 
}

function setValuesForTwitterHashtags() {
     twitter.setValues(consumer_key, consumer_secret, getTwitterHashtags);    
}

function getTwitterTweets() {
    twitter.getUserTweets(user, gotTwitterTweets); 
}

function getTwitterHashtags() {
    twitter.getUserTweetsByHashtag(user, hashtag, gotTwitterHashtag);       
 }
 
function gotTwitterTweets() {
    console.log('\n\n\n');
    console.log('~~~ twitter tweets');
    twitter.printUserTweets(); 
}

function gotTwitterHashtag() {
    console.log('\n\n\n');
    console.log('~~~ twitter hashtags');
    twitter.printHashtagTweets();
}

// ~~~~~~~~~ Facebook ~~~~~~~~~~~

var appId = '1749939841956026';
var appSecret = 'dfc5fd5baf5cf628928c88a4690e47c7';
var pageId = '1735542490035878';

server.route({
    method: 'GET',
    path: '/FacebookPosts',
    handler: setValuesForFacebookPosts
});


server.route({
    method: 'GET',
    path: '/FacebookHashtags',
    handler: setValuesForFacebookHashtags
});

function setValuesForFacebookPosts(){
    facebook.setValues(appId, appSecret, getFacebookPosts); 
}

function setValuesForFacebookHashtags() {
     facebook.setValues(appId, appSecret, getFacebookHashtags);    
}

function getFacebookPosts() {
    facebook.getPagePosts(pageId, gotFacebookPosts); 
}

function getFacebookHashtags() {
    facebook.getHashtagsPosts(pageId, gotFacebookHashtags);       
 }
 
function gotFacebookPosts() {
    console.log('\n\n\n');
    console.log('~~~ facebook posts');
    facebook.printPagePosts();
}

function gotFacebookHashtags() {
    console.log('\n\n\n');
    console.log('~~~ facebook hashtags');
    facebook.printHashtagPosts();
}

server.start(function () {});