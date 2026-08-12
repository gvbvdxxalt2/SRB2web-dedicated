
const { fstat } = require("fs");
var paths = require("../paths.js");
var process = require("process");
var readline = require("readline");
var path = require("path");
var fs = require("fs");
var rl = null;
var http = require("http");
var https = require("https");

const DEFAULT_REPO = {
    user: "gvbvdxxalt2",
    repo: "SRB2web",
    branch: "master"
};

function getRepoFileURL(user,repo,branch,filePath) {
    return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${filePath}`;
}

function downloadFile(url) {
    var request = https;
}

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
        openReadline();
    }
    return new Promise((resolve) => rl.question(query,resolve));
}

async function configureServer() {

}

async function doSetup() {

    

    if (fs.existsSync(paths.serverConfig)) {

    }
}

module.exports = {
    doSetup
};
