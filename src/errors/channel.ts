import { SamtaegiError } from "./samtaegi";

export enum ChannelErrorType {
    NO_GUILD_ERROR = "NO_GUILD_ERROR",
    NO_VOICE_CHANNEL_ERROR = "NO_VOICE_CHANNEL_ERROR",
    INVALID_GUILD_CHANNEL_ERROR = "INVALID_GUILD_CHANNEL_ERROR",
}

export const ChannelErrorMessages = {
    "NO_GUILD_ERROR": "서버 채널이 없습니다",
    "NO_VOICE_CHANNEL_ERROR": "접속된 음성 채널이 없습니다",
    "INVALID_GUILD_CHANNEL_ERROR": "알 수 없는 길드 채널입니다"
}

export class ChannelError extends SamtaegiError<ChannelErrorType> {
    constructor(type: ChannelErrorType) {
        super({
            name: type,
            message: ChannelErrorMessages[type],
        })
    }
}