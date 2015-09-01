var questions = require('./questions.json');

var Questions = (function () {

    function _getRandom() {
        var random =  Math.floor(Math.random() * (questions["questionDB"].length));

	    return questions["questionDB"][random];
    }

	return {
        getRandom: _getRandom
	};
})();

exports.Questions = Questions;