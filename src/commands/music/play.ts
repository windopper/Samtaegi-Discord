import { SlashCommandBuilder, Interaction, CacheType, ChatInputCommandInteraction, User } from "discord.js";
import { playMusicApi } from "../../api/music/music";
import { ChannelError } from "../../errors/channel";

export default {
    data: new SlashCommandBuilder()
        .setName("song").setNameLocalization("ko", "노래")
        .setDescription("play music").setDescriptionLocalization("ko", "음악을 재생 합니다")
        .addStringOption(e => 
            e.setName("input").setNameLocalization("ko", "입력").setRequired(true)
            .setDescription("url of title of music").setDescriptionLocalization("ko", "제목 혹은 유튜브 링크")
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const title = interaction.options.get("input")?.value as string;
        const userId = interaction.member?.user.id as string
        const member = interaction.guild?.members.cache.get(userId);
        const guildId = interaction.guildId;
        const channelId = member?.voice.channelId;
        if (!guildId) throw ChannelError.getDefault("NO_GUILD_ERROR")
        if (!channelId) throw ChannelError.getDefault("NO_VOICE_CHANNEL_ERROR")
        const song = await playMusicApi(title, guildId, channelId, interaction.user)
    }
}