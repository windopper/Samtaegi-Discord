"use strict";
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
exports.client = void 0;
const discord_js_1 = require("discord.js");
require("dotenv/config");
const chalk_1 = __importDefault(require("chalk"));
const commands_1 = require("./commands");
const music_1 = __importDefault(require("./api/music"));
const music_2 = require("./functions/music");
const messageController_1 = require("./functions/music/controller/messageController");
const buttonController_1 = require("./functions/music/controller/buttonController");
const commandController_1 = require("./functions/music/controller/commandController");
const { token } = process.env;
exports.client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [discord_js_1.Partials.Channel],
});
exports.client.once(discord_js_1.Events.ClientReady, (c) => {
    var _a;
    (0, music_1.default)(exports.client);
    //initializeTools();
    (0, commands_1.initializeCommands)();
    (0, music_2.initializeMusicFunction)(exports.client);
    console.log(chalk_1.default.green(`Ready! Logged in as ${c.user.tag}`));
    (_a = exports.client.user) === null || _a === void 0 ? void 0 : _a.setActivity("삼태기 메들리", { type: discord_js_1.ActivityType.Competing });
});
exports.client.on("messageCreate", (m) => {
    (0, messageController_1.musicMessageController)(m).catch(console.log);
});
exports.client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (interaction.isButton()) {
        const buttonInteraction = interaction;
        (0, buttonController_1.musicButtonController)(buttonInteraction).catch(console.log);
    }
    if (interaction.isChatInputCommand()) {
        const chatInteraction = interaction;
        (0, commandController_1.musicCommandController)(chatInteraction).catch(console.log);
    }
}));
exports.client.login(token);
