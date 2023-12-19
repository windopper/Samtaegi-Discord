import { Message } from "discord.js";
import { samtaegiEmbedMemory } from "..";
import { deleteLastMessage, playMusicService } from "../service/messageService";
import { SamtaegiEmbedAndChannelSchema } from "../../../db";
import { client } from "../../..";

export async function musicMessageController(message: Message<boolean>) {
    try {
        validateController(message)
        await playMusicService(message)    
    }
    catch (err) {
        if (err instanceof Error) await musicExceptionHandler(message, err);
    }
    finally {
        await deleteLastMessage(message);
    }
}

function validateController(message: Message<boolean>) {
    validateInGuild(message);
    validateGuildInMusicEmbedMemory(message.guildId as string);
    const { samtaegiChannelId, samtaegiEmbedId } = samtaegiEmbedMemory.get(message.guildId as string) as SamtaegiEmbedAndChannelSchema;
    validateChannelInMusicEmbedMemory(message, samtaegiChannelId);
}

function validateInGuild(message: Message<boolean>) {
    if (message.inGuild()) return;
    throw new Error("");
}

function validateGuildInMusicEmbedMemory(guildId: string) {
    if (samtaegiEmbedMemory.has(guildId)) return;
    throw new Error("");
}

function validateChannelInMusicEmbedMemory(message: Message<boolean>, channelId: string) {
    if (message.channelId !== channelId) throw new Error("")
}

async function musicExceptionHandler(message: Message<boolean>, err: Error) {
    //const replyMessage = await message.reply(`<@${message.author.id}>` + " " + err.name + ": " + err.message + err.stack)
    // setTimeout(async () => {
    //     await replyMessage.delete();
    // }, 5000)
}