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
exports.propagateEmbed = exports.toggleDisableLoopService = exports.toggleQueueLoopService = exports.toggleSongLoopService = exports.skipMusicService = exports.stopMusicService = exports.shuffleMusicService = exports.resumeMusicService = exports.pauseMusicService = exports.createButtonAction = exports.MusicButtonId = void 0;
const discord_js_1 = require("discord.js");
const music_1 = require("../../../api/music");
const messageService_1 = require("./messageService");
const discord_music_player_1 = require("discord-music-player");
var MusicButtonId;
(function (MusicButtonId) {
    MusicButtonId["RESUME"] = "music/resume";
    MusicButtonId["PAUSE"] = "music/pause";
    MusicButtonId["SKIP"] = "music/skip";
    MusicButtonId["SHUFFLE"] = "music/shuffle";
    MusicButtonId["STOP"] = "music/stop";
    MusicButtonId["NO_LOOP"] = "music/no_loop";
    MusicButtonId["SONG_LOOP"] = "music/song_loop";
    MusicButtonId["QUEUE_LOOP"] = "musig/queue_loop";
})(MusicButtonId || (exports.MusicButtonId = MusicButtonId = {}));
function createButtonAction(paused, repeatMode) {
    const pause = new discord_js_1.ButtonBuilder()
        .setCustomId(MusicButtonId.PAUSE)
        .setLabel("일시정지")
        .setStyle(discord_js_1.ButtonStyle.Secondary);
    const play = new discord_js_1.ButtonBuilder()
        .setCustomId(MusicButtonId.RESUME)
        .setLabel("재생")
        .setStyle(discord_js_1.ButtonStyle.Secondary);
    const skip = new discord_js_1.ButtonBuilder()
        .setCustomId(MusicButtonId.SKIP)
        .setLabel("스킵")
        .setStyle(discord_js_1.ButtonStyle.Primary);
    const shuffle = new discord_js_1.ButtonBuilder()
        .setCustomId(MusicButtonId.SHUFFLE)
        .setLabel("셔플")
        .setStyle(discord_js_1.ButtonStyle.Primary);
    const stop = new discord_js_1.ButtonBuilder()
        .setCustomId(MusicButtonId.STOP)
        .setLabel("중지")
        .setStyle(discord_js_1.ButtonStyle.Danger);
    let row = new discord_js_1.ActionRowBuilder();
    if (paused)
        row = row.addComponents(play);
    else
        row = row.addComponents(pause);
    row = row.addComponents(skip, shuffle, stop);
    if (repeatMode === discord_music_player_1.RepeatMode.DISABLED) {
        row.addComponents(new discord_js_1.ButtonBuilder().setCustomId(MusicButtonId.NO_LOOP)
            .setLabel("반복: 없음")
            .setStyle(discord_js_1.ButtonStyle.Secondary));
    }
    else if (repeatMode === discord_music_player_1.RepeatMode.QUEUE) {
        row.addComponents(new discord_js_1.ButtonBuilder().setCustomId(MusicButtonId.QUEUE_LOOP)
            .setLabel("반복: 큐")
            .setStyle(discord_js_1.ButtonStyle.Secondary));
    }
    else if (repeatMode === discord_music_player_1.RepeatMode.SONG) {
        row.addComponents(new discord_js_1.ButtonBuilder().setCustomId(MusicButtonId.SONG_LOOP)
            .setLabel("반복: 현재 노래")
            .setStyle(discord_js_1.ButtonStyle.Secondary));
    }
    return row;
}
exports.createButtonAction = createButtonAction;
function pauseMusicService(interaction) {
    (0, music_1.pauseMusicApi)(interaction.guildId);
}
exports.pauseMusicService = pauseMusicService;
function resumeMusicService(interaction) {
    (0, music_1.resumeMusicApi)(interaction.guildId);
}
exports.resumeMusicService = resumeMusicService;
function shuffleMusicService(interaction) {
    (0, music_1.shuffleApi)(interaction.guildId);
}
exports.shuffleMusicService = shuffleMusicService;
function stopMusicService(interaction) {
    (0, music_1.stopMusicApi)(interaction.guildId);
}
exports.stopMusicService = stopMusicService;
function skipMusicService(interaction) {
    (0, music_1.skipMusicApi)(interaction.guildId);
}
exports.skipMusicService = skipMusicService;
function toggleSongLoopService(interaction) {
    (0, music_1.toggleSongLoopApi)(interaction.guildId);
}
exports.toggleSongLoopService = toggleSongLoopService;
function toggleQueueLoopService(interaction) {
    (0, music_1.toggleQueueLoopApi)(interaction.guildId);
}
exports.toggleQueueLoopService = toggleQueueLoopService;
function toggleDisableLoopService(interaction) {
    (0, music_1.toggleDisableLoopApi)(interaction.guildId);
}
exports.toggleDisableLoopService = toggleDisableLoopService;
function propagateEmbed(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = interaction.channel;
        yield (0, messageService_1.updateMusicEmbed)(channel.messages, {
            queue: (0, music_1.getOrCreateQueue)(interaction.guildId),
        });
    });
}
exports.propagateEmbed = propagateEmbed;
