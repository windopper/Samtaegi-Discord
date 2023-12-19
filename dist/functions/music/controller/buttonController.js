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
exports.musicButtonController = void 0;
const buttonService_1 = require("../service/buttonService");
function musicButtonController(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            switch (interaction.customId) {
                case buttonService_1.MusicButtonId.PAUSE: {
                    (0, buttonService_1.pauseMusicService)(interaction);
                    break;
                }
                case buttonService_1.MusicButtonId.SHUFFLE: {
                    (0, buttonService_1.shuffleMusicService)(interaction);
                    break;
                }
                case buttonService_1.MusicButtonId.SKIP: {
                    (0, buttonService_1.skipMusicService)(interaction);
                    break;
                }
                case buttonService_1.MusicButtonId.STOP: {
                    (0, buttonService_1.stopMusicService)(interaction);
                    break;
                }
                case buttonService_1.MusicButtonId.RESUME: {
                    (0, buttonService_1.resumeMusicService)(interaction);
                    break;
                }
                case buttonService_1.MusicButtonId.NO_LOOP: {
                    (0, buttonService_1.toggleSongLoopService)(interaction);
                    break;
                }
                case buttonService_1.MusicButtonId.SONG_LOOP: {
                    (0, buttonService_1.toggleQueueLoopService)(interaction);
                    break;
                }
                case buttonService_1.MusicButtonId.QUEUE_LOOP: {
                    (0, buttonService_1.toggleDisableLoopService)(interaction);
                    break;
                }
            }
            yield interaction.update({
                content: ""
            });
        }
        catch (err) {
            if (err instanceof Error)
                yield exceptionHandler(interaction, err);
        }
        yield (0, buttonService_1.propagateEmbed)(interaction);
    });
}
exports.musicButtonController = musicButtonController;
function exceptionHandler(interaction, err) {
    return __awaiter(this, void 0, void 0, function* () {
        yield interaction.reply({
            content: `:warning: ${err.message}`,
            ephemeral: true
        });
    });
}
