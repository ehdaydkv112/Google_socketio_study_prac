var app = require('express')();
var server = require('http').createServer(app);
// http server를 socket.io server로 upgrade한다
var io = require('socket.io')(server);

// localhost:3000으로 서버에 접속하면 클라이언트로 index.html을 전송한다
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// connection event handler
// connection이 수립되면 event handler function의 인자로 socket인 들어온다
io.on('connection', function (socket) {

    // 접속한 클라이언트의 정보가 수신되면
    socket.on('login', function (data) {
        // console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);
        // socket에 클라이언트 정보를 저장한다
        socket.name = data.name;
        socket.userid = data.userid;
        socketid = socket.id
        console.log("==소켓 아디 ==")
        console.log(socketid)

        // 접속된 모든 클라이언트에게 메시지를 전송한다
        io.emit('login', data.name);
        io.emit('ccc', data.name);
        io.emit('ddd', socket.id);
    });

    // 클라이언트로부터의 메시지가 수신되면
    socket.on('chat', function (data) {
        console.log('Message from %s: %s', socket.name, data.msg);
        console.log("소켓네임")
        console.log(socket.name)
        console.log(data.msg)

        var msg = {
            from: {
                name: socket.name,
                userid: socket.userid
            },
            msg: data.msg
        };
        console.log("==data==")
        console.log(data)
        console.log("==data.msg==")
        console.log(data.msg)

        // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
        // socket.broadcast.emit('chat', msg);

        // 메시지를 전송한 클라이언트에게만 메시지를 전송한다
        // socket.emit('s2c chat', msg);

        // 접속된 모든 클라이언트에게 메시지를 전송한다
        // io.emit('s2c chat', msg);
        io.emit('chat', msg);
        // 특정 클라이언트에게만 메시지를 전송한다
        // io.to(id).emit('chat', data);
    });

    // force client disconnect from server
    socket.on('forceDisconnect', function () {
        console.log("이건뭔데")
        socket.disconnect();
    })

    socket.on('disconnect', function () {
        console.log('user disconnected: ' + socket.name);
        io.emit('diss', socket.name);
    });
});

server.listen(3000, function () {
    console.log('Socket IO server listening on port 3000');
});