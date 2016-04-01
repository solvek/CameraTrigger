/**
 * Created by solvek on 01.04.16.
 */

var net = require('net');

function sendData(content){
    var client = new net.Socket();
    client.connect(15002, "localhost", function() {
        //console.log('Connected');
        client.write(content);
        client.destroy();
    });
}

// Start
sendData(new Buffer('ff01000000000000000000000000e405be0000007b20224164647265737322203a202230783234303141384330222c20224368616e6e656c22203a20302c20224465736372697022203a2022222c20224576656e7422203a20224d6f74696f6e446574656374222c202253657269616c494422203a2022303031323131313431646539222c2022537461727454696d6522203a2022323031362d30342d30312031353a34393a3237222c202253746174757322203a20225374617274222c20225479706522203a2022416c61726d22207d0a', 'hex'));

setTimeout(
    function(){
        // Stop
        sendData(new Buffer('ff01000000000000000000000000e405bd0000007b20224164647265737322203a202230783234303141384330222c20224368616e6e656c22203a20302c20224465736372697022203a2022222c20224576656e7422203a20224d6f74696f6e446574656374222c202253657269616c494422203a2022303031323131313431646539222c2022537461727454696d6522203a2022323031362d30342d30312031353a34393a3238222c202253746174757322203a202253746f70222c20225479706522203a2022416c61726d22207d0a', 'hex'));
    }
    ,5000
);