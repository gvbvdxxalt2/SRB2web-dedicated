#!/usr/bin/env node

var { Command } = require("commander");
var package = require("../package.json");
var program = new Command();

global.program = program;

program
  .name("srb2wserver")
  .description("CLI to launch GVBVDXX's SRB2web port dedicated netgame \"server\".")
  .version(package.version);

require("./commands/");

program.parse(process.argv);
