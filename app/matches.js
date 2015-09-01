var question = require('./Questions');

var opponent = function () {
    var _id,
    _socket;
    //var _question = question();

    function _getSocket() {
        return _socket;
    }
    function _setSocket(value) {
        _socket = value;
    }

    function _getRandomQuestion() {
        return question.Questions.getRandom();
    }

    return {
        id: _id,
        getSocket: _getSocket,
        setSocket: _setSocket,
        getRandomQuestion: _getRandomQuestion
    };
};

var match = function () {
    var _opponent1 = opponent(),
        _opponent2 = opponent(),
        _status = "new", //new - open - closed
        _currentQuestion;

    return {
        opponent1: _opponent1,
        opponent2: _opponent2,
        status: _status,
        currentQuestion: _currentQuestion
    };
};

var matches = (function () {
    var arr = [],
        _subscribeCallback;

    function _addMatch(id) {
        var m = match();
        m.opponent1.id = id;
        arr.push(m);
        _subscribeCallback();
        return m;
    }
    function _getMatch(id,socket) {
        var existing = undefined;
        //Search for existin game for id
        arr.forEach(function (m) {
            if (m.opponent1.id === id || m.opponent2.id === id) {
                existing = m;
            }
        });
        //Search for open games (changes status from new to open)
        if (existing == undefined) {
            arr.forEach(function (m) {
                if (m.opponent1.id != undefined && m.opponent2.id == undefined) { 
                    m.opponent2.id = id;
                    m.opponent2.setSocket(socket);
                    m.status = "open";
                    _subscribeCallback();
                    existing = m;
                };
            });
        }

        //Return new open game
        if (existing == undefined) {
            existing = _addMatch(id);
            existing.opponent1.setSocket(socket);
        }
        return existing;
    }
    function _subscribe(callback) {
        _subscribeCallback = callback;
    }

    return {
        items: arr,
        getMatch: _getMatch,
        subscribe: _subscribe
    };
})();

exports.matches = matches;