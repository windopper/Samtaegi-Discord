import { initializeInfo } from "./info";
import { initializeMusicTools } from "./music";
import chalk from 'chalk';

export enum Tools {
  INFO_SHOW = "information_show",
  VOICE_CONNECT_CHANNEL = "voice_connect_channel",
  VOICE_DISCONNECT_CHANNEL = "voice_disconnect_channel",
  MUSIC_PLAY = "music_play",
  MUSIC_RESUME = "music_resume",
  MUSIC_PAUSE = "music_pause",
  MUSIC_LIST = "music_list",
  MUSIC_SKIP = "music_skip",
  MUSIC_STOP = "music_stop",
  MUSIC_REMOVE_LOOP = "music_remove_loop",
  MUSIC_TOGGLE_SONG_LOOP = "music_toggle_song_loop",
  MUSIC_TOGGLE_QUEUE_LOOP = "music_toggle_queue_loop",
  MUSIC_CLEAR_QUEUE = "music_clear_queue",
  MUSIC_SHUFFLE = "music_shuffle",
}

let tools: any[] = [];
let availableFunctions: any = {};

export function initializeTools() {
  console.log(chalk.blue("Initialize Tools..."))
  initializeMusicTools();
  initializeInfo();
}

export function registerTools(generatedToolSchema: any, fn: any, proxyHandler?: any) {
  tools = [...tools, generatedToolSchema]
  availableFunctions[generatedToolSchema.function.name] = proxyHandler ? new Proxy(fn, proxyHandler) : fn
  console.log(chalk.bgCyan(chalk.black("Tools")), chalk.cyan(generatedToolSchema.function.name))
}

export function getTools() {
  return tools;
}

export function getAvailableFunctions() {
  return availableFunctions;
}


