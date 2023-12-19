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
exports.listenClientEvent = void 0;
const __1 = require("..");
function listenClientEvent(client) {
    return __awaiter(this, void 0, void 0, function* () {
        client
            // 뮤직 임베드 메시지가 없어지면 다시 복구 하기 위해
            .on("messageDelete", (message) => __awaiter(this, void 0, void 0, function* () {
            restoreSamtaegiMessage(client, message);
        }))
            // 삼태기 채널이 없어지면 다시 복구 하기 위해
            .on("channelDelete", (channel) => {
            restoreSamtaegiChannel(client, channel);
        });
    });
}
exports.listenClientEvent = listenClientEvent;
function restoreSamtaegiMessage(client, message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message.partial)
            message = yield message.fetch();
        if (!message.guild)
            return;
        if (checkSamtaegiEmbedMessage(message)) {
            yield (0, __1.initializeSamtaegiChannel)(client, message.guild);
            yield (0, __1.saveSamtaegiEmbedMemory)();
        }
    });
}
function restoreSamtaegiChannel(client, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!channel.isTextBased())
            return;
        channel = channel;
        if (checkSamtaegiChannel(channel)) {
            yield (0, __1.initializeSamtaegiChannel)(client, channel.guild);
            yield (0, __1.saveSamtaegiEmbedMemory)();
        }
    });
}
function checkSamtaegiEmbedMessage(message) {
    const guildId = message.guildId;
    const { samtaegiEmbedId } = (0, __1.getSamtaegiEmbedMemory)(guildId);
    return samtaegiEmbedId === message.id;
}
function checkSamtaegiChannel(channel) {
    const guildId = channel.guildId;
    const { samtaegiChannelId } = (0, __1.getSamtaegiEmbedMemory)(guildId);
    return channel.id === samtaegiChannelId;
}
