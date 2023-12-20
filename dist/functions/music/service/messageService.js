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
exports.updateMusicEmbed = exports.deleteLastMessage = exports.playMusicService = void 0;
const music_1 = require("../../../api/music");
const channel_1 = require("../../../errors/channel");
const index_1 = require("../index");
const buttonService_1 = require("./buttonService");
function playMusicService(message) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const input = message.content;
        const guildId = message.guildId;
        const voiceChannelId = (_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channelId;
        if (!guildId)
            throw channel_1.ChannelError.getDefault("NO_GUILD_CHANNEL_ERROR");
        if (!voiceChannelId)
            throw channel_1.ChannelError.getDefault("NO_VOICE_CHANNEL_ERROR");
        const youtubeMusic = yield (0, music_1.playMusicApi)(input, guildId, voiceChannelId);
        const guildQueue = (0, music_1.getOrCreateQueue)(guildId);
        yield updateMusicEmbed(message.channel.messages, {
            queue: guildQueue,
        });
    });
}
exports.playMusicService = playMusicService;
function deleteLastMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        yield message.delete();
    });
}
exports.deleteLastMessage = deleteLastMessage;
function updateMusicEmbed(messageManager, props) {
    return __awaiter(this, void 0, void 0, function* () {
        const { queue } = props;
        const guildId = queue.guild.id;
        const { samtaegiChannelId, samtaegiEmbedId } = (0, index_1.getSamtaegiEmbedMemory)(guildId);
        const { nowPlaying, songs } = queue;
        const embed = yield messageManager.fetch(samtaegiEmbedId);
        const fields = getFields(queue);
        const description = getDescription(queue);
        const newEmbed = {
            color: 0x0099FF,
            title: "삼태기 봇이다 맨이야",
            description: description,
            thumbnail: {
                url: getThumbnail(queue),
            },
            fields: fields,
            footer: {
                text: "채팅 입력 란에 유튜브 링크나 제목을 적어서 노래를 틀 수 있다 맨이야"
            }
        };
        const buttonActionRow = (0, buttonService_1.createButtonAction)((queue.connection && queue.isPlaying && !queue.destroyed) ? queue.paused : false, queue.repeatMode);
        yield embed.edit({
            embeds: [newEmbed], components: [buttonActionRow]
        });
    });
}
exports.updateMusicEmbed = updateMusicEmbed;
function getFields(queue) {
    let fields = [];
    const { songs, destroyed } = queue;
    if (destroyed)
        return fields;
    if (songs.length > 0) {
        fields.push({ name: "", value: "" });
        fields.push({ name: "", value: `현재 큐 **${songs.length - 1} 곡**` });
        fields = fields.concat(...songs.slice(1).map(v => {
            return {
                name: "",
                value: `${v.name} [${v.duration}]`
            };
        }));
    }
    return fields;
}
function getDescription(queue) {
    const { songs, nowPlaying, destroyed } = queue;
    return `♬ 현재 재생 중인 노래 ${nowPlaying && !destroyed ? `**${nowPlaying.name}** [${songs[0].duration}]` : "없다 맨이야"} `;
}
function getThumbnail(queue) {
    var _a;
    const { nowPlaying, destroyed } = queue;
    if (destroyed)
        return "";
    return (_a = nowPlaying === null || nowPlaying === void 0 ? void 0 : nowPlaying.thumbnail) !== null && _a !== void 0 ? _a : "";
}
