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
    data: new discord_js_1.SlashCommandBuilder().setName("queue").setNameLocalization("ko", "큐")
        .setDescription("show current queue").setDescriptionLocalization("ko", "현재 큐를 보여줍니다"),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const musics = (0, music_1.showMusicListApi)(interaction.guildId);
            const guildQueue = (0, music_1.getOrCreateQueue)(interaction.guildId);
            const currentPlaying = guildQueue.nowPlaying;
            const repeatMode = guildQueue.repeatMode;
            const isPlaying = guildQueue.isPlaying;
            const progressBar = guildQueue.createProgressBar();
            let content = "";
            content += `${currentPlaying ? `현재 **${currentPlaying.name}** 재생 중` : `현재 재생 중인 음악이 없습니다`}`;
            content += `\n${progressBar.prettier.trimStart()}`;
            content += `\n다음 노래`;
            content += `\n`;
            musics.forEach(v => {
                content += `- ${v.name}\n`;
            });
            yield interaction.reply({
                content
            });
        });
    }
};
