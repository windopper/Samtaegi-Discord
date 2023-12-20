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
exports.propagateEmbed = void 0;
const messageService_1 = require("./messageService");
const music_1 = require("../../../api/music");
const __1 = require("..");
function propagateEmbed(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!interaction.guildId || !interaction.guild)
            return;
        const { samtaegiChannelId } = (0, __1.getSamtaegiEmbedMemory)(interaction.guildId);
        const textChannel = yield interaction.guild.channels.fetch(samtaegiChannelId);
        yield (0, messageService_1.updateMusicEmbed)(textChannel.messages, {
            queue: (0, music_1.getOrCreateQueue)(interaction.guildId)
        });
    });
}
exports.propagateEmbed = propagateEmbed;
