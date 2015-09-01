/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function () {

  console.log('Express server listening on port ' + app.get('port'));
}),
    myApp = require('./app/matches'),
    matches = myApp.matches,
    io = require('socket.io').listen(server),
    observersForDebug = require('./app/Observer').ObserverList;

//enable websocket transport.
io.configure(function () {
    io.set('transports', ['websocket']);
    io.set('loglevel', 5);
});

function matchesChanged() {
    for (i = 0; i < observersForDebug.count() ; i++) {
        var socket = observersForDebug.get(i);
        socket.emit('debugMatches', matches.items);
    }
}

matches.subscribe(matchesChanged);

io.sockets.on('connection', function (socket) {

    socket.emit('WelcomeMessage', { msg: 'Welcome player: ' + socket.id });
    /*
    Workflow
        1.Connected
        2.WantToPlay (PlayPressed)
            2.1 WaitingForOpponent (new)
            2.2 WaitingForOpponentToPlay (open)
        3.1.Playing (Opponent Played)
        3.2.Playing (Opponent Found)
    */
    var id = socket.id,
        myCurrentMatch,
        statusSubscriptions = {},
        me,
        myOpponent;

    /*
        User presses play button and wants to play. We should find for open games or create a new game.
    */      
    socket.on('wantToPlay', function (data) {
        myCurrentMatch = matches.getMatch(id,socket);
        if (myCurrentMatch.status === 'new') {
            me = myCurrentMatch.opponent1;
            myOpponent = myCurrentMatch.opponent2;
            myCurrentMatch.opponent1.points = 0;
            myCurrentMatch.opponent2.points = 0;
        }
        //open means we have both oponents and can start playing
        if (myCurrentMatch.status === 'open') {
            me = myCurrentMatch.opponent2;
            myOpponent = myCurrentMatch.opponent1;
            myOpponent.getSocket().emit('readyToPlay', { points: { me: me.points, myOpponent: myOpponent.points } });
        }
    });

    socket.on('getQuestion', function (category) { 
        //sendRandomQuestion(category.categoryId, myCurrentMatch.opponent1);
        //get the category and respond with a random question
        myCurrentMatch.currentQuestion = me.getRandomQuestion();

        //clone the object
        var myClonedCurrentQuestion = {
            questionid: myCurrentMatch.currentQuestion.questionid,
            question: myCurrentMatch.currentQuestion.question,
            responses: myCurrentMatch.currentQuestion.responses,
        };

        //myClonedCurrentQuestion.splice(myClonedCurrentQuestion.indexOf("correct"), 1);
        //delete myClonedCurrentQuestion["correct"];
        //send the question
        me.getSocket().emit('answerThis', myClonedCurrentQuestion);
    });

    socket.on('response', function (data) {
        var id = data.id;
        var correct = myCurrentMatch.currentQuestion.correct;
        if (correct === id) {
            //Correct!
            me.points += 1;
            me.getSocket().emit('goodResponse', {id: correct, points: {me: me.points , myOpponent: myOpponent.points}});
        } else {
            //Incorrect!
            me.getSocket().emit('badResponse', { id: correct, points: { me: me.points, myOpponent: myOpponent.points }});
            myOpponent.getSocket().emit('readyToPlay', { points: { me: myOpponent.points, myOpponent: me.points } });
        }
    });
    socket.on('subscribeToDebugEvents', function (data) {
        observersForDebug.add(socket);
    });
});