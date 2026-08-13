
var { checkSetup } = require("./util/");

program.command("start")
  .description('Start the dedicated server. Flags override your configuration.')
  .option('--relayhost <string>', "Change the SRB2web netgame relay domain/host")
  .option('--unsecure', "Force unsecure connection to the SRB2web netgame relay domain/host")
  .option('--secure', "Force secure connection to the SRB2web netgame relay domain/host")
  .action((...serverArgs) => {
    checkSetup();
    globalThis.serverArgs = serverArgs;
    require("../server");
  });