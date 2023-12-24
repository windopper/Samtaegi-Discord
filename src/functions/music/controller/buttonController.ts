import { ButtonInteraction } from "discord.js";
import { MusicButtonId, pauseMusicService, propagateEmbed, resumeMusicService, showQueueList, shuffleMusicService, skipMusicService, stopMusicService, toggleDisableLoopService, toggleQueueLoopService, toggleSongLoopService } from "../service/buttonService";
import { getOrCreateQueue } from "../../../api/music";
import { ChannelError } from "../../../errors/channel";
import { SamtaegiError } from "../../../errors/samtaegi";
import logger from "../../../logger";

export async function musicButtonController(interaction: ButtonInteraction) {
    try {
        logger.info(getLoggerPrefix(interaction))
        await interaction.deferReply({
            ephemeral: true
        })
        switch (interaction.customId) {
            case MusicButtonId.PAUSE: {
                await pauseMusicService(interaction);
                break;
            }
            case MusicButtonId.SHUFFLE: {
                await shuffleMusicService(interaction);
                break;
            }
            case MusicButtonId.SKIP: {
                await skipMusicService(interaction);
                break;
            }
            case MusicButtonId.STOP: {
                await stopMusicService(interaction);
                break;
            }
            case MusicButtonId.RESUME: {
                await resumeMusicService(interaction);
                break;
            }
            case MusicButtonId.NO_LOOP: {
                await toggleSongLoopService(interaction);
                break;
            }
            case MusicButtonId.SONG_LOOP: {
                await toggleQueueLoopService(interaction);
                break;
            }
            case MusicButtonId.QUEUE_LOOP: {
                await toggleDisableLoopService(interaction);
                break;
            }
            case MusicButtonId.QUEUE_LIST: {
                await showQueueList(interaction);
                break;
            }
        }
        await propagateEmbed(interaction);
    }
    catch(err) {
        if (err instanceof Error) await exceptionHandler(interaction, err);
    }
}

async function exceptionHandler(interaction: ButtonInteraction, err: Error) {
    if (err instanceof SamtaegiError) logger.warn(getLoggerPrefix(interaction) + ` err: ${err}`)
    else logger.error(getLoggerPrefix(interaction) + ` err: ${err}`)
    await interaction.editReply({
        content: `:warning: ${err.message}`,
    })
}

function getLoggerPrefix(interaction: ButtonInteraction) {
    return `embed_button_${interaction.customId} / ${interaction.user.username}[${interaction.user.id}]`
}