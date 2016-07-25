var request = require('request');

var user = 'kevinhart4real';
var url = 'https://www.instagram.com/' + user + '/media/';

function makeAPIcall() {
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(JSON.stringify(body, null, 2)) // Print the json response
        }
    });
}

module.exports = {
    getInsta(request, reply) {
        makeAPIcall();
        reply("done");
    }
}