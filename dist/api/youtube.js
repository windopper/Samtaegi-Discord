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
exports.parseLinks = exports.getYoutubeMusic = exports.checkYoutubeLink = void 0;
const { youtubeApiKey } = process.env;
function getStringifyYoutubeMusic(title) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield getYoutubeMusic(title);
        console.log(parseLinks(data));
        return parseLinks(data);
    });
}
exports.default = getStringifyYoutubeMusic;
function checkYoutubeLink(input) {
    // 유튜브 URL 찾는 패턴
    const youtubeUrl = /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))((?!channel)(?!user)\/(?:[\w\-]+\?v=|embed\/|v\/)?)((?!channel)(?!user)[\w\-]+)(((.*(\?|\&)t=(\d+))(\D?|\S+?))|\D?|\S+?)$/;
    return youtubeUrl.test(input);
}
exports.checkYoutubeLink = checkYoutubeLink;
function getYoutubeMusic(title) {
    return __awaiter(this, void 0, void 0, function* () {
        const fetchedData = yield (yield fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${title}&maxResults=1&key=${youtubeApiKey}`)).json();
        return fetchedData;
    });
}
exports.getYoutubeMusic = getYoutubeMusic;
function parseLinks(data) {
    return {
        items: data.items.map((item) => {
            return `https://www.youtube.com/watch?v=${item.id.videoId}`;
        }),
    };
}
exports.parseLinks = parseLinks;
