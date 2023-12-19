import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import { messages } from "../../agent/agent";

export default {
    data: new SlashCommandBuilder()
        .setName('message')
        .setDescription('Show Agent Message'),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        console.log(messages)
    }
}