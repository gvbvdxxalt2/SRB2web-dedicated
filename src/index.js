#!/usr/bin/env node

var { Command } = require("commander");
var program = new Command();

global.program = program;

program
  .name("srb2wserver")
  .description("CLI to launch GVBVDXX's SRB2web port dedicated netgame \"server\".")
  .version("1.0.0");

require("./commands/");

program.parse(process.argv);