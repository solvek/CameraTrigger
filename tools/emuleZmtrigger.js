/**
 * Created by solvek on 01.04.16.
 */

var net = require('net');

var server = net.createServer(function(socket) {
    console.log("A client connected: "+socket.remoteAddress);

    socket.on('data', function (data) {
        console.log("Received data: "+data.toString());
        console.log("HEX: "+data.toString('hex'));
    });
});

server.listen(6802);
console.log("Server started");