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
    data: new discord_js_1.SlashCommandBuilder()
        .setName("song").setNameLocalization("ko", "노래")
        .setDescription("play music").setDescriptionLocalization("ko", "음악을 재생 합니다")
        .addStringOption(e => e.setName("input").setNameLocalization("ko", "입력").setRequired(true)
        .setDescription("url of title of music").setDescriptionLocalization("ko", "제목 혹은 유튜브 링크")),
    execute(interaction) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const title = (_a = interaction.options.get("input")) === null || _a === void 0 ? void 0 : _a.value;
            const userId = (_b = interaction.member) === null || _b === void 0 ? void 0 : _b.user.id;
            const member = (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.members.cache.get(userId);
            const guildId = interaction.guildId;
            const channelId = member === null || member === void 0 ? void 0 : member.voice.channelId;
            if (!guildId)
                throw channel_1.ChannelError.getDefault("NO_GUILD_CHANNEL_ERROR");
            if (!channelId)
                throw channel_1.ChannelError.getDefault("NO_VOICE_CHANNEL_ERROR");
            yield interaction.deferReply();
            const song = yield (0, music_1.playMusicApi)(title, guildId, channelId);
            yield interaction.editReply(`${song.name} 노래 큐에 등록 완료!`);
        });
    }
};
