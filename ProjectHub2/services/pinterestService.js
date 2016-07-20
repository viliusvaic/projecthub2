var request = require('request');

var user = 'anapinskywalker';
var board = 'wanderlust';
var token = 'AXL45WJU6_1FdqR9LufRrhWGPy0SFGMTr9mE14tDQsU3ruAofgAAAAA';

var url = 'https://api.pinterest.com/v1/boards/' + user + '/' + board + '/pins/?access_token=' + token
    + '&fields=id%2Cnote%2Ccreated_at%2Cimage%2Cmedia';

function  makeAPIcall() {
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(JSON.stringify(body, null, 2));
        }
    })
}

module.exports = {
    getPins(request, reply) {
        makeAPIcall();
        reply("done");
    }
}