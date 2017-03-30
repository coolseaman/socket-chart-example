$(function() {
    var socket = io('http://localhost:3000', {
        reconnectionAttempts: 5
    });

    var $loginPage = $('.login.page');
    var $chatPage = $('.chat.page');

    var username;

    var $inputMessage = $('.inputMessage');

    var setUsername = function() {
        username = $('.usernameInput').val().trim();

        if(username) {
            $loginPage.fadeOut();
            $chatPage.show();

            socket.emit('add user', username);
        }
    };

    var sendMessage = function() {
        var message = $inputMessage.val();

        if(message) {
            $inputMessage.val('');

            addChatMessage({
                username: username,
                message: message
            });

            socket.emit('new message', message);
        }
    };

    $(window).keydown(function(event) {
        if(event.which === 13) {
            if (username) {
                sendMessage();
            } else {
                setUsername();
            }
        }
    });

    // 发布登录离开信息
    var log = function(data) {
        $('.messages').append('<li class="log">' + data + '</li>');
    };

    // 发布在线人数消息
    var addParticipantsInfo = function(data) {
        $('.messages').append("<li class='log'>" + "there's " + data.userNum + " participant(s)" + "</li>");
    }; 

    // 发布聊天信息
    var addChatMessage = function(data) {
        $('.messages').append('<li class="message"><span class="username">' + data.username  + '</span><span class="messageBody">' + data.message + '</span></li>');
    };

    // 消息监听
    socket.on('user login', function(data) {
        var welcomeMessage = 'Welcome to Socket.IO Chat - ';
        log(welcomeMessage);
        
        addParticipantsInfo(data);
    });

    socket.on('user joined', function(data) {
        var message = data.username + ' joined';
        log(message);
        addParticipantsInfo(data);
    });

    socket.on('user left', function(data) {
        log(data.username + ' left');
        addParticipantsInfo(data);  
    });

    socket.on('someone said', function(data) {
        addChatMessage(data);
    });
});