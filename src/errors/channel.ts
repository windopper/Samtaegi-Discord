import { SamtaegiError } from "./samtaegi";

type ChannelErrorName = 
    | "NO_GUILD_ERROR"
    | "NO_VOICE_CHANNEL_ERROR"
    | "INVALID_GUILD_CHANNEL_ERROR"

export class ChannelError extends SamtaegiError<ChannelErrorName> {
    static getDefault(name: ChannelErrorName): ChannelError {
        const channelError = new ChannelError({
            name: "NO_GUILD_ERROR",
            message: ""
        })
        switch (name) {
            case "NO_GUILD_ERROR": {
                channelError.message = "서버 채널이 없습니다"
                break;
            }
            case "NO_VOICE_CHANNEL_ERROR": {
                channelError.message = "음성 채널이 없습니다"
                break;
            }
            case "INVALID_GUILD_CHANNEL_ERROR": {
                channelError.message = ""
                break;
            }
        }
        return channelError;
    }
}