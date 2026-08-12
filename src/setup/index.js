
const { fstat } = require("fs");
var paths = require("../paths.js");
var process = require("process");
var readline = require("readline");
var path = require("path");
var fs = require("fs");
var rl = null;
var http = require("http");
var https = require("https");
var URL = require("url");

const DEFAULT_REPOINFO = {
    user: "gvbvdxxalt2",
    repo: "SRB2web",
    branch: "master"
};
const DEFAULT_REPO_ASSET_PATH = "game-assets/";
const DEFAULT_REPO_BIN_PATH = "build-wasm-node/bin/";
const BUILD_FILES = [ "srb2.js", "srb2.bin" ];

function getRepoFileURL({user,repo,branch},filePath) {
    return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${filePath}`;
}

function downloadGithubFile(repoInfo,webPath,targetPath) {
    var resolve = null;
    var reject = null;
    var promise = new Promise((r,err) => {resolve = r;reject = err;});
    var url = getRepoFileURL(repoInfo,webPath,targetPath);
    var name = webPath.split("/").pop();
    console.log(`Downloading ${name}...`);
    var request = https.request({
        ...URL.parse(url),
        method: "GET",
        headers: {
            "User-Agent": "Node.JS"
        }
    }, (response) => {
        var filestream = fs.createReadStream(targetPath);
        response.pipe(filestream);

        var totalBytes = +response.headers["Content-Length"] || 0;
        var bytes = 0;

        response.on("data", (chunk) => {
            bytes += chunk.length;
            console.log(`Downloading ${name}... [${
                totalBytes  !== 0 ?
                    (bytes + " bytes")
                    : (Math.round((bytes / totalBytes) * 100) + "%")
                }]`);
        });
        response.on("end", () => {
            console.log(`Downloaded ${name}.`);
        });
    });
    request.end();
}

function openReadline() {
    if (rl) {
        rl.close();
        rl = null;
    }
    rl = readline.createInterface({ input: process.stdin, output: process.stdout });
}

function closeReadline() {
    if (rl) {
        rl.close();
    }
    rl = null;
}

function questionAsync(query) {
    if (!rl) {
        openReadline();
    }
    return new Promise((resolve) => rl.question(query,resolve));
}

async function configureServer() {

}

async function doSetup() {
    if (!fs.existsSync(paths.root)) {
        fs.mkdirSync(paths.root);
    }
    if (!fs.existsSync(paths.addons)) {
        fs.mkdirSync(paths.addons);
    }
    if (!fs.existsSync(paths.binNode)) {
        fs.mkdirSync(paths.binNode);
    }
    try{
        var neededToDownload = 0;
        for (var asset of paths.SRB2files) {
            var assetPath = path.join(paths.root, asset);
            if (!fs.existsSync(assetPath)) {
                neededToDownload += 1;
                await downloadGithubFile(DEFAULT_REPOINFO, DEFAULT_REPO_ASSET_PATH+asset, assetPath);
            } else {
                console.log(`✅ Asset ${asset} is already downloaded.`);
            }
        }

        for (var binary of paths.SRB2files) {
            var binaryPath = path.join(paths.binNode, binary);
            if (!fs.existsSync(binaryPath)) {
                neededToDownload += 1;
                await downloadGithubFile(DEFAULT_REPOINFO, DEFAULT_REPO_BIN_PATH+binary, binaryPath);
            } else {
                console.log(`✅ WebAssembly binary ${binary} is already downloaded.`);
            }
        }

        if (neededToDownload < 1) {
            console.log(
                "You seem to have every file & binary downloaded already!"+
                "\nIf you're having trouble or it keeps crashing, you can delete"+
                "\nthe game assets (located in current working directory) and also the"+
                "\n\".bin\" folder, then rerun this command."
            );
        }
    }catch(e){
        console.log("⚠ Unable to download files, you'll have to provide them manually.");
        console.log("Download error: "+e);
        await questionAsync("Press Enter to continue.");
        closeReadline();
    }
}

module.exports = {
    doSetup
};
