"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelError = void 0;
const samtaegi_1 = require("./samtaegi");
class ChannelError extends samtaegi_1.SamtaegiError {
    static getDefault(name) {
        const channelError = new ChannelError({
            name: "NO_GUILD_CHANNEL_ERROR",
            message: ""
        });
        switch (name) {
            case "NO_GUILD_CHANNEL_ERROR": {
                channelError.message = "서버 채널이 없습니다";
                break;
            }
            case "NO_VOICE_CHANNEL_ERROR": {
                channelError.message = "음성 채널이 없습니다";
                break;
            }
            case "INVALID_GUILD_CHANNEL_ERROR": {
                channelError.message = "";
                break;
            }
        }
        return channelError;
    }
}
exports.ChannelError = ChannelError;
