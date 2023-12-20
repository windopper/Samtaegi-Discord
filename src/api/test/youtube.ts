import { testYoutubeLink } from "../youtube";

import ytdl from 'ytdl-core';

ytdl.getInfo("https://www.youtube.com/watch?v=-o7X4W-wQbo").then(console.log)

