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
require("dotenv/config");
const discord_js_1 = require("discord.js");
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const chalk_1 = __importDefault(require("chalk"));
const commands = [];
const { token, clientId, devGuildId } = process.env;
const rest = new discord_js_1.REST().setToken(token);
(() => __awaiter(void 0, void 0, void 0, function* () {
    const foldersPath = node_path_1.default.join(__dirname, "commands");
    const commandFolders = node_fs_1.default.readdirSync(foldersPath);
    for (const folder of commandFolders) {
        if (folder.endsWith(".ts"))
            continue;
        const commandsPath = node_path_1.default.join(foldersPath, folder);
        const commandFiles = node_fs_1.default.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"));
        for (const file of commandFiles) {
            const filePath = node_path_1.default.join(commandsPath, file);
            const command = (yield Promise.resolve(`${filePath}`).then(s => __importStar(require(s)))).default;
            if ("data" in command && "execute" in command) {
                commands.push(command.data.toJSON());
            }
            else {
                console.log(chalk_1.default.red(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property`));
            }
        }
    }
    try {
        console.log(chalk_1.default.greenBright(`Started refreshing ${commands.length} application (/) commands`));
        const data = yield rest.put(discord_js_1.Routes.applicationGuildCommands(clientId, devGuildId), { body: commands });
        console.log(chalk_1.default.greenBright(`Successfully reloaded ${data.length} application (/) commands.`));
    }
    catch (err) {
        console.error(err);
    }
}))();
