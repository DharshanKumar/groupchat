const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');

app.get('/users/chat', function(req, res) {
    res.render('index.ejs');
});

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});

const router = require('./routes/users');

//mongodb connection
mongoose.connect('mongodb://localhost/nodeAuth');

//on connection
mongoose.connection.on('connected',function(){
	console.log( "DB connected" );
})

//error connection
mongoose.connection.on('error',function(err){
	if( err ){
		console.log( "connection error: " + err );
	}
})

//this has to be there before route.
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use( express.static( path.join( __dirname, 'public' ) ) );

app.use( '/users', router );

app.get('/',function(req,res){
	res.render("index1.ejs", {layout: false});
})

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});