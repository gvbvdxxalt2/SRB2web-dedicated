
var http = require("http");
var https = require("https");
var ws = require("ws");
var URL = require("url");

function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;

    var reqopts = {
        method: options.method || "GET",
        headers: options.headers || {},
        ...URL.parse(url)
    };

    console.log(reqopts);

    const req = protocol.request(reqopts, (res) => {
      let data = [];
      res.on("data", (chunk) => {
        data.push(chunk);
      });
      res.on("end", () => {
        resolve({
            status: res.statusCode,
            headers: res.headers,
            ok: res.statusCode >= 200 && res.statusCode < 300,
            text: () => Promise.resolve(Buffer.concat(data).toString()),
            json: () => Promise.resolve(JSON.parse(Buffer.concat(data).toString()))
        });
      });
    });
    req.on("error", (err) => {
      reject(err);
    });
    req.write(options.body || "");
    req.end();
  });
}

global.fetch = fetch;

global.location = {
  protocol: "https:"
};

var wrtc = require("@roamhq/wrtc");
Object.assign(global, wrtc);

global.document = {
  addEventListener: () => {},
};