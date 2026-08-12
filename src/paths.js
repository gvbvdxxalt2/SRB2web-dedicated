var path = require("path");
var fs = require("fs");

var paths = {};
paths.internal = path.join(__dirname,"../.dedicated/");
paths.binNode = path.join(paths.internal,"/.bin/");
paths.addons = path.join(paths.internal,"../.addons/");
paths.root = path.join(paths.internal,"./");

module.exports = paths;