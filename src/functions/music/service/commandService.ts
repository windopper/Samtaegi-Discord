import { CacheType, ChatInputCommandInteraction, TextChannel } from "discord.js";
import { updateMusicEmbed } from "./updateMusicEmbed";
import { getOrCreateQueue } from "../../../api/music";
import { getSamtaegiEmbedMemory } from "./channelService";

export async function propagateEmbed(interaction: ChatInputCommandInteraction<CacheType>) {
    if (!interaction.guildId || !interaction.guild) return;
    const { samtaegiChannelId } = getSamtaegiEmbedMemory(interaction.guildId);
    const textChannel = await interaction.guild.channels.fetch(samtaegiChannelId) as TextChannel
    await updateMusicEmbed(textChannel.messages, {
        queue: getOrCreateQueue(interaction.guildId)
    })
}