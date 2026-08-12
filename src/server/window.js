var window = {};
global.window = global;
global.alert = function (msg) {
    console.log(`[ALERT!]: ${msg}`);
};