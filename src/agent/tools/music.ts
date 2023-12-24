import { Player, Queue } from 'discord-music-player'
import { Message } from 'discord.js'
import { Tools, registerTools } from './';
import { generateToolSchema } from './util';
import { clearQueueApi, connectVoiceChannelApi, pauseMusicApi, playMusicApi, toggleDisableLoopApi, resumeMusicApi, showMusicListApi, shuffleApi, skipMusicApi, stopMusicApi, toggleQueueLoopApi, toggleSongLoopApi } from '../../api/music/music';
import { MusicError } from '../../errors/music';

export let musicPlayer: Player;

export function initializeMusicTools() {
    registerTools(generateToolSchema({
        name: Tools.MUSIC_PLAY,
        description: "제목이나 url로 음악을 재생 후 제목을 반환",
        properties: {
            title: { type: "string", description: "title or url of the music"}
        },
        required: ["title"]
    }), playMusicTool, exceptionHandler)

    registerTools(generateToolSchema({
        name: Tools.MUSIC_RESUME,
        description: "음악 일시정지 해제",
        properties: {}
    }), resumeMusicTool, exceptionHandler)

    registerTools(generateToolSchema({
        name: Tools.MUSIC_PAUSE,
        description: "음악 일시정지",
        properties: {}
    }), pauseMusicTool, exceptionHandler)

    registerTools(generateToolSchema({
        name: Tools.MUSIC_LIST,
        description: "신청된 음악 리스트를 보여준다",
        properties: {}
    }), showMusicListTool, exceptionHandler)

    registerTools(generateToolSchema({
        name: Tools.MUSIC_SKIP,
        description: "음악 스킵 후 다음 노래 제목을 보여줌",
        properties: {}
    }), skipMusicTool, exceptionHandler)

    registerTools(generateToolSchema({
        name: Tools.MUSIC_STOP,
        description: "음악 멈춤",
        properties: {}
    }), stopMusicTool, exceptionHandler)

    registerTools(generateToolSchema({
        name: Tools.MUSIC_REMOVE_LOOP,
        description: "음악 반복 해제",
        properties: {}
    }), removeLoopTool, exceptionHandler)

    registerTools(generateToolSchema({
        name: Tools.MUSIC_TOGGLE_SONG_LOOP,
        description: "음악 반복 설정",
        properties: {}
    }), toggleSongLoopTool, exceptionHandler)

    registerTools(generateToolSchema({
        name: Tools.MUSIC_TOGGLE_QUEUE_LOOP,
        description: "큐 반복 설정",
        properties: {}
    }), toggleQueueLoopTool, exceptionHandler)

    registerTools(generateToolSchema({
        name: Tools.MUSIC_CLEAR_QUEUE,
        description: "음악 큐 제거",
        properties: {}
    }), clearQueueTool, exceptionHandler)

    registerTools(generateToolSchema({
        name: Tools.MUSIC_SHUFFLE,
        description: "음악 큐 섞기",
        properties: {}
    }), shuffleTool, exceptionHandler)

    registerTools(generateToolSchema({
        name: Tools.VOICE_CONNECT_CHANNEL,
        description: "음성 채널에 들어가기",
        properties: {}
      }), connectVoiceChannelTool, exceptionHandler)

    registerTools(generateToolSchema({
        name: Tools.VOICE_DISCONNECT_CHANNEL,
        description: "음성 채널에서 나가기",
        properties: {}
      }), disconnectVoiceChannelTool, exceptionHandler)
}

const exceptionHandler: ProxyHandler<any> = {
    async apply(target, thisArg, argsArray: any[]) {
        try {
            return await target(...argsArray)
        }
        catch (err) {
            console.log(err)
            if (err instanceof MusicError) {
                return err.message;
            }
        }
    }
}

export async function playMusicTool(title: string, message: Message<boolean>) {
    if (!message.guildId) return;
    if (!message.member?.voice.channelId) return;
    const youtubeMusic = await playMusicApi(title, message.guildId, message.member.voice.channelId, message.author)
    const musicTitle = youtubeMusic.name
    return `success add queue title: "${musicTitle}" music`
}

export function pauseMusicTool(message: Message<boolean>) {
    pauseMusicApi(message.guildId);
    return "음악 일시정지 성공"
}

export function resumeMusicTool(message: Message<boolean>) {
    resumeMusicApi(message.guildId);
    return "음악 일시정지 해제 성공"
}

export function showMusicListTool(message: Message<boolean>) {
    return showMusicListApi(message.guildId).map(v => v.name);
}

export function skipMusicTool(message: Message<boolean>) {
    const nextSong = skipMusicApi(message.guildId);
    if (nextSong) return `스킵 성공 및 다음 음악의 제목은 ${nextSong.name} 입니다`
    else return `스킵 성공 및 다음 음악이 없습니다`
}

export function stopMusicTool(message: Message<boolean>) {
    stopMusicApi(message.guildId);
    return "음악 정지"
}

export function removeLoopTool(message: Message<boolean>) {
    toggleDisableLoopApi(message.guildId);
    return "모든 루프를 제거하였습니다"
}

export function toggleSongLoopTool(message: Message<boolean>) {
    toggleSongLoopApi(message.guildId);
    return "노래 루프를 설정하였습니다"
}

export function toggleQueueLoopTool(message: Message<boolean>) {
    toggleQueueLoopApi(message.guildId);
    return "큐 루프를 설정하였습니다"
}

export function clearQueueTool(message: Message<boolean>) {
    clearQueueApi(message.guildId);
    return "큐를 제거하였습니다"
}

export function shuffleTool(message: Message<boolean>) {
    const songs = shuffleApi(message.guildId);
    return `큐를 섞었습니다. 섞은 큐의 결과는 다음과 같습니다 ${songs?.map(v => v.name)}`
}

export async function connectVoiceChannelTool(message: Message<boolean>) {
    await connectVoiceChannelApi(message.guildId, message.member?.voice.channelId)
    return "음성 채널에 들어왔어요"
}

export function disconnectVoiceChannelTool(message: Message<boolean>) {
    const guildQueue = getOrCreateQueue(message);
    if (!guildQueue.connection) throw "음성 채널이 없어요"
    guildQueue.connection?.leave();
    return "음성 채널에서 나갔어요"
}

function getOrCreateQueue(message: Message<boolean>): Queue {
    if (!message.guildId) throw "";
    if (musicPlayer.hasQueue(message.guildId)) return musicPlayer.getQueue(message.guildId) as Queue
    else return musicPlayer.createQueue(message.guildId)
}