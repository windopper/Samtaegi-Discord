"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableFunctions = exports.getTools = exports.registerTools = exports.initializeTools = exports.Tools = void 0;
const info_1 = require("./info");
const music_1 = require("./music");
const chalk_1 = __importDefault(require("chalk"));
var Tools;
(function (Tools) {
    Tools["INFO_SHOW"] = "information_show";
    Tools["VOICE_CONNECT_CHANNEL"] = "voice_connect_channel";
    Tools["VOICE_DISCONNECT_CHANNEL"] = "voice_disconnect_channel";
    Tools["MUSIC_PLAY"] = "music_play";
    Tools["MUSIC_RESUME"] = "music_resume";
    Tools["MUSIC_PAUSE"] = "music_pause";
    Tools["MUSIC_LIST"] = "music_list";
    Tools["MUSIC_SKIP"] = "music_skip";
    Tools["MUSIC_STOP"] = "music_stop";
    Tools["MUSIC_REMOVE_LOOP"] = "music_remove_loop";
    Tools["MUSIC_TOGGLE_SONG_LOOP"] = "music_toggle_song_loop";
    Tools["MUSIC_TOGGLE_QUEUE_LOOP"] = "music_toggle_queue_loop";
    Tools["MUSIC_CLEAR_QUEUE"] = "music_clear_queue";
    Tools["MUSIC_SHUFFLE"] = "music_shuffle";
})(Tools || (exports.Tools = Tools = {}));
let tools = [];
let availableFunctions = {};
function initializeTools() {
    console.log(chalk_1.default.blue("Initialize Tools..."));
    (0, music_1.initializeMusicTools)();
    (0, info_1.initializeInfo)();
}
exports.initializeTools = initializeTools;
function registerTools(generatedToolSchema, fn, proxyHandler) {
    tools = [...tools, generatedToolSchema];
    availableFunctions[generatedToolSchema.function.name] = proxyHandler ? new Proxy(fn, proxyHandler) : fn;
    console.log(chalk_1.default.bgCyan(chalk_1.default.black("Tools")), chalk_1.default.cyan(generatedToolSchema.function.name));
}
exports.registerTools = registerTools;
function getTools() {
    return tools;
}
exports.getTools = getTools;
function getAvailableFunctions() {
    return availableFunctions;
}
exports.getAvailableFunctions = getAvailableFunctions;
