import { SlashCommandBuilder, Interaction, CacheType } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction: Interaction<CacheType>) {
        console.log('hi')
    }
}