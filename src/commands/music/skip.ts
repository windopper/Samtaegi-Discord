import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import { skipMusicApi } from "../../api/music";

export default {
    data: new SlashCommandBuilder().setName("skip").setNameLocalization("ko", "스킵")
        .setDescription("skip current song").setDescriptionLocalization("ko", "현재 노래를 스킵합니다"),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const nextSong = skipMusicApi(interaction.guildId);
        let content = "스킵 완료!"
        if (nextSong) content += ` 다음 노래는 ${nextSong.name} 입니다`
        else content += ` 다음 노래는 없습니다`
        await interaction.reply({
            ephemeral: true,
            content: content
        })
    }
}