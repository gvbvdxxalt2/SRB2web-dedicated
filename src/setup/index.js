
var paths = require("../paths.js");
var process = require("process");
var readline = require("readline");
var rl = null;

function openReadline() {
    if (rl) {
        rl.close();
        rl = null;
    }
    rl = readline.createInterface({ input: process.stdin, output: process.stdout });
}

function closeReadline() {
    if (rl) {
        rl.close();
    }
    rl = null;
}

function questionAsync(query) {
    if (!rl) {
        
    }
    return new Promise((resolve) => rl.question(query,resolve));
}

async function configureServer() {

}

async function doSetup() {
    openReadline();
    var response = await questionAsync("Type something:");
    closeReadline();
    console.log(`You said:${response}`);
}

module.exports = {
    doSetup
};
