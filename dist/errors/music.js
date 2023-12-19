"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicError = void 0;
const samtaegi_1 = require("./samtaegi");
class MusicError extends samtaegi_1.SamtaegiError {
    static getDefault(name) {
        const channelError = new MusicError({
            name: "NO_MUSIC_FOUND_ERROR",
            message: ""
        });
        switch (name) {
            case "NO_MUSIC_FOUND_ERROR": {
                channelError.message = "음악을 찾을 수 없습니다";
                break;
            }
            case "UNKNOWN_ERROR": {
                channelError.message = "알 수 없는 오류가 발생했습니다";
                break;
            }
            case "NO_QUEUE_CONNECTION": {
                channelError.message = "음성 채널에 연결해야 합니다";
                break;
            }
        }
        return channelError;
    }
}
exports.MusicError = MusicError;
