import { ButtonInteraction } from "discord.js";
import { MusicButtonId, pauseMusicService, propagateEmbed, resumeMusicService, shuffleMusicService, skipMusicService, stopMusicService, toggleDisableLoopService, toggleQueueLoopService, toggleSongLoopService } from "../service/buttonService";
import { getOrCreateQueue } from "../../../api/music";
import { ChannelError } from "../../../errors/channel";

export async function musicButtonController(interaction: ButtonInteraction) {
    try {

        switch (interaction.customId) {
            case MusicButtonId.PAUSE: {
                pauseMusicService(interaction);
                break;
            }
            case MusicButtonId.SHUFFLE: {
                shuffleMusicService(interaction);
                break;
            }
            case MusicButtonId.SKIP: {
                skipMusicService(interaction);
                break;
            }
            case MusicButtonId.STOP: {
                stopMusicService(interaction);
                break;
            }
            case MusicButtonId.RESUME: {
                resumeMusicService(interaction);
                break;
            }
            case MusicButtonId.NO_LOOP: {
                toggleSongLoopService(interaction);
                break;
            }
            case MusicButtonId.SONG_LOOP: {
                toggleQueueLoopService(interaction);
                break;
            }
            case MusicButtonId.QUEUE_LOOP: {
                toggleDisableLoopService(interaction);
                break;
            }
        }
        await propagateEmbed(interaction);
        await interaction.update({
            content: ""
        })
    }
    catch(err) {
        if (err instanceof Error) await exceptionHandler(interaction, err);
    }

}

async function validateButtonController(interaction: ButtonInteraction) {
}

async function exceptionHandler(interaction: ButtonInteraction, err: Error) {
    await interaction.reply({
        content: `:warning: ${err.message}`,
        ephemeral: true
    })
}