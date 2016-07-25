var request = require('request');

var options = {
    user: 'anapinskywalker',
    board: 'wanderlust',
    token: 'AXL45WJU6_1FdqR9LufRrhWGPy0SFGMTr9mE14tDQsU3ruAofgAAAAA'
}

var dataToReturn = [];

function  makeAPIcall() {
    var url = 'https://api.pinterest.com/v1/boards/' + options.user + '/' + options.board + '/pins/?access_token='
        + options.token + '&fields=id%2Cnote%2Ccreated_at%2Cimage%2Cmedia';
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            parseData(body);
            console.log(JSON.stringify(dataToReturn, null, 2));
        }
    })
}

function parseData(dataSource) {
    dataSource.data.forEach(function (item) {
        var parsedItem = {
            _id: 'pi' + item.id,
            date: item.created_at,
            description: item.note,
            url: item.image.original.url
        }
        dataToReturn.push(parsedItem);
    });
}

module.exports = {
    getPins(request, reply) {
        makeAPIcall();
        reply(dataToReturn);
    }
}