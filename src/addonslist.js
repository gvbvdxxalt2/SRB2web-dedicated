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
      if (addonTypes.indexOf(type) > -1) {
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
