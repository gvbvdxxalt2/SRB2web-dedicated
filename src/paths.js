var path = require("path");
var fs = require("fs");
var process = require("process");

var paths = {};
paths.local = path.join(__dirname,"../");
paths.root = process.cwd();
paths.binNode = path.join(paths.root,"/.bin/");
paths.addons = path.join(paths.root,"../.addons/");
paths.serverConfig = path.join(paths.root, "./adedserv.cfg");
paths.SRB2files = [ "characters.pk3", "music.pk3", "srb2.pk3", "zones.pk3" ];

module.exports = paths;