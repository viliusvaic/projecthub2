var pinterestAPI = require('pinterest-api');

var user = 'anapinskywalker';
var board = 'wanderlust';

var pinterest = pinterestAPI(user);

module.exports = {
    getPins: function () {
        pinterest.getPinsFromBoard(board, true, function(pins){
            console.log(JSON.stringify(pins, null, 2));
        });
    }
};
