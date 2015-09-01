    //Declaration
var socket;

    //Document ready
$(document).ready(function () {

    //Step 1: Creates the socket. Use the globally created handler "socket".
    socket = io.connect('http://localhost:3000');

    //Step 2.1: Sends the command to start a match/join an existing match.

    //Socket receivers
    //Step 2.2: We receive a welcome message from the server and log in in the console.
    socket.emit('wantToPlay',{});

    socket.on('WelcomeMessage', function(data){
        console.log(data);
    });

    socket.on('readyToPlay',function(data){
    refreshPoints(data.points);
    dibujo_ruleta();
    changeView("sectionRueda");

    });
    
    //Step 3: Unlocks the screen and show the spin

    //Step 4.2: Receive the question from the server and render it on the screen

    //Step 5.2: We replied correctly. Resolve screen and refresh points with data from the server.

    //Step 6: We replied incorrectly. Resolve screen and refresh points with data from the server.
});

    //Step 4.1: Receives the event for playing and requests the question from the server
$('button.jugar').on('click', function (e) {
    e.preventDefault;
     socket.on('getQuestion',{categoryId : 1});

});

    //Step 5.1: Captures clicks on one of 4 responses and call the WS
$("#divtablero").find(".respuesta").on('click', function () {
    var id = $(this).find("p").attr("id").substr(this.id.length - 1);
});