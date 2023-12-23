import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import { playMusicApi, resumeMusicApi } from "../../api/music";
import { ChannelError } from "../../errors/channel";

export default {
    data: new SlashCommandBuilder().setName("samtaegi").setNameLocalization("ko", "삼태기")
        .setDescription("신나는 삼태기 메들리"),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const userId = interaction.member?.user.id as string
        const member = interaction.guild?.members.cache.get(userId);
        const guildId = interaction.guildId;
        const channelId = member?.voice.channelId;
        if (!guildId) throw ChannelError.getDefault("NO_GUILD_ERROR")
        if (!channelId) throw ChannelError.getDefault("NO_VOICE_CHANNEL_ERROR")
        
        const song = await playMusicApi("https://www.youtube.com/watch?v=zEYpydNwgDc&t=1s", guildId, channelId);
        await interaction.editReply({
            content: `${song.name} 노래 큐에 등록 완료!`
        })
    }
}