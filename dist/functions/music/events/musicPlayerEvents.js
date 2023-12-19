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
exports.listenMusicPlayerEvent = void 0;
const __1 = require("..");
const messageService_1 = require("../service/messageService");
function listenMusicPlayerEvent(client, player) {
    player
        .on("channelEmpty", (q) => __awaiter(this, void 0, void 0, function* () {
        yield propagateMusicEmbed(q);
    }))
        .on("songAdd", (q) => { })
        .on("playlistAdd", (q) => { })
        .on("queueDestroyed", (q) => __awaiter(this, void 0, void 0, function* () {
        yield propagateMusicEmbed(q);
    }))
        .on("queueEnd", (q) => __awaiter(this, void 0, void 0, function* () {
        yield propagateMusicEmbed(q);
    }))
        .on("songChanged", (q, newSong, oldSong) => __awaiter(this, void 0, void 0, function* () {
        yield propagateMusicEmbed(q);
    }))
        .on("songFirst", (q) => { })
        .on("clientDisconnect", (q) => __awaiter(this, void 0, void 0, function* () {
        yield propagateMusicEmbed(q);
    }))
        .on("error", (err, q) => {
    });
}
exports.listenMusicPlayerEvent = listenMusicPlayerEvent;
function propagateMusicEmbed(queue) {
    return __awaiter(this, void 0, void 0, function* () {
        const { samtaegiChannelId } = (0, __1.getSamtaegiEmbedMemory)(queue.guild.id);
        const channel = (yield queue.guild.channels.fetch(samtaegiChannelId));
        yield (0, messageService_1.updateMusicEmbed)(channel.messages, {
            queue: queue,
        });
    });
}
