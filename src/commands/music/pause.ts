import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import { pauseMusicApi } from "../../api/music";

export default {
    data: new SlashCommandBuilder().setName("pause").setNameLocalization("ko", "일시정지")
        .setDescription("pause music").setDescriptionLocalization("ko", "음악을 일시정지 합니다"),

    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const guildId = interaction.guildId;
        pauseMusicApi(guildId);
        await interaction.editReply({
            content: "음악 일시정지 완료!"
        })
    }
}