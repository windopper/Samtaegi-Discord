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
exports.musicCommandController = void 0;
const commands_1 = require("../../../commands");
const commandService_1 = require("../service/commandService");
function musicCommandController(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = commands_1.commandCollection.get(interaction.commandName);
        if (!command) {
            console.error(`No command matching ${interaction.commandName}`);
            return;
        }
        try {
            yield (command === null || command === void 0 ? void 0 : command.execute(interaction));
            yield (0, commandService_1.propagateEmbed)(interaction);
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.musicCommandController = musicCommandController;
