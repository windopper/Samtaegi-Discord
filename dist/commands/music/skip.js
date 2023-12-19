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
    data: new discord_js_1.SlashCommandBuilder().setName("skip").setNameLocalization("ko", "스킵")
        .setDescription("skip current song").setDescriptionLocalization("ko", "현재 노래를 스킵합니다"),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const nextSong = (0, music_1.skipMusicApi)(interaction.guildId);
            let content = "스킵 완료!";
            if (nextSong)
                content += ` 다음 노래는 ${nextSong.name} 입니다`;
            else
                content += ` 다음 노래는 없습니다`;
            yield interaction.reply(content);
        });
    }
};
