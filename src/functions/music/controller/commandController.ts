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
    } catch (err) {
        console.log(err)
        if (err instanceof Error) { 
            interaction.reply({
                ephemeral: true,
                content: err.message
            })
        }
    }

    await propagateEmbed(interaction);
}