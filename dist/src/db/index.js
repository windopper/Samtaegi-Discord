"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveGuildsData = exports.getGuildsData = void 0;
const fs_1 = __importDefault(require("fs"));
const yaml_1 = __importDefault(require("yaml"));
function getGuildsData() {
    const file = fs_1.default.readFileSync("src/db/file.yml", "utf-8");
    return yaml_1.default.parse(file) || {};
}
exports.getGuildsData = getGuildsData;
function saveGuildsData(data) {
    fs_1.default.writeFileSync("src/db/file.yml", yaml_1.default.stringify(data), "utf-8");
}
exports.saveGuildsData = saveGuildsData;
