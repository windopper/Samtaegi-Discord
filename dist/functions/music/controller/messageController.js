"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.musicMessageController = void 0;
const __1 = require("..");
const messageService_1 = require("../service/messageService");
const channel_1 = require("../../../errors/channel");
function musicMessageController(message) {
    return __awaiter(this, void 0, void 0, function* () {
        let isInSamtaegiChannel = false;
        try {
            validateController(message);
            isInSamtaegiChannel = true;
            yield (0, messageService_1.playMusicService)(message);
        }
        catch (err) {
            if (err instanceof Error)
                yield musicExceptionHandler(message, err, isInSamtaegiChannel);
        }
        finally {
            if (isInSamtaegiChannel)
                yield (0, messageService_1.deleteLastMessage)(message);
        }
    });
}
exports.musicMessageController = musicMessageController;
function validateController(message) {
    validateInGuild(message);
    validateGuildInMusicEmbedMemory(message.guildId);
    const { samtaegiChannelId, samtaegiEmbedId } = __1.samtaegiEmbedMemory.get(message.guildId);
    validateChannelInMusicEmbedMemory(message, samtaegiChannelId);
}
function validateInGuild(message) {
    if (message.inGuild())
        return;
    throw new Error("");
}
function validateGuildInMusicEmbedMemory(guildId) {
    if (__1.samtaegiEmbedMemory.has(guildId))
        return;
    throw new Error("");
}
function validateChannelInMusicEmbedMemory(message, channelId) {
    if (message.channelId !== channelId) {
        throw channel_1.ChannelError.getDefault("INVALID_GUILD_CHANNEL_ERROR");
    }
}
function musicExceptionHandler(message, err, isInSamtaegiChannel) {
    return __awaiter(this, void 0, void 0, function* () {
        if (isInSamtaegiChannel) {
            const replyMessage = yield message.reply(`<@${message.author.id}> ` + err.message);
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield replyMessage.delete();
            }), 5000);
        }
    });
}
