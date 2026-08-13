var paths = require("./paths.js");
var fs = require("fs");
var path = require("path");

var addonTypes = ["wad","pk3","lua"];

function findAddons() {
  var addons = [];
  function loopThrough(dir) {
    return fs.readdirSync(dir).forEach((file) => {
      var absolute = path.join(dir, file);

      var stat = fs.statSync(absolute);
      if (stat.isDirectory()) {
        return loopThrough(absolute);
      }

      var type = (""+file).split(".").pop();
      if (true) {
        addons.push({
            absolute,
            name: file,
            stat
        });
      }
    });
  }
  loopThrough(paths.addons);
  return addons;
}

module.exports = {
    findAddons
};
