import { SamtaegiError } from "./samtaegi";

type MusicErrorName = 'UNKNOWN_ERROR'
    | 'NO_MUSIC_FOUND_ERROR'
    | 'NO_QUEUE_CONNECTION'
    ;

export class MusicError extends SamtaegiError<MusicErrorName> {
    static getDefault(name: MusicErrorName): MusicError {
        const channelError = new MusicError({
            name: "NO_MUSIC_FOUND_ERROR",
            message: ""
        })
        switch (name) {
            case "NO_MUSIC_FOUND_ERROR": {
                channelError.message = "음악을 찾을 수 없습니다"
                break;
            }
            case "UNKNOWN_ERROR": {
                channelError.message = "알 수 없는 오류가 발생했습니다"
                break;
            }
            case "NO_QUEUE_CONNECTION": {
                channelError.message = "음성 채널에 연결해야 합니다"
                break;
            }
        }
        return channelError;
    }
}