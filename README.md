# Overview

Zone Minder has a built in motion detector. However to use this feature Zone Minder has continuously read video stream from camera.
This may overload network. To omit this problem we'll catch hardware motion detection and trigger Zone Minder.

My camera supports "Alarm Server". In case of alarm (detected motion) it will send a request to alarm server.

# Installation

# Configuration

## Camera

 1. Activate "Alarm Server" on camera
 2. Set address of Alarm Server to the host on which CameraTrigger service will work
 3. Pay attention to server port, it should be the same as in CameraTrigger service
 
## Zone Minder

 1. [Read](https://wiki.zoneminder.com/How_to_use_your_external_camera's_motion_detection_with_ZM) Zone Minder triggering background
 2. Check checkbox `OPT_TRIGGERS` in `Options/System`
 3. Restart Zone Minder: `sudo service zoneminder restart`
 4. Assuming you have already added the camera to Zone Minder and it can be minded by ZM.
 5. Note the camera's `Monitor Id`
 6. Set the camera to function as `Nodect`
 7. Telnet zmtrigger: `telnet localhost 6802`
 8. Try to telnet your trigger: `2|on+10|1|textstring1|textstring2` (here 2 - is your monitor id, 1 - priority)
 9. The record will be started for 10 sec and then stopped
 
## Alarm Server

 1. cd to directory where server will be deployed: `cd /opt`
 2. Clone Alarm Server locally: `git clone https://github.com/solvek/CameraTrigger.git`
 3. cd to Server directory: `cd CameraTrigger`
 4. Configure parameters at the beginning of `index.js` file. Especially pay attention to `MONITOR_ID` constant.
 6. Start the Server: `node index.js`
 
 You may want to setup starting server on system startup, for this do the following:
 
 1. Create starting service script: `sudo nano /etc/init/ServerRouter.conf`
 2. Copy my upstart script from [here](https://github.com/solvek/CameraTrigger/blob/master/ServerRouter.conf)
 3. Correct paths to node, `index.js` script, output log
 4. Save
 5. Check syntax `sudo init-checkconf /etc/init/ServerRouter.conf`
 6. Start service: `sudo service ServerRouter start`
 7. Check log: `cat ~/ServerRouter.log`

# Alarm Server Protocol

Packet of information consists of

|Position   |Size   |Description        |
|-----------|:-----:|------------------:|
|0          |20     |Binary header      |
|20         |n      |Payload (JSON)     |
|20+n       |1      |Final symbol(0x0A) |
 
Header consists of

|Position   |Size   |Description        |
|-----------|:-----:|------------------:|
|0          |2      |Marker 0xFF01      |
|2          |14     |Unknown            |
|16         |4      |little-endian integer - Payload + Final Symbol size |
   
Payload JSON contains such attributes

 * `Address`
 * `Channel`
 * `Descrip`
 * `Event` Can be `MotionDetect`,  `BlindDetect`
 * `SerialID` - serial id of camera in hex format
 * `StartTime`, example "2016-04-01 11:42:28"
 * `Status` Can be `Start` or `Stop`
 * `Type` - "Alarm"

# If camera does not support alarm server

Many cameras does not have such feature as "Alarm Server" but most of ip cameras can send an email on motion detection. This can be utilized to trigger.


Example 

```javascript
'use strict';

let SMTPServer = require('smtp-server').SMTPServer;

let server = new SMTPServer({
    onConnect: function(session, callback){
        console.log(`${new Date()}: New client ${session.clientHostname} from ip ${session.remoteAddress}`);
        return callback();
    },

    onMailFrom: function(address, session, callback){
        console.log(`${new Date()}: An email from ${address.address}`);
        return callback();
    }
});

let PORT = 25;

server.listen(PORT);

console.log(`SMTP server is listening port ${PORT}`);
```

This code requires package `smtp-server`

