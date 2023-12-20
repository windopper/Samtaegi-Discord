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
const channel_1 = require("../../errors/channel");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder().setName("samtaegi").setNameLocalization("ko", "삼태기")
        .setDescription("신나는 삼태기 메들리"),
    execute(interaction) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const userId = (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id;
            const member = (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.members.cache.get(userId);
            const guildId = interaction.guildId;
            const channelId = member === null || member === void 0 ? void 0 : member.voice.channelId;
            if (!guildId)
                throw channel_1.ChannelError.getDefault("NO_GUILD_CHANNEL_ERROR");
            if (!channelId)
                throw channel_1.ChannelError.getDefault("NO_VOICE_CHANNEL_ERROR");
            yield interaction.deferReply({
                ephemeral: true
            });
            const song = yield (0, music_1.playMusicApi)("https://www.youtube.com/watch?v=zEYpydNwgDc&t=1s", guildId, channelId);
            yield interaction.editReply({
                content: `${song.name} 노래 큐에 등록 완료!`
            });
        });
    }
};
