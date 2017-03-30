var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/client'));

var port = process.env.PORT || 3000;
server.listen(3000, function() {
    console.log('Server listening at port %d', port);
});

var userNum = 0;

io.on('connection', function(socket) {
    var addedUser = false;
    
    socket.on('add user', function(username) {
        if(addedUser) return;

        console.log('receive signal: add user');
        socket.username = username;
        ++userNum;
        addedUser = true;
        socket.emit('user login', {
            userNum: userNum
        });

        socket.broadcast.emit('user joined', {
            username: socket.username,
            userNum: userNum
        });
    });

    socket.on('disconnect', function() {
        console.log('receive signal: disconnect');
        if(addedUser) {
            console.log('user left');
            --userNum;

            socket.broadcast.emit('user left', {
                username: socket.username,
                userNum: userNum
            });
        }
    });

    socket.on('new message', function(message) {
        socket.broadcast.emit('someone said', {
            username: socket.username,
            message: message
        });
    });
});

