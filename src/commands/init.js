
var { doSetup } = require("../setup");

program
  .command('init')
  .description('Setup & Install the neccasary files to run the "server".')
  .action(() => {
    doSetup()
  });