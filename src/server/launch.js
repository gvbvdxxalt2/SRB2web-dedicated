const path = require("path");
const fs = require("fs");
const paths = require("../paths.js");

// Require the modularized Node binary
const createSRB2Module = require(path.join(paths.binNode, "srb2.js"));

global.window = global;
global.alert = (msg) => console.log(`[SRB2 ALERT]: ${msg}`);

var addonTypes = ["wad","lua","pk3"];
var ignore = ["characters.pk3","music.pk3","srb2.pk3","zones.pk3"];

require("./netutil.js");

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
        addons.push(absolute);
      }
    });
  }
  loopThrough(paths.addons);
  return addons;
}

async function startServer() {
  // 1. Tell Node to change its working directory to your assets folder!
  // SRB2 will now look at paths.root on your physical hard drive for srb2.pk3
  process.chdir(paths.root);

  // Quick sanity check to ensure srb2.pk3 exists at paths.root
  if (!fs.existsSync(path.join(paths.root, "srb2.pk3"))) {
    console.error(`[ERROR] srb2.pk3 was not found in: ${paths.root}`);
    process.exit(1);
  }

  // 2. Initialize the WebAssembly Module
  const Module = await createSRB2Module({
    noInitialRun: true,
    print: (text) => console.log(`[SRB2] ${text}`),
    printErr: (text) => console.error(`[SRB2 ERR] ${text}`)
  });
  global.Module = Module;
  var net = require("./net");
  net.enable("srb2web-lan.onrender.com");
  net.enablePublic();

  // 3. Boot C main
  // Optionally pass -home to tell SRB2 where to save logs, user data, or WADs
  var fileArguments = [];
  var addons = findAddons();

  for (var addon of addons) {
    fileArguments.push("-file");
    fileArguments.push(addon);
  }

  var arguments = ["-dedicated", "-home", paths.root].concat(fileArguments);

  Module.callMain(arguments);
}

//console.log(findAddons());

startServer();