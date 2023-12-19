import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default interface Command {
    data: SlashCommandBuilder,
    execute: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>
}