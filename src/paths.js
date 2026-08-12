var path = require("path");
var fs = require("fs");
var process = require("process");

var paths = {};
paths.local = path.join(__dirname,"../");
paths.root = process.cwd();
paths.binNode = path.join(paths.root,"/.bin/");
paths.addons = path.join(paths.root,"/.addons/");
paths.srb2Home = path.join(paths.root, "./.srb2/");
paths.serverConfig = path.join(paths.srb2Home, "./adedserv.cfg");
paths.templateServerConfig = path.join(__dirname, "./setup/template.adedserv.cfg");
paths.SRB2webConfig = path.join(paths.root, "./srb2w.json");
paths.templateSRB2webConfig = path.join(__dirname, "./setup/template.srb2w.json")

paths.SRB2files = [ "characters.pk3", "music.pk3", "srb2.pk3", "zones.pk3" ];

module.exports = paths;