
var fs = require("fs");
var path = require("path");
var paths = require("../../paths.js");
var process = require("process");

function isSetup() {
    if (!fs.existsSync(paths.root)) {
        return false;
    }
    if (!fs.existsSync(paths.addons)) {
        return false;
    }
    if (!fs.existsSync(paths.binNode)) {
        return false;
    }
    if (!fs.existsSync(paths.srb2Home)) {
        return false;
    }
    for (var file of paths.SRB2files) {
        var absolute = path.join(paths.root,file);
        if (!fs.existsSync(absolute)) {
            return false;
        }
    }
    return true;
}

function checkSetup() {
    if (!isSetup()) {
        console.log(
            "❌ This command requires the dedicated netgame server to be setup!"+
            "\nIf you have deleted any files or resources then that might be the reason.",
            "\nRun srb2wserver init to setup or fix any problems."
        );
        process.exit();
    }
    return false;
}

module.exports = {
    isSetup,
    checkSetup
};