var paths = require("../paths.js");
var fs = require("fs");
var path = require("path");
var process = require("process");
var {configuration} = require("./config.js");
var { findAddons } = require("../addonslist.js");

var createSRB2Module = require(path.join(paths.binNode, "srb2.js"));

//Fake window and window.alert so that the dedicated netgame server doesn't crash.
global.window = global;
global.alert = (msg) => console.log(`[SRB2 ALERT]: ${msg}`);

require("./netutil.js");

(async function () {
    process.chdir(paths.root);
    var Module = await createSRB2Module({
        noInitialRun: true
    });
    global.Module = Module;

    var net = require("./net");
    net.enable(configuration.relay.host);

    if (configuration.netgame.public) {
        net.enablePublic();
    } else {
        net.disablePublic();
    }

    var fileArguments = [];
    var addons = findAddons();

    for (var addon of addons) {
        fileArguments.push("-file");
        fileArguments.push(addon.absolute);
    }
    
    var arguments = ["-dedicated", "-home", paths.root].concat(fileArguments);
    
    Module.callMain(arguments);

    process.stdin.on("data", (data) => {
        Module.ccall('SRB2_SendGreenTerminal', 'void', ['string'], [""+data]);
    });
})();