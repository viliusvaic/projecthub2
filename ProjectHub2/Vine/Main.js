var Hapi = require('hapi');
var request = require('request');

var server = new Hapi.Server();

category = 1;
type = 'popular';

url = 'https://api.vineapp.com/timelines/channels/' + category + '/' + type;

server.connection({
    host: 'localhost',
    port: 3000
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply("done");
    }
});

request({
    url: url,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        console.log(JSON.stringify(body, null, 2)) // Print the json response
    }
})


server.start(function (){console.log('Server running at: ', server.info.uri)});