import { Message } from "discord.js";
import { samtaegiEmbedMemory } from "..";
import { deleteLastMessage, playMusicService } from "../service/messageService";
import { SamtaegiEmbedAndChannelSchema } from "../../../db";
import { client } from "../../..";
import { ChannelError } from "../../../errors/channel";

export async function musicMessageController(message: Message<boolean>) {
    let isInSamtaegiChannel: boolean = false;

    try {
        validateController(message)
        isInSamtaegiChannel = true;
        await playMusicService(message)    
    }
    catch (err) {
        if (err instanceof Error) await musicExceptionHandler(message, err, isInSamtaegiChannel);
    }
    finally {
        if (isInSamtaegiChannel) await deleteLastMessage(message);
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
    if (message.channelId !== channelId) {
        throw ChannelError.getDefault("INVALID_GUILD_CHANNEL_ERROR");
    }
}

async function musicExceptionHandler(message: Message<boolean>, err: Error, isInSamtaegiChannel: boolean) {
    if (isInSamtaegiChannel) {
        const replyMessage = await message.reply(`<@${message.author.id}> ` + err.message)
        setTimeout(async () => {
            await replyMessage.delete();
        }, 5000);
    }
}