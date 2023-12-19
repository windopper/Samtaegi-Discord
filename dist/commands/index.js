"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCommands = exports.commandCollection = void 0;
const discord_js_1 = require("discord.js");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
exports.commandCollection = new discord_js_1.Collection();
function initializeCommands() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(chalk_1.default.blue("Initialize Commands..."));
        const foldersPath = path_1.default.join(__dirname);
        const commandFolders = fs_1.default
            .readdirSync(foldersPath)
            .filter((file) => !file.toString().endsWith(".ts"));
        for (const folder of commandFolders) {
            const commandsPath = path_1.default.join(foldersPath, folder.toString());
            const commandFiles = fs_1.default
                .readdirSync(commandsPath)
                .filter((file) => file.toString().endsWith(".ts"));
            for (const file of commandFiles) {
                const filePath = path_1.default.join(commandsPath, file.toString());
                const command = (yield Promise.resolve(`${filePath}`).then(s => __importStar(require(s)))).default;
                if ("data" in command && "execute" in command) {
                    exports.commandCollection.set(command.data.name, command);
                    console.log(chalk_1.default.bgCyan(chalk_1.default.black("Commands")), chalk_1.default.cyan(command.data.name));
                }
                else {
                    console.log(chalk_1.default.red(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property`));
                }
            }
        }
        console.log(chalk_1.default.greenBright(`${exports.commandCollection.size} commands found!`));
    });
}
exports.initializeCommands = initializeCommands;
