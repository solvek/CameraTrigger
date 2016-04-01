/**
 * Port number on which Alarm Server is working
 */
const PORT = 15002;
/**
 * Monitor id in Zone Minder system
 */
const MONITOR_ID = 3;
/**
 * Host or ip where Zone Minder is working
 */
const ZM_TRIGGER_HOST = 'localhost';
/**
 * Port number of Zone Minder Trigger
 */
const ZM_TRIGGER_PORT = 6802;

var net = require('net');

function parseAlarmMessage(data){
    if (data.length < 21){
        throw new Error("Data is too small");
    }

    var payloadSize = data.readUInt32LE(16);

    if (data.length != 20+payloadSize){
        throw new Error("Invalid data size");
    }

    var jsonData = data.slice(20, data.length-1);
    var json = jsonData.toString();

    return JSON.parse(json);
}

function sendData(host, port, content){
    var client = new net.Socket();
    client.connect(port, host, function() {
        //console.log('Connected');
        client.write(content);
        client.destroy();
    });
}

function buildZmCommand(options){
    return (options.id+"|"
        +options.operation+"|"
        +options.priority+"|"
        +options.cause+"|"
        +options.notes);
}

var alarmServer = net.createServer(function(socket) {
    console.log("A client connected: "+socket.remoteAddress);

    socket.on('data', function (data) {
        console.log("Received data: "+data.toString());
        console.log("HEX: "+data.toString('hex'));

        var parsed;

        try {
            parsed = parseAlarmMessage(data);
        }
        catch(e){
            console.log("Cannot parse data: "+e);
            return;
        }

        if (parsed.Event == "MotionDetect"){
            var options = {
                id: MONITOR_ID,
                priority: 1,
                cause: "Alarm",
                notes: "Motion triggered"};

            options.operation = (parsed.Status=="Start") ? "on" : "off";

            var command = buildZmCommand(options);

            sendData(ZM_TRIGGER_HOST, ZM_TRIGGER_PORT, command+"\n");
        }
    });
});

alarmServer.listen(PORT);