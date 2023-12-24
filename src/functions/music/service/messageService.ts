import { Song } from "discord-music-player";
import { getOrCreateQueue, playMusicApi } from "../../../api/music/music";
import { ChannelError } from "../../../errors/channel";
import { ButtonBuilder, EmbedBuilder, GuildMessageManager, Message } from "discord.js";
import { updateMusicEmbed } from "./updateMusicEmbed";

export async function playMusicService(message: Message<boolean>) {
    const input = message.content;
    const guildId = message.guildId;
    const voiceChannelId = message.member?.voice.channelId;
    if (!guildId) throw ChannelError.getDefault("NO_GUILD_ERROR");
    if (!voiceChannelId) throw ChannelError.getDefault("NO_VOICE_CHANNEL_ERROR")

    const youtubeMusic = await playMusicApi(input, guildId, voiceChannelId, message.author);
    const guildQueue = getOrCreateQueue(guildId)

    await updateMusicEmbed(message.channel.messages as GuildMessageManager, {
      queue: guildQueue,
    })
}

export async function deleteLastMessage(message: Message<boolean>) {
    await message.delete();
}

