var Hapi = require('hapi');
var pins = require('./Pinterest');

var server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 3000
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        pins.getPins();
        reply("done");
    }
});


server.start(function (){console.log('Server running at: ', server.info.uri)});