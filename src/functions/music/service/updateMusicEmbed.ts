import { Queue } from "discord-music-player";
import { GuildMessageManager } from "discord.js";
import { SamtaegiEmbedAndChannelSchema } from "../../../db";
import { createButtonAction } from "./buttonService";
import { getSamtaegiEmbedMemory } from "./channelService";

export async function updateMusicEmbed(messageManager: GuildMessageManager, props: { queue: Queue; }) {
    const { queue } = props;
    const guildId = queue.guild.id;
    const { samtaegiEmbedId } = getSamtaegiEmbedMemory(guildId) as SamtaegiEmbedAndChannelSchema;
    const title = getTitle(queue);
    const fields = getFields(queue);
    const url = getUrl(queue);
    const embed = await messageManager.fetch(samtaegiEmbedId);

    let newEmbed = {}

    newEmbed = {
        color: 39423,
        title: title,
        url: url,
        //description: description,
        fields: fields,
        image: {
            url: getThumbnail(queue),
        },
        footer: {
            text: "채팅 입력 란에 유튜브 링크나 제목을 적어서 노래를 틀 수 있다 맨이야"
        }
    };

    const buttonActionRow = createButtonAction((queue.connection && queue.isPlaying && !queue.destroyed) ? queue.paused : false, queue.repeatMode);

    await embed.edit({
        embeds: [newEmbed], components: [buttonActionRow]
    });

    function getTitle(queue: Queue) {
        const { nowPlaying } = queue;
        if (!nowPlaying) return "현재 재생 중인 노래 없다 맨이야";
        else return nowPlaying.name;
    }

    function getFields(queue: Queue) {
        const { nowPlaying, songs } = queue;
        const fields: { name: string; value: string; inline?: boolean; }[] = [];
        if (!nowPlaying) return fields;
        const { requestedBy } = nowPlaying;
        fields.push({ name: "길이", value: nowPlaying.duration, inline: true });
        fields.push({ name: "재생 중", value: `<#${queue.connection?.channel.id}>`, inline: true });
        if (requestedBy) {
            fields.push({ name: "요청", value: `<@${requestedBy.id}>`, inline: true });
        }
        //fields.push({ name: "남은 곡", value: `${songs.length - 1}개`, inline: true })
        if (songs.length >= 2) {
            fields.push({ name: "다음 곡", value: `${songs[1].name}` });
        }
        else fields.push({ name: "다음 곡", value: "없음" });
        return fields;
    }

    function getUrl(queue: Queue) {
        const { nowPlaying } = queue;
        if (nowPlaying) return nowPlaying.url;
        return undefined;
    }

    function getThumbnail(queue: Queue) {
        const { nowPlaying, destroyed } = queue;
        if (destroyed) return "";
        return nowPlaying?.thumbnail ?? "";
    }
}
