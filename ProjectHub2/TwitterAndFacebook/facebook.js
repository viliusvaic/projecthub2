var request = require('request');
console.log('test');
var appId = null;
var appSecret = null;
var postsData = null;
var hashtagsData = null;
var hashtag = '#hashtag';

function setValues(id, secret, callback) {
    appId = id;
    appSecret = secret;
    callback();
    return;
}

function getPagePosts(pageId, callback) {
    var oauthOptions = {
        url: 'https://graph.facebook.com/v2.6/' + pageId + '?fields=albums{photos{created_time,id,name,likes.limit(1).summary(true),sharedposts.limit(1).summary(true),comments.limit(1).summary(true),images}}&access_token=' + appId + '|' + appSecret,
        JSON: true
    };
    makeApiCall(oauthOptions, setPostsData, callback);  
}

function getHashtagsPosts(pageId, callback) {
    var oauthOptions = {
        url: 'https://graph.facebook.com/v2.6/' + pageId + '?fields=feed{id,created_time,message,comments.limit(1).summary(true),sharedposts.limit(1).summary(true),likes.limit(1).summary(true)}&access_token='  + appId + '|' + appSecret,
        JSON: true
    };
    makeApiCall(oauthOptions, setHashtagsData, callback);   
}

function makeApiCall(oauthOptions, callback1, callback2) {
    request.get(oauthOptions, function(e, r, body) {
        try {
            var data  = JSON.parse(body);
            } catch (error) {
                console.log('not JSON')
                }      
    callback1(data, callback2);
    });
}

function setHashtagsData(data, callback) {
    hashtagsData = data;
    console.log(callback);
    callback();
    return;
}

function setPostsData(data, callback) {
    postsData = data;
    callback();
    return;
}

function printPagePosts() {
    for (var i = 0; i < postsData['albums']['data'].length; i++) // albums
    {
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~ album: ', i);
       for (var j = 0; j < postsData['albums']['data'][i]['photos']['data'].length; j++) { // items in albums
           console.log('-------------------');
           console.log('id:', postsData['albums']['data'][i]['photos']['data'][j]['id']);
           console.log('created_time:', postsData['albums']['data'][i]['photos']['data'][j]['created_time']);
            if (postsData['albums']['data'][i]['photos']['data'][j].hasOwnProperty('name'))
                console.log('name:', postsData['albums']['data'][i]['photos']['data'][j]['name']);
            else
                console.log('name: ');
             
            console.log('url:', postsData['albums']['data'][i]['photos']['data'][j]['images'][0]['source']);
               
            if (postsData['albums']['data'][i]['photos']['data'][j]['likes']['summary'].hasOwnProperty('total_count')) 
                console.log('likes:', postsData['albums']['data'][i]['photos']['data'][j]['likes']['summary']['total_count']);
            else
                console.log('likes: 0');
            
           // if (postsData['albums']['data'][i]['photos']['data'][j].hasOwnProperty('sharedposts')) 
           //    console.log('shares:', postsData['albums']['data'][i]['photos']['data'][j]['sharedpots']['data'].length);
           // else
           //     console.log('shares: 0');
            
            if (postsData['albums']['data'][i]['photos']['data'][j]['comments']['summary'].hasOwnProperty('total_count')) 
                console.log('comments:', postsData['albums']['data'][i]['photos']['data'][j]['comments']['summary']['total_count']);
            else
                console.log('comments: 0');
        }
    }
}

function printHashtagPosts() {
    for (var i = 0; i < hashtagsData['feed']['data'].length; i++) {
        if (hashtagsData['feed']['data'][i].hasOwnProperty('message'))
            if (hashtagsData['feed']['data'][i]['message'].indexOf(hashtag) > -1) {
                console.log('-------------------');
                console.log('id', hashtagsData['feed']['data'][i]['id']);
                console.log('created_time', hashtagsData['feed']['data'][i]['created_time']);
                console.log('message: ', hashtagsData['feed']['data'][i]['message']);
                console.log('likes', hashtagsData['feed']['data'][i]['likes']['summary']['total_count']);
                console.log('comments', hashtagsData['feed']['data'][i]['comments']['summary']['total_count']);
            }
    }
}
 
module.exports.setValues = setValues;
module.exports.getPagePosts = getPagePosts;
module.exports.getHashtagsPosts = getHashtagsPosts;
module.exports.printPagePosts = printPagePosts;
module.exports.printHashtagPosts = printHashtagPosts;