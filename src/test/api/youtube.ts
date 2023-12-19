import { getYoutubeMusic, parseLinks } from "../../api/youtube";

getYoutubeMusic("pikasonic의 shine").then(v => JSON.stringify(console.log(parseLinks(v))))