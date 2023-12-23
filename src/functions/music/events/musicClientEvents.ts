import { Client, DMChannel, Message, NonThreadGuildBasedChannel, PartialMessage, TextChannel } from "discord.js";
import { getSamtaegiEmbedMemory, initializeSamtaegiChannel, saveSamtaegiEmbedMemory } from "../service/channelService";

export async function listenClientEvent(client: Client) {
    client
    // 뮤직 임베드 메시지가 없어지면 다시 복구 하기 위해
    .on("messageDelete", async (message) => {
        restoreSamtaegiMessage(message);
    })
    // 삼태기 채널이 없어지면 다시 복구 하기 위해
    .on("channelDelete", (channel) => {
        restoreSamtaegiChannel(channel);
    })
}   

async function restoreSamtaegiMessage(message: Message<boolean> | PartialMessage) {
    if (message.partial) message = await message.fetch();
    if (!message.guild) return;
    if (checkSamtaegiEmbedMessage(message)) {
        await initializeSamtaegiChannel(message.guild)
        saveSamtaegiEmbedMemory();
    }
}

async function restoreSamtaegiChannel(channel: DMChannel | NonThreadGuildBasedChannel) {
    if (!channel.isTextBased()) return;
    channel = channel as TextChannel
    if (checkSamtaegiChannel(channel)) {
        await initializeSamtaegiChannel(channel.guild)
        saveSamtaegiEmbedMemory();
    }
}

function checkSamtaegiEmbedMessage(message: Message<boolean>) {
    const guildId = message.guildId as string;
    const { samtaegiEmbedId } = getSamtaegiEmbedMemory(guildId);
    return samtaegiEmbedId === message.id;
}

function checkSamtaegiChannel(channel: TextChannel) {
    const guildId = channel.guildId as string;
    const { samtaegiChannelId } = getSamtaegiEmbedMemory(guildId);
    return channel.id === samtaegiChannelId;
}