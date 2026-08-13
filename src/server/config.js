var paths = require("../paths.js");
var fs = require("fs");
var serverArgs = globalThis.serverArgs[0];
var configuration = {
    "relay": {
        "host": "srb2web-lan.onrender.com",
        "secure": true
    },
    "netgame": {
        "public": true
    }
};

var SRB2webConfig = fs.readFileSync(paths.SRB2webConfig);

function applyValues(source,target) {
    for (var key of Object.keys(source)) {
        var value = source[key];
        if (typeof target[key] == "undefined") {
            target[key] = value;
        }
        if (typeof value == "object" && !Array.isArray(value)) {
            applyValues(source[key],target[key]);
        } else if (typeof value == typeof target[key]) {
            target[key] = value;
        }
    }
}

applyValues(JSON.parse(SRB2webConfig),configuration);

if (serverArgs.secure && serverArgs.unsecure) {
    console.log("⚠️ Unsecure & secure are both applied as flags! Please choose only one to take effect.");
} else if (serverArgs.secure) {
    configuration.relay.secure = true;
} else if (serverArgs.unsecure) {
    configuration.relay.secure = false;
}

if (serverArgs.relayhost) {
    var host = (""+serverArgs.relayhost).trim();
    if (host.length > 0 && host.length < 500) {
        configuration.relay.host = serverArgs.relayhost;
    } else {
        console.log("⚠️ Relay host provided by flag isn't in proper character range!");
    }
}

module.exports = {configuration};