import { MusicError } from "../../errors/music";
import { ChannelError } from "../../errors/channel";
import { listenMusicPlayerEvent } from "../../functions/music/events/musicPlayerEvents";
import { User } from "discord.js";
import { Player, Playlist, Queue, RepeatMode, Song, Utils } from "discord-music-player";
import playdl from 'play-dl'

export let musicPlayer: Player;

export default function initializeMusicPlayer(client: any) {
    musicPlayer = new Player(client, {
        quality: 'low',
        
    });
    listenMusicPlayerEvent(client, musicPlayer);
}

type MusicType = "SoundCloudPlaylist" | "YoutubePlayList" | "SpotifyPlayList" | "SpotifyAlbum" | "SoundCloudTrack" | "YoutubeVideo" | "SpotifyTrack" | "Search"
export type MusicAPI = {
    song: Song | Playlist,
    type: MusicType
}
/**
 * connect to voice channel and add music to queue
 * 
 * @param input music title or url (only youtube)
 * @param guildId 
 * @param voiceChannelId 
 * @returns 
 */
export async function playMusicApi(input: string, guildId: string, voiceChannelId: string, requestedBy?: User): Promise<MusicAPI> {
    let queue: Queue = getOrCreateQueue(guildId);
    await connectVoiceChannelApi(guildId, voiceChannelId)

    let song: Song | Playlist;
    let type: MusicType;
    const soundcloudType = await playdl.so_validate(input);
    const youtubeType = playdl.yt_validate(input);
    const spotifyType = playdl.sp_validate(input);
    
    if (soundcloudType === "playlist") {
        song = await Utils.soundCloudPlayList(input, { requestedBy }, queue);
        type = "SoundCloudPlaylist"
    }
    else if (youtubeType === "playlist") {
        song = await Utils.youtubePlayList(input, { requestedBy }, queue);
        type = "YoutubePlayList"
    }
    else if (spotifyType === "album" || spotifyType === "playlist") {
        song = await Utils.spotifyPlayList(input, { requestedBy }, queue);
        if (spotifyType === "album") type = "SpotifyAlbum"
        else type = "SpotifyPlayList"
    }
    else if (soundcloudType === "track") {
        song = await Utils.soundCloudLink(input, { requestedBy }, queue);
        type = "SoundCloudTrack"
    }
    else if (youtubeType === "video") {
        song = await Utils.youtubeLink(input, { requestedBy }, queue);
        type = "YoutubeVideo"
    }
    else if (spotifyType === "track") {
        song = await Utils.spotifyLink(input, { requestedBy }, queue);
        type = "SpotifyTrack"
    }
    else {
        const songs = await Utils.search(input, { requestedBy }, queue);
        if (songs.length === 0) throw MusicError.getDefault("NO_MUSIC_FOUND_ERROR")
        song = songs[0];
        type = "Search"
    }

    if (song instanceof Song) await queue.play(song);
    else if (song instanceof Playlist) await queue.playlist(song);
    return {
        song,
        type
    }
}

export function pauseMusicApi(guildId: string | null) {
    const guildQueue = getOrCreateQueue(guildId);
    validateConnection(guildQueue)
    guildQueue?.setPaused(true);
}

export function resumeMusicApi(guildId?: string | null) {
    const guildQueue = getOrCreateQueue(guildId);
    validateConnection(guildQueue)
    guildQueue?.setPaused(false);
}

export function showMusicListApi(guildId?: string | null) {
    const guildQueue = getOrCreateQueue(guildId);
    validateConnection(guildQueue)
    return guildQueue?.songs;
}

export function skipMusicApi(guildId?: string | null) {
    const guildQueue = getOrCreateQueue(guildId);
    validateConnection(guildQueue)
    guildQueue?.skip();
    return guildQueue.nowPlaying;
}

export function stopMusicApi(guildId?: string | null) {
    const guildQueue = getOrCreateQueue(guildId);
    validateConnection(guildQueue)
    guildQueue?.stop();
}

export function toggleDisableLoopApi(guildId?: string | null) {
    const guildQueue = getOrCreateQueue(guildId);
    validateConnection(guildQueue)
    guildQueue?.setRepeatMode(RepeatMode.DISABLED)
}

export function toggleSongLoopApi(guildId?: string | null) {
    const guildQueue = getOrCreateQueue(guildId);
    validateConnection(guildQueue)
    guildQueue?.setRepeatMode(RepeatMode.SONG)
}

export function toggleQueueLoopApi(guildId?: string | null) {
    const guildQueue = getOrCreateQueue(guildId);
    validateConnection(guildQueue)
    guildQueue?.setRepeatMode(RepeatMode.QUEUE)
}

export function clearQueueApi(guildId?: string | null) {
    const guildQueue = getOrCreateQueue(guildId);
    validateConnection(guildQueue)
    guildQueue?.clearQueue()
}

export function shuffleApi(guildId?: string | null) {
    const guildQueue = getOrCreateQueue(guildId);
    validateConnection(guildQueue)
    return guildQueue?.shuffle()
}

export async function connectVoiceChannelApi(guildId?: string | null, voiceChannelId?: string | null) {
    if (!voiceChannelId) throw new ChannelError({
        name: "NO_VOICE_CHANNEL_ERROR",
        message: "음성 채널을 찾을 수 없어요"
    })
    const guildQueue = getOrCreateQueue(guildId);
    await guildQueue.join(voiceChannelId);
}

export function disconnectVoiceChannelApi(guildId?: string | null) {
    const guildQueue = getOrCreateQueue(guildId);
    if (!guildQueue.connection) throw "음성 채널이 없어요"
    guildQueue.connection?.leave();
    return "음성 채널에서 나갔어요"
}

function validateConnection(guildQueue: Queue) {
    if (!guildQueue.connection) throw MusicError.getDefault("NO_QUEUE_CONNECTION")
}

export function getOrCreateQueue(guildId?: string | null) {
    if (!guildId) throw ChannelError.getDefault("NO_GUILD_ERROR")
    let queue = musicPlayer.getQueue(guildId);
    if (queue) return queue;
    queue = musicPlayer.createQueue(guildId);
    return queue;
}