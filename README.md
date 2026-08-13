# [SRB2web](https://github.com/gvbvdxxalt2) dedicated netgame "server"

A dedicated netgame "server" made for GVBVDXX's SRB2 Web port that you can spin up on your terminal.

### 1. Install & setup

In an empty directory run `npm install -g https://github.com/gvbvdxxalt2/SRB2web-dedicated.git` then run `srb2wserver` to check if it has installed successfully.

Run `srb2wserver init` to install the neccasary resources to run the server.

### 2. Configuration

You can configure these files & folders to your preferences:

* `.srb2/adedserv.cfg` - This is the commands ran immediately after starting up the server. Use it to change srb2 server options, such as the starting map or the server name, find the commands online on  the SRB2 wiki.
* `.addons/` - These are addons applied immediatley after startup, you can run `addfile <file name>` (in the running dedicated netgame server) to add an addon file when it is not loaded or if you have it in another folder. If you need to check what addons are applied you can type `srb2wserver addons list` to get a list of addons applied on startup.
* `srb2w.json` - This is the specific configuration for SRB2 web, this is where you provide your relay server and toggle the public mode.

### 3. Start the server

Run the command `srb2wserver start` to start the server.
You can additionally run other commands such as `promote <username or player number>` to promote a user to administrator privlages to let them change the level and do other stuff, if you want to set a password to use admin you can type `password <admin password>` and on your SRB2 web gameplay you can open the in game terminal and type `login <admin password>`.