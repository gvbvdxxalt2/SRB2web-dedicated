
var { checkSetup } = require("./util/");
var { findAddons } = require("../addonslist.js");

global.programAddons = program
  .command('addons')
  .description('Use to manage addons, currently just lists them.');

var programAddons = global.programAddons;

programAddons.command("list", { isDefault: true })
  .description('Find addons that are applied on startup.')
  .action(() => {
    checkSetup();

    console.log("🔎 Scanning for addons...");
    var addons = findAddons();
    if (addons.length < 1) {
        console.log("❌ No addons found! Make sure they're placed in the \".srb2addons\" directory!");
        return;
    }

    console.log("📂 "+addons.length+(addons.length > 1 ? "addons" : "addon")+" found.");

    for (var addon of addons) {
        console.log("");
    }

  });