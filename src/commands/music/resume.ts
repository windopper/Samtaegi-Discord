import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import { resumeMusicApi } from "../../api/music";

export default {
    data: new SlashCommandBuilder().setName("resume").setNameLocalization("ko", "재생")
        .setDescription("resume music").setDescriptionLocalization("ko", "일시정지를 해제합니다"),

    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const guildId = interaction.guildId;
        resumeMusicApi(guildId);
        await interaction.editReply({
            content: "일시 정지를 해제했어요"
        })
    }
}