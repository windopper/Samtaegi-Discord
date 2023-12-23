import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { commandCollection } from "../../../commands";
import { propagateEmbed } from "../service/commandService";
import logger from "../../../logger";
import { SamtaegiError } from "../../../errors/samtaegi";

export async function musicCommandController(interaction: ChatInputCommandInteraction<CacheType>) {
    const command = commandCollection.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName}`)
        return;
    }

    try {
        await interaction.deferReply({
            ephemeral: true
        })
        await command?.execute(interaction)
        await propagateEmbed(interaction);
    } catch (err) {
        if (err instanceof SamtaegiError) {
            logger.warn(getLoggerPrefix(interaction) + ` err: ${err}`)
            await interaction.editReply({
                content: err.message
            })
        }
        else logger.error(getLoggerPrefix(interaction) + ` err: ${err}`)
    }
}

function getLoggerPrefix(interaction: ChatInputCommandInteraction<CacheType>) {
    return `command_${interaction.commandName} / ${interaction.user.username}[${interaction.user.id}]`
}