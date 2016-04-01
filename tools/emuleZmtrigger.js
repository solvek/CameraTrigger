/**
 * Created by solvek on 01.04.16.
 * Script simulates work of ZMTrigger service. It does nothing but outputs to console everything it receives.
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