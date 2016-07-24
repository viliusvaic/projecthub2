var request = require('request');

var maxItems = 10;

var myOptions = {
    'encryptedSecret' : '',
    'bearerToken' : 'AAAAAAAAAAAAAAAAAAAAAOZawAAAAAAAjZeKa0epD3VkLQls%2Fhx98vuz8Ic%3DxA5sIxcigNRm2hkXMQ5mNnCsJpaeKLp5dyPuBXtF9D4RnLcQDL',
    'user' : 'Greta7411',
    'consumerKey' : 'fY76y640YGjAr1fPonV769GWJ',
    'consumerSecret' : 'ZNj0vnbrRF6Y5Mx00SZpYwBVebMWNPmIjKSXrucG5SYFtXVZtJ',
    'hashtag' : 'test'
}

function getBearerToken(options, callback) {
    options['encryptedSecret'] = new Buffer(options.consumerKey + ':' + options.consumerSecret).toString('base64');
    var oauthOptions = {
        url: 'https://api.twitter.com/oauth2/token',
        headers: {'Authorization': 'Basic ' + options['encryptedSecret'], 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        body: 'grant_type=client_credentials' 
    };
    request.post(oauthOptions, function(e, r, body) {
        options.bearerToken = body.substr(39, 114);
        callback(options);
        return;
    }); 
}

function makeApiCall(oauthOptions, callback) {
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

// ~~~~~~~~~~~~~~~~~ media ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function getTwitterTweets(options) {
    var oauthOptions = {
        headers: {'Authorization': 'Bearer ' + options.bearerToken} };
    if (options.hasOwnProperty('maxId'))
        oauthOptions.url =  'https://api.twitter.com//1.1/statuses/user_timeline.json?count=' + maxItems + '&max_id=' + options.maxId + '&screen_name=' + options.user;
    else 
        oauthOptions.url = 'https://api.twitter.com//1.1/statuses/user_timeline.json?count=' + maxItems + '&screen_name=' + options.user;
    makeApiCall(oauthOptions, getArrayOfMediaTweets);
}

function makeMediaObject(data) {
    var object = {};
    var dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', 
                        hour: '2-digit', minute: '2-digit', second: '2-digit' };
    object._id = 'tw' + data.id;
    var date = new Date(data.created_at);
    object.date = date.toLocaleString('ko-KR', dateOptions);
    object.from = data.user.screen_name;
    object.text = data.text;
    object.imgUrl = data.extended_entities.media[0].media_url;
    object.favouriteCount = data.favorite_count;
    object.retweetCount = data.retweet_count; 
    object.type = data.extended_entities.media[0].type;
    if (data.extended_entities.media[0].type == 'video') {
       object.videoUrl =  data.extended_entities.media[0].video_info.variants[0].url;
    }  
    else if (data.extended_entities.media[0].type == 'animated_gif') {
        object.animatedGifUrl =  data.extended_entities.media[0].video_info.variants[0].url;
        }
    return object;
} 

function getArrayOfMediaTweets(data) {
    var array = [];
    var object = {};
    data.forEach(function(item) {
        if (item.hasOwnProperty('extended_entities')) {
            object = makeMediaObject(item);
            array.push(object);
            }
    });
    return array;
}

// getTwitterTweets(myOptions);

// ~~~~~~~~~~~~~~~~~ hashtags ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function getTwitterHashtags(options) {
    var oauthOptions = {
        headers: {'Authorization': 'Bearer ' + options.bearerToken} };  
    if (options.hasOwnProperty('maxId'))
        oauthOptions.url = 'https://api.twitter.com/1.1/search/tweets.json?q=%23' + options.hashtag + '%20from%3A' + options.user + '&max_id=' + options.maxId;
    else
        oauthOptions.url = 'https://api.twitter.com/1.1/search/tweets.json?q=%23' + options.hashtag + '%20from%3A' + options.user; 
    makeApiCall(oauthOptions, getArrayOfHashtags);
}

function makeHashtagsObject(data) {   
    var object = {};
    var dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', 
                        hour: '2-digit', minute: '2-digit', second: '2-digit' };
    object.id = '_tw' + data.id;
    var date = new Date(data.created_at);
    object.date = date.toLocaleString('ko-KR', dateOptions);
    object.text = data.text;
    object.favoriteCount = data.favorite_count;
    object.retweetCount = data.retweet_count;
    object.from = data.user.screen_name;
    object.type = 'text';
    object.hashtags = data.entities.hashtags;
    return object;
}

function getArrayOfHashtags(data, callback) {
    // console.log(data);
    var array = [];
    var object = {};
    data.statuses.forEach(function(item) {
        object = makeHashtagsObject(item);
        array.push(object);
    });  
    return array;
}

// getTwitterHashtags(myOptions);