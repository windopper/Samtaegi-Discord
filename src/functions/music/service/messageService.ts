import { Queue, Song } from "discord-music-player";
import { getOrCreateQueue, playMusicApi } from "../../../api/music";
import { ChannelError } from "../../../errors/channel";
import { ButtonBuilder, EmbedBuilder, GuildMessageManager, Message } from "discord.js";
import { getSamtaegiEmbedMemory } from "../index";
import { SamtaegiEmbedAndChannelSchema } from "../../../db";
import { createButtonAction } from "./buttonService";

export async function playMusicService(message: Message<boolean>) {
    const input = message.content;
    const guildId = message.guildId;
    const voiceChannelId = message.member?.voice.channelId;
    if (!guildId) throw ChannelError.getDefault("NO_GUILD_CHANNEL_ERROR");
    if (!voiceChannelId) throw ChannelError.getDefault("NO_VOICE_CHANNEL_ERROR")

    const youtubeMusic = await playMusicApi(input, guildId, voiceChannelId);
    const guildQueue = getOrCreateQueue(guildId)

    await updateMusicEmbed(message.channel.messages as GuildMessageManager, {
      queue: guildQueue,
    })
}

export async function deleteLastMessage(message: Message<boolean>) {
    await message.delete();
}

export async function updateMusicEmbed(messageManager: GuildMessageManager, props: { queue: Queue }) {
    const { queue } = props;
    const guildId = queue.guild.id
    const { samtaegiChannelId, samtaegiEmbedId } = getSamtaegiEmbedMemory(guildId) as SamtaegiEmbedAndChannelSchema;

    const { nowPlaying, songs } = queue;
    const embed = await messageManager.fetch(samtaegiEmbedId)

    const fields: {
        name: string,
        value: string
    }[] = getFields(queue);

    const description: string = getDescription(queue);

    const newEmbed = {
        color: 0x0099FF,
        title: "삼태기 봇이다 맨이야",
        description: description,
        thumbnail: {
            url: getThumbnail(queue),
        },
        footer: {
            text: "채팅 입력 란에 유튜브 링크나 제목을 적어서 노래를 틀 수 있다 맨이야"
        }
    }

    const buttonActionRow = createButtonAction((queue.connection && queue.isPlaying && !queue.destroyed) ? queue.paused : false, queue.repeatMode)

    await embed.edit({
        embeds: [newEmbed], components: [buttonActionRow]
    })
}

function getFields(queue: Queue): {
    name: string,
    value: string
}[] {
    let fields: {
        name: string,
        value: string
    }[] = []
    const { songs, destroyed } = queue;

    if (destroyed) return fields;

    if (songs.length > 0) {
        fields.push({ name: "", value: "" })
        fields.push({ name: "", value: `현재 큐 **${songs.length - 1} 곡**` })
        fields = fields.concat(...songs.slice(1).map(v => {
            return {
                name: "",
                value: `${v.name} [${v.duration}]`
            }
        }))
    }

    return fields;
}

function getDescription(queue: Queue) {
    const { songs, nowPlaying, destroyed } = queue;
    let content = `♬ 현재 재생 중인 노래 ${nowPlaying && !destroyed ? `**${nowPlaying.name}** [${songs[0].duration}]` : "없다 맨이야"} \n`
    if (songs.length > 0) {
        content += `\n현재 큐 **${songs.length - 1} 곡** \n`
        for (let i = 0; i<songs.length; i++) {
            if ((content + getMusicInfo(songs[i]) + '\n').length <= 4000) content += getMusicInfo(songs[i]) + '\n'
            else {
                content += `...이하 ${songs.length - i}곡`
                break;
            }
        }
    }
    return content;
}

function getMusicInfo(song: Song) {
    return `${song.name} [${song.duration}]`
}

function getThumbnail(queue: Queue) {
    const { nowPlaying, destroyed } = queue;
    if (destroyed) return "";
    return nowPlaying?.thumbnail ?? "";
}