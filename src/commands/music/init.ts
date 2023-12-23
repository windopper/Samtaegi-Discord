import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { checkHasSamtaegiChannel, initializeSamtaegiChannel } from "../../functions/music/service/channelService";
import { ChannelError } from "../../errors/channel";

export default {
    data: new SlashCommandBuilder()
        .setName("init").setNameLocalization("ko", "초기화")
        .setDescription("initialize samtaegi channel").setDescriptionLocalization("ko", "삼태기 채널을 초기화 합니다"),
    async execute(interaction: ChatInputCommandInteraction) {
        const guild = interaction.guild;
        if (!guild) throw ChannelError.getDefault("NO_GUILD_ERROR");
        let channel = await checkHasSamtaegiChannel(guild);
        if (channel) {
            await interaction.editReply({
                content: `삼태기 채널이 이미 존재합니다 <#${channel.id}>`
            })
        }
        else {
            channel = await initializeSamtaegiChannel(guild);
            if (!channel) return;
            await interaction.editReply({
                content: `삼태기 채널을 초기화 하였습니다 <#${channel.id}>`
            })
        }
    }
}