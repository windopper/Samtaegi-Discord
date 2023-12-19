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
exports.saveSamtaegiEmbedMemory = exports.initializeSamtaegiChannel = exports.initializeSamtaegiChannels = exports.initializeMusicFunction = exports.getSamtaegiEmbedMemory = exports.samtaegiEmbedMemory = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../db");
const messageService_1 = require("./service/messageService");
const music_1 = require("../../api/music");
const musicClientEvents_1 = require("./events/musicClientEvents");
exports.samtaegiEmbedMemory = new discord_js_1.Collection();
function getSamtaegiEmbedMemory(guildId) {
    const value = exports.samtaegiEmbedMemory.get(guildId);
    if (value)
        return value;
    throw new Error("no guildId in memory");
}
exports.getSamtaegiEmbedMemory = getSamtaegiEmbedMemory;
function initializeMusicFunction(client) {
    return __awaiter(this, void 0, void 0, function* () {
        // 순서 중요
        // initializeSamtaegiChannels 함수는 채널을 cleanUp 하고 새로운 임베드 메시지를 생성하고
        // listenClientEvent 함수는 삼태기 메시지와 채널이 삭제될 때 삼태기 채널을 다시 초기화 하는 listen 콜백을 생성함
        // 순서가 바뀌면 채널을 cleanUp 할 때 listen 콜백이 작동해서 채널이 여러개 생성됨
        yield initializeSamtaegiChannels(client);
        yield (0, musicClientEvents_1.listenClientEvent)(client);
    });
}
exports.initializeMusicFunction = initializeMusicFunction;
function initializeSamtaegiChannels(client) {
    return __awaiter(this, void 0, void 0, function* () {
        loadSamtaegiEmbedMemory();
        const promises = client.guilds.cache.map((g, k) => __awaiter(this, void 0, void 0, function* () {
            yield initializeSamtaegiChannel(client, g);
        }));
        yield Promise.all(promises);
        saveSamtaegiEmbedMemory();
    });
}
exports.initializeSamtaegiChannels = initializeSamtaegiChannels;
function initializeSamtaegiChannel(client, guild) {
    return __awaiter(this, void 0, void 0, function* () {
        yield createSamtaegiChannelIfNotExist(client, guild);
        yield clearChannel(client, guild);
        yield generateNewEmbed(client, guild);
    });
}
exports.initializeSamtaegiChannel = initializeSamtaegiChannel;
function loadSamtaegiEmbedMemory() {
    const guildsData = (0, db_1.getGuildsData)();
    for (const key of Object.keys(guildsData)) {
        const { samtaegiChannelId, samtaegiEmbedId } = guildsData[key];
        exports.samtaegiEmbedMemory.set(key, {
            samtaegiChannelId,
            samtaegiEmbedId,
        });
    }
}
function createSamtaegiChannelIfNotExist(client, guild) {
    return __awaiter(this, void 0, void 0, function* () {
        // db에 길드 id가 없다면
        if (!exports.samtaegiEmbedMemory.get(guild.id)) {
            yield createSamtaegiChannelAndSave(guild);
        }
        else {
            const { samtaegiChannelId } = getSamtaegiEmbedMemory(guild.id);
            // 길드에 삼태기 채널이 없다면
            try {
                yield guild.channels.fetch(samtaegiChannelId);
            }
            catch (err) {
                yield createSamtaegiChannelAndSave(guild);
            }
        }
    });
}
function createSamtaegiChannelAndSave(guild) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = yield guild.channels.create({
            name: "삼태기 메들리 ♬",
        });
        // const embed = createEmbed();
        // const message = await channel.send({ embeds: [embed] });
        exports.samtaegiEmbedMemory.set(guild.id, {
            samtaegiChannelId: channel.id,
            samtaegiEmbedId: "",
        });
    });
}
function clearChannel(client, guild) {
    return __awaiter(this, void 0, void 0, function* () {
        const { samtaegiChannelId } = getSamtaegiEmbedMemory(guild.id);
        const channel = (yield client.channels.fetch(samtaegiChannelId));
        if (!channel)
            return;
        let fetched;
        do {
            fetched = yield channel.messages.fetch({
                limit: 100,
            });
            yield channel.bulkDelete(fetched);
        } while (fetched.size >= 2);
    });
}
function generateNewEmbed(client, guild) {
    return __awaiter(this, void 0, void 0, function* () {
        const { samtaegiChannelId } = getSamtaegiEmbedMemory(guild.id);
        const guildId = guild.id;
        const textChannel = yield client.channels.fetch(samtaegiChannelId);
        if (!(textChannel instanceof discord_js_1.TextChannel))
            return;
        let message;
        const embed = createEmbed();
        message = yield textChannel.send({
            embeds: [embed],
        });
        exports.samtaegiEmbedMemory.set(guildId, {
            samtaegiChannelId: samtaegiChannelId,
            samtaegiEmbedId: message.id,
        });
        // try {
        //   // 저장된 임베드 아이디로 메시지 가져옴
        //   // 있으면 수정하고 없으면 새로 만듬
        //   message = await textChannel.messages.fetch(samtaegiEmbedId);
        //   await message.edit({
        //     embeds: [embed],
        //   });
        // } catch (err) {
        // }
        const guildQueue = (0, music_1.getOrCreateQueue)(guildId);
        yield (0, messageService_1.updateMusicEmbed)(message.channel.messages, {
            queue: guildQueue,
        });
    });
}
function saveSamtaegiEmbedMemory() {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {};
        exports.samtaegiEmbedMemory.forEach((v, k) => {
            data = Object.assign(Object.assign({}, data), { [k]: v });
        });
        (0, db_1.saveGuildsData)(data);
    });
}
exports.saveSamtaegiEmbedMemory = saveSamtaegiEmbedMemory;
function createEmbed() {
    let description = "";
    description += "로딩 중...";
    const embed = new discord_js_1.EmbedBuilder()
        .setColor(0x0099ff)
        .setDescription(description);
    return embed;
}
