import { Client, DMChannel, Message, NonThreadGuildBasedChannel, PartialMessage, TextChannel } from "discord.js";
import { getSamtaegiEmbedMemory, initializeSamtaegiChannel, saveSamtaegiEmbedMemory } from "..";

export async function listenClientEvent(client: Client) {
    client
    // 뮤직 임베드 메시지가 없어지면 다시 복구 하기 위해
    .on("messageDelete", async (message) => {
        restoreSamtaegiMessage(client, message);
    })
    // 삼태기 채널이 없어지면 다시 복구 하기 위해
    .on("channelDelete", (channel) => {
        restoreSamtaegiChannel(client, channel);
    })
}   

async function restoreSamtaegiMessage(client: Client, message: Message<boolean> | PartialMessage) {
    if (message.partial) message = await message.fetch();
    if (!message.guild) return;
    if (checkSamtaegiEmbedMessage(message)) {
        await initializeSamtaegiChannel(client, message.guild)
        await saveSamtaegiEmbedMemory();
    }
}

async function restoreSamtaegiChannel(client: Client, channel: DMChannel | NonThreadGuildBasedChannel) {
    if (!channel.isTextBased()) return;
    channel = channel as TextChannel
    if (checkSamtaegiChannel(channel)) {
        await initializeSamtaegiChannel(client, channel.guild)
        await saveSamtaegiEmbedMemory();
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