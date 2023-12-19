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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const music_1 = require("../../api/music");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('test')
        .setDescription('Show Agent Message'),
    execute(interaction) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const queue = (0, music_1.getOrCreateQueue)(interaction.guildId);
            const userId = (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id;
            const member = (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.members.cache.get(userId);
            const channelId = member === null || member === void 0 ? void 0 : member.voice.channelId;
            yield (0, music_1.connectVoiceChannelApi)(interaction.guildId, channelId);
            const song = yield queue.play("https://www.youtube.com/watch?v=-o7X4W-wQbo");
            console.log(song.url);
        });
    }
};
