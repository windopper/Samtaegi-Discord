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
exports.disconnectVoiceChannelTool = exports.connectVoiceChannelTool = exports.shuffleTool = exports.clearQueueTool = exports.toggleQueueLoopTool = exports.toggleSongLoopTool = exports.removeLoopTool = exports.stopMusicTool = exports.skipMusicTool = exports.showMusicListTool = exports.resumeMusicTool = exports.pauseMusicTool = exports.playMusicTool = exports.initializeMusicTools = exports.musicPlayer = void 0;
const _1 = require("./");
const util_1 = require("./util");
const music_1 = require("../../api/music");
const music_2 = require("../../errors/music");
function initializeMusicTools() {
    (0, _1.registerTools)((0, util_1.generateToolSchema)({
        name: _1.Tools.MUSIC_PLAY,
        description: "제목이나 url로 음악을 재생 후 제목을 반환",
        properties: {
            title: { type: "string", description: "title or url of the music" }
        },
        required: ["title"]
    }), playMusicTool, exceptionHandler);
    (0, _1.registerTools)((0, util_1.generateToolSchema)({
        name: _1.Tools.MUSIC_RESUME,
        description: "음악 일시정지 해제",
        properties: {}
    }), resumeMusicTool, exceptionHandler);
    (0, _1.registerTools)((0, util_1.generateToolSchema)({
        name: _1.Tools.MUSIC_PAUSE,
        description: "음악 일시정지",
        properties: {}
    }), pauseMusicTool, exceptionHandler);
    (0, _1.registerTools)((0, util_1.generateToolSchema)({
        name: _1.Tools.MUSIC_LIST,
        description: "신청된 음악 리스트를 보여준다",
        properties: {}
    }), showMusicListTool, exceptionHandler);
    (0, _1.registerTools)((0, util_1.generateToolSchema)({
        name: _1.Tools.MUSIC_SKIP,
        description: "음악 스킵 후 다음 노래 제목을 보여줌",
        properties: {}
    }), skipMusicTool, exceptionHandler);
    (0, _1.registerTools)((0, util_1.generateToolSchema)({
        name: _1.Tools.MUSIC_STOP,
        description: "음악 멈춤",
        properties: {}
    }), stopMusicTool, exceptionHandler);
    (0, _1.registerTools)((0, util_1.generateToolSchema)({
        name: _1.Tools.MUSIC_REMOVE_LOOP,
        description: "음악 반복 해제",
        properties: {}
    }), removeLoopTool, exceptionHandler);
    (0, _1.registerTools)((0, util_1.generateToolSchema)({
        name: _1.Tools.MUSIC_TOGGLE_SONG_LOOP,
        description: "음악 반복 설정",
        properties: {}
    }), toggleSongLoopTool, exceptionHandler);
    (0, _1.registerTools)((0, util_1.generateToolSchema)({
        name: _1.Tools.MUSIC_TOGGLE_QUEUE_LOOP,
        description: "큐 반복 설정",
        properties: {}
    }), toggleQueueLoopTool, exceptionHandler);
    (0, _1.registerTools)((0, util_1.generateToolSchema)({
        name: _1.Tools.MUSIC_CLEAR_QUEUE,
        description: "음악 큐 제거",
        properties: {}
    }), clearQueueTool, exceptionHandler);
    (0, _1.registerTools)((0, util_1.generateToolSchema)({
        name: _1.Tools.MUSIC_SHUFFLE,
        description: "음악 큐 섞기",
        properties: {}
    }), shuffleTool, exceptionHandler);
    (0, _1.registerTools)((0, util_1.generateToolSchema)({
        name: _1.Tools.VOICE_CONNECT_CHANNEL,
        description: "음성 채널에 들어가기",
        properties: {}
    }), connectVoiceChannelTool, exceptionHandler);
    (0, _1.registerTools)((0, util_1.generateToolSchema)({
        name: _1.Tools.VOICE_DISCONNECT_CHANNEL,
        description: "음성 채널에서 나가기",
        properties: {}
    }), disconnectVoiceChannelTool, exceptionHandler);
}
exports.initializeMusicTools = initializeMusicTools;
const exceptionHandler = {
    apply(target, thisArg, argsArray) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield target(...argsArray);
            }
            catch (err) {
                console.log(err);
                if (err instanceof music_2.MusicError) {
                    return err.message;
                }
            }
        });
    }
};
function playMusicTool(title, message) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!message.guildId)
            return;
        if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channelId))
            return;
        const youtubeMusic = yield (0, music_1.playMusicApi)(title, message.guildId, message.member.voice.channelId);
        const musicTitle = youtubeMusic.items[0].snippet.title;
        return `success add queue title: "${musicTitle}" music`;
    });
}
exports.playMusicTool = playMusicTool;
function pauseMusicTool(message) {
    (0, music_1.pauseMusicApi)(message.guildId);
    return "음악 일시정지 성공";
}
exports.pauseMusicTool = pauseMusicTool;
function resumeMusicTool(message) {
    (0, music_1.resumeMusicApi)(message.guildId);
    return "음악 일시정지 해제 성공";
}
exports.resumeMusicTool = resumeMusicTool;
function showMusicListTool(message) {
    return (0, music_1.showMusicListApi)(message.guildId).map(v => v.name);
}
exports.showMusicListTool = showMusicListTool;
function skipMusicTool(message) {
    const nextSong = (0, music_1.skipMusicApi)(message.guildId);
    if (nextSong)
        return `스킵 성공 및 다음 음악의 제목은 ${nextSong.name} 입니다`;
    else
        return `스킵 성공 및 다음 음악이 없습니다`;
}
exports.skipMusicTool = skipMusicTool;
function stopMusicTool(message) {
    (0, music_1.stopMusicApi)(message.guildId);
    return "음악 정지";
}
exports.stopMusicTool = stopMusicTool;
function removeLoopTool(message) {
    (0, music_1.toggleDisableLoopApi)(message.guildId);
    return "모든 루프를 제거하였습니다";
}
exports.removeLoopTool = removeLoopTool;
function toggleSongLoopTool(message) {
    (0, music_1.toggleSongLoopApi)(message.guildId);
    return "노래 루프를 설정하였습니다";
}
exports.toggleSongLoopTool = toggleSongLoopTool;
function toggleQueueLoopTool(message) {
    (0, music_1.toggleQueueLoopApi)(message.guildId);
    return "큐 루프를 설정하였습니다";
}
exports.toggleQueueLoopTool = toggleQueueLoopTool;
function clearQueueTool(message) {
    (0, music_1.clearQueueApi)(message.guildId);
    return "큐를 제거하였습니다";
}
exports.clearQueueTool = clearQueueTool;
function shuffleTool(message) {
    const songs = (0, music_1.shuffleApi)(message.guildId);
    return `큐를 섞었습니다. 섞은 큐의 결과는 다음과 같습니다 ${songs === null || songs === void 0 ? void 0 : songs.map(v => v.name)}`;
}
exports.shuffleTool = shuffleTool;
function connectVoiceChannelTool(message) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, music_1.connectVoiceChannelApi)(message.guildId, (_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channelId);
        return "음성 채널에 들어왔어요";
    });
}
exports.connectVoiceChannelTool = connectVoiceChannelTool;
function disconnectVoiceChannelTool(message) {
    var _a;
    const guildQueue = getOrCreateQueue(message);
    if (!guildQueue.connection)
        throw "음성 채널이 없어요";
    (_a = guildQueue.connection) === null || _a === void 0 ? void 0 : _a.leave();
    return "음성 채널에서 나갔어요";
}
exports.disconnectVoiceChannelTool = disconnectVoiceChannelTool;
function getOrCreateQueue(message) {
    if (!message.guildId)
        throw "";
    if (exports.musicPlayer.hasQueue(message.guildId))
        return exports.musicPlayer.getQueue(message.guildId);
    else
        return exports.musicPlayer.createQueue(message.guildId);
}
