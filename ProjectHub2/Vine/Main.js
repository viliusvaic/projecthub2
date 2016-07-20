var Hapi = require('hapi');
var VineService = require('./VineService.js');

var server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 3000
});

server.route({
    method: 'GET',
    path: '/vine',
    handler: VineService.getVines
})

server.start(function (){console.log('Server running at: ', server.info.uri)});