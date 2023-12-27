import { SamtaegiError } from "./samtaegi";

export enum MusicErrorType {
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
    NO_MUSIC_FOUND_ERROR = "NO_MUSIC_FOUND_ERROR",
    NO_QUEUE_CONNECTION = "NO_QUEUE_CONNECTION"
}

export const MusicErrorMessages = {
    "UNKNOWN_ERROR": "알 수 없는 오류가 발생했습니다",
    "NO_MUSIC_FOUND_ERROR": "음악을 찾을 수 없습니다",
    "NO_QUEUE_CONNECTION": "음성 채널에 연결해야 합니다"
}

export class MusicError extends SamtaegiError<MusicErrorType> {
    constructor(type: MusicErrorType) {
        super({
            name: type,
            message: MusicErrorMessages[type]
        })
    }
}