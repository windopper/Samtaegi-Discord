import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import { getOrCreateQueue, showMusicListApi } from "../../api/music/music";

export default {
    data: new SlashCommandBuilder().setName("queue").setNameLocalization("ko", "큐")
        .setDescription("show current queue").setDescriptionLocalization("ko", "현재 큐를 보여줍니다"),

    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const musics = showMusicListApi(interaction.guildId);
        const guildQueue = getOrCreateQueue(interaction.guildId);

        const currentPlaying = guildQueue.nowPlaying;
        const repeatMode = guildQueue.repeatMode;
        const isPlaying = guildQueue.isPlaying;
        const progressBar = guildQueue.createProgressBar();

        let content = ""
        content += `${currentPlaying ? `현재 **${currentPlaying.name}** 재생 중` : `현재 재생 중인 음악이 없습니다`}`
        content += `\n${progressBar.prettier.trimStart()}`
        content += `\n다음 노래`
        content += `\n`

        musics.forEach(v => {
            content += `- ${v.name}\n`
        })

        await interaction.editReply({
            content: content,
        })
    }
}