var request = require('request');

category = 1;
type = 'popular';

url = 'https://api.vineapp.com/timelines/channels/' + category + '/' + type;

function makeAPIcall() {
    request({
        url: url,
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            console.log(JSON.stringify(body, null, 2)) // Print the json response
        }
    })
}

module.exports = {
    getVines(request, reply) {
        makeAPIcall();
        reply("done");
    }
};