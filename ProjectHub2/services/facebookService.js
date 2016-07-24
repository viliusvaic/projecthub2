var request = require('request');

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

// ~~~~~~~~~~~~~~~~~~~~~~ photos ~~~~~~~~~~~~~~~~~~~~~~~

function getPhotoPosts(options) {
    var oauthOptions = {
        url: 'https://graph.facebook.com/v2.6/' + options['pageId'] + '?fields=albums{photos{created_time,id,name,likes.limit(1).summary(true),comments.limit(1).summary(true),images, from}}&access_token=' + options['appId'] + '|' + options['appSecret'],
        JSON: true
    };
    makeApiCall(oauthOptions, makePhotoArray);  
}

function makePhotoObject(data){
    var object = {};
    var dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', 
                        hour: '2-digit', minute: '2-digit', second: '2-digit' };
    object['_id'] = 'fb' + data.id;
    date = new Date(data.created_time);
    object.date = date.toLocaleString('ko-KR', dateOptions);
    object.from = data.from;
    if (data.hasOwnProperty('name'))
        object.text = data.name;
    object.imgUrl = data.images[0].source;
    object.likes = data.likes.summary.total_count;
    object.comments = data.comments.summary.total_count;
    object.type = 'photo';
    
    return object;
}

function makePhotoArray(data) {
    var array = [];
    var object = {};
    data.albums.data.forEach(function(album) {
        console.log('album');
        album.photos.data.forEach(function(item) {
            object = makePhotoObject(item);
            array.push(object);
            });
    });
    console.log(array);
    return array;
}

// getPhotoPosts(myOptions, makeMediaArray);

// ~~~~~~~~~~~~~~~~~~~~~~ videos ~~~~~~~~~~~~~~~~~~~~~~~

function getVideoPosts(options) {
    var oauthOptions = {
        url: 'https://graph.facebook.com/v2.6/' + options['pageId'] + '?fields=videos{created_time,description,from,id,likes.limit(1).summary(true),comments.limit(1).summary(true),source}&access_token=' + options['appId'] + '|' + options['appSecret'],
        JSON: true
    };
    makeApiCall(oauthOptions, makeVideoArray);  
}

function makeVideoObject(data){
    var object = {};
    var dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', 
                        hour: '2-digit', minute: '2-digit', second: '2-digit' };
    object['_id'] = 'fb' + data.id;
    date = new Date(data.created_time);
    object.date = date.toLocaleString('ko-KR', dateOptions);
    object.from = data.from;
    object.text = data.description;
    object.videoUrl = data.source;
    object.likes = data.likes.summary.total_count;
    object.comments = data.comments.summary.total_count;
    object.type = 'video';
    
    return object;
}

function makeVideoArray(data) {
    var array = [];
    var object = {};
    data.videos.data.forEach(function(item) {
        object = makeVideoObject(item);
        array.push(object);
    });
    console.log(array);
    return array;
}

// getVideoPosts(myOptions);

// ~~~~~~~~~~~~~~~~~~~~~~ hashtags ~~~~~~~~~~~~~~~~~~~~~~~

function getHashtagsPosts(options) {
    var oauthOptions = {
        url: 'https://graph.facebook.com/v2.6/' + options['pageId'] + '?fields=feed{id,from,created_time,message,comments.limit(1).summary(true),sharedposts.limit(1).summary(true),likes.limit(1).summary(true)}&access_token='  + options['appId'] + '|' + options['appSecret'],
        JSON: true
    };
    makeApiCall(oauthOptions, makeHashtagsArray, options['hashtag']);   
}

function makeHashtagObject(data) {
    var object = {};
    var dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', 
                        hour: '2-digit', minute: '2-digit', second: '2-digit' };
    object['_id'] = 'fb' + data.id;
    date = new Date(data.created_time);
    object.date = date.toLocaleString('ko-KR', dateOptions);
    object.from = data.from;
    object.text = data.message;
    object.likesCount = data.likes.summary.total_count;
    object.commentsCount = data.comments.summary.total_count;
    
    return object;
}

function makeHashtagsArray(data, hashtag) {
    var array = [];
    var object = {};
    data.feed.data.forEach(function(item) {
        if (item.hasOwnProperty('message'))
            if (item.message.indexOf(hashtag) > -1) {
                object = makeHashtagObject(item);
                array.push(object);
            }
        });
    console.log(array);
    return array; 
}

// getHashtagsPosts(myOptions);