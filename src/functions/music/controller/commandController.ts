import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { commandCollection } from "../../../commands";
import { propagateEmbed } from "../service/commandService";

export async function musicCommandController(interaction: ChatInputCommandInteraction<CacheType>) {
    const command = commandCollection.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName}`)
        return;
    }

    try {
        await command?.execute(interaction)
        await propagateEmbed(interaction);
    } catch (err) {
        console.log(err)
    }

}