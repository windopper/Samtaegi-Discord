import { Message } from "discord.js";
import { samtaegiEmbedMemory } from "..";
import { deleteLastMessage, playMusicService } from "../service/messageService";
import { SamtaegiEmbedAndChannelSchema } from "../../../db";
import { client } from "../../..";
import { ChannelError } from "../../../errors/channel";
import logger from "../../../logger";
import { SamtaegiError } from "../../../errors/samtaegi";

export async function musicMessageController(message: Message<boolean>) {
    try {
        if (!validateController(message)) return;
        logger.info(getLoggerPrefix(message) + ` ${message.content}`)
        await playMusicService(message)    
    }
    catch (err) {
        if (err instanceof Error) await musicExceptionHandler(message, err);
    }
    await deleteLastMessage(message);
}

function validateController(message: Message<boolean>) {
    const { samtaegiChannelId } = samtaegiEmbedMemory.get(message.guildId as string) as SamtaegiEmbedAndChannelSchema;
    return validateDifferentAuthor(message) &&
        validateInGuild(message) &&
        validateGuildInMusicEmbedMemory(message.guildId as string) &&
        validateChannelInMusicEmbedMemory(message, samtaegiChannelId);
}

function validateDifferentAuthor(message: Message<boolean>) {
    if (message.author.id !== client.user?.id) return true;
    return false;
}

function validateInGuild(message: Message<boolean>) {
    if (message.inGuild()) return true;
    return false;
}

function validateGuildInMusicEmbedMemory(guildId: string) {
    if (samtaegiEmbedMemory.has(guildId)) return true;
    return false;
}

function validateChannelInMusicEmbedMemory(message: Message<boolean>, channelId: string) {
    if (message.channelId === channelId) return true;
    return false;
}

async function musicExceptionHandler(message: Message<boolean>, err: Error) {
    const replyMessage = await message.reply(`<@${message.author.id}> ` + err.message)
    setTimeout(async () => {
        await replyMessage.delete();
    }, 5000);
    if (err instanceof SamtaegiError) {
        logger.warn(getLoggerPrefix(message) + ` err: ${err}`)
    }
    else {
        logger.error(getLoggerPrefix(message) + ` content: ${message.content} err: ${err}`)
    }
}

function getLoggerPrefix(message: Message<boolean>) {
    return `message_playmusic / user: ${message.author.username}[${message.author.id}]`
}