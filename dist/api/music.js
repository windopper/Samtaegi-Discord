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
exports.getOrCreateQueue = exports.disconnectVoiceChannelApi = exports.connectVoiceChannelApi = exports.shuffleApi = exports.clearQueueApi = exports.toggleQueueLoopApi = exports.toggleSongLoopApi = exports.toggleDisableLoopApi = exports.stopMusicApi = exports.skipMusicApi = exports.showMusicListApi = exports.resumeMusicApi = exports.pauseMusicApi = exports.playMusicApi = exports.musicPlayer = void 0;
const discord_music_player_1 = require("discord-music-player");
const youtube_1 = require("./youtube");
const music_1 = require("../errors/music");
const channel_1 = require("../errors/channel");
const musicPlayerEvents_1 = require("../functions/music/events/musicPlayerEvents");
function initializeMusicPlayer(client) {
    exports.musicPlayer = new discord_music_player_1.Player(client);
    (0, musicPlayerEvents_1.listenMusicPlayerEvent)(client, exports.musicPlayer);
}
exports.default = initializeMusicPlayer;
/**
 * connect to voice channel and add music to queue
 *
 * @param title music title or url (only youtube)
 * @param guildId
 * @param voiceChannelId
 * @returns
 */
function playMusicApi(title, guildId, voiceChannelId) {
    return __awaiter(this, void 0, void 0, function* () {
        let queue = getOrCreateQueue(guildId);
        yield connectVoiceChannelApi(guildId, voiceChannelId);
        let musicYoutubeLink = "";
        console.log(title);
        if ((0, youtube_1.checkYoutubeLink)(title)) {
            console.log("check link");
            musicYoutubeLink = title;
        }
        else {
            const musicYoutube = yield (0, youtube_1.getYoutubeMusic)(title);
            if (musicYoutube.items.length == 0)
                throw music_1.MusicError.getDefault("NO_MUSIC_FOUND_ERROR");
            musicYoutubeLink = (0, youtube_1.parseLinks)(musicYoutube).items[0];
            console.log(musicYoutubeLink);
        }
        let song = yield queue.play(title);
        console.log(song.url);
        return song;
    });
}
exports.playMusicApi = playMusicApi;
function pauseMusicApi(guildId) {
    const guildQueue = getOrCreateQueue(guildId);
    validateConnection(guildQueue);
    guildQueue === null || guildQueue === void 0 ? void 0 : guildQueue.setPaused(true);
}
exports.pauseMusicApi = pauseMusicApi;
function resumeMusicApi(guildId) {
    const guildQueue = getOrCreateQueue(guildId);
    validateConnection(guildQueue);
    guildQueue === null || guildQueue === void 0 ? void 0 : guildQueue.setPaused(false);
}
exports.resumeMusicApi = resumeMusicApi;
function showMusicListApi(guildId) {
    const guildQueue = getOrCreateQueue(guildId);
    validateConnection(guildQueue);
    return guildQueue === null || guildQueue === void 0 ? void 0 : guildQueue.songs;
}
exports.showMusicListApi = showMusicListApi;
function skipMusicApi(guildId) {
    const guildQueue = getOrCreateQueue(guildId);
    validateConnection(guildQueue);
    guildQueue === null || guildQueue === void 0 ? void 0 : guildQueue.skip();
    return guildQueue.nowPlaying;
}
exports.skipMusicApi = skipMusicApi;
function stopMusicApi(guildId) {
    const guildQueue = getOrCreateQueue(guildId);
    validateConnection(guildQueue);
    guildQueue === null || guildQueue === void 0 ? void 0 : guildQueue.stop();
}
exports.stopMusicApi = stopMusicApi;
function toggleDisableLoopApi(guildId) {
    const guildQueue = getOrCreateQueue(guildId);
    validateConnection(guildQueue);
    guildQueue === null || guildQueue === void 0 ? void 0 : guildQueue.setRepeatMode(discord_music_player_1.RepeatMode.DISABLED);
}
exports.toggleDisableLoopApi = toggleDisableLoopApi;
function toggleSongLoopApi(guildId) {
    const guildQueue = getOrCreateQueue(guildId);
    validateConnection(guildQueue);
    guildQueue === null || guildQueue === void 0 ? void 0 : guildQueue.setRepeatMode(discord_music_player_1.RepeatMode.SONG);
}
exports.toggleSongLoopApi = toggleSongLoopApi;
function toggleQueueLoopApi(guildId) {
    const guildQueue = getOrCreateQueue(guildId);
    validateConnection(guildQueue);
    guildQueue === null || guildQueue === void 0 ? void 0 : guildQueue.setRepeatMode(discord_music_player_1.RepeatMode.QUEUE);
}
exports.toggleQueueLoopApi = toggleQueueLoopApi;
function clearQueueApi(guildId) {
    const guildQueue = getOrCreateQueue(guildId);
    validateConnection(guildQueue);
    guildQueue === null || guildQueue === void 0 ? void 0 : guildQueue.clearQueue();
}
exports.clearQueueApi = clearQueueApi;
function shuffleApi(guildId) {
    const guildQueue = getOrCreateQueue(guildId);
    validateConnection(guildQueue);
    return guildQueue === null || guildQueue === void 0 ? void 0 : guildQueue.shuffle();
}
exports.shuffleApi = shuffleApi;
function connectVoiceChannelApi(guildId, voiceChannelId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!voiceChannelId)
            throw new channel_1.ChannelError({
                name: "NO_VOICE_CHANNEL_ERROR",
                message: "음성 채널을 찾을 수 없어요"
            });
        const guildQueue = getOrCreateQueue(guildId);
        yield guildQueue.join(voiceChannelId);
    });
}
exports.connectVoiceChannelApi = connectVoiceChannelApi;
function disconnectVoiceChannelApi(guildId) {
    var _a;
    const guildQueue = getOrCreateQueue(guildId);
    if (!guildQueue.connection)
        throw "음성 채널이 없어요";
    (_a = guildQueue.connection) === null || _a === void 0 ? void 0 : _a.leave();
    return "음성 채널에서 나갔어요";
}
exports.disconnectVoiceChannelApi = disconnectVoiceChannelApi;
function getOrCreateQueue(guildId) {
    if (!guildId)
        throw channel_1.ChannelError.getDefault("NO_GUILD_CHANNEL_ERROR");
    if (exports.musicPlayer.hasQueue(guildId))
        return exports.musicPlayer.getQueue(guildId);
    else
        return exports.musicPlayer.createQueue(guildId);
}
exports.getOrCreateQueue = getOrCreateQueue;
function validateConnection(guildQueue) {
    if (!guildQueue.connection)
        throw music_1.MusicError.getDefault("NO_QUEUE_CONNECTION");
}
