"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl_core_1 = __importDefault(require("ytdl-core"));
ytdl_core_1.default.getInfo("https://www.youtube.com/watch?v=-o7X4W-wQbo").then(console.log);
