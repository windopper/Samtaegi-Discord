import { CacheType, ChatInputCommandInteraction, TextChannel } from "discord.js";
import { updateMusicEmbed } from "./messageService";
import { getOrCreateQueue } from "../../../api/music";

export async function propagateEmbed(interaction: ChatInputCommandInteraction<CacheType>) {
    const textChannel = interaction.channel as TextChannel
    await updateMusicEmbed(textChannel.messages, {
        queue: getOrCreateQueue(interaction.guildId)
    })
}