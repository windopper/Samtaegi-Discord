import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import { messages } from "../../agent/agent";
import { connectVoiceChannelApi, getOrCreateQueue } from "../../api/music";

export default {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Show Agent Message'),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const queue = getOrCreateQueue(interaction.guildId);
        const userId = interaction.member?.user.id as string
        const member = interaction.guild?.members.cache.get(userId);
        const channelId = member?.voice.channelId;
        await connectVoiceChannelApi(interaction.guildId, channelId)
        const song = await queue.play("https://www.youtube.com/watch?v=-o7X4W-wQbo")
        console.log(song.url)
    }
}