import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  TextChannel,
} from "discord.js";
import {
  getOrCreateQueue,
  pauseMusicApi,
  resumeMusicApi,
  shuffleApi,
  skipMusicApi,
  stopMusicApi,
  toggleDisableLoopApi,
  toggleQueueLoopApi,
  toggleSongLoopApi,
} from "../../../api/music";
import { updateMusicEmbed } from "./messageService";
import { RepeatMode } from "discord-music-player";

export enum MusicButtonId {
  RESUME = "music/resume",
  PAUSE = "music/pause",
  SKIP = "music/skip",
  SHUFFLE = "music/shuffle",
  STOP = "music/stop",
  NO_LOOP = "music/no_loop",
  SONG_LOOP = "music/song_loop",
  QUEUE_LOOP = "musig/queue_loop",
}

export function createButtonAction(paused: boolean, repeatMode: RepeatMode) {
  const pause = new ButtonBuilder()
    .setCustomId(MusicButtonId.PAUSE)
    .setLabel("일시정지")
    .setStyle(ButtonStyle.Secondary);

  const play = new ButtonBuilder()
    .setCustomId(MusicButtonId.RESUME)
    .setLabel("재생")
    .setStyle(ButtonStyle.Secondary);

  const skip = new ButtonBuilder()
    .setCustomId(MusicButtonId.SKIP)
    .setLabel("스킵")
    .setStyle(ButtonStyle.Primary);

  const shuffle = new ButtonBuilder()
    .setCustomId(MusicButtonId.SHUFFLE)
    .setLabel("셔플")
    .setStyle(ButtonStyle.Primary);

  const stop = new ButtonBuilder()
    .setCustomId(MusicButtonId.STOP)
    .setLabel("중지")
    .setStyle(ButtonStyle.Danger);

  let row = new ActionRowBuilder<ButtonBuilder>();
  if (paused) row = row.addComponents(play);
  else row = row.addComponents(pause);
  row = row.addComponents(skip, shuffle, stop);

  if (repeatMode === RepeatMode.DISABLED) {
    row.addComponents(new ButtonBuilder().setCustomId(MusicButtonId.NO_LOOP)
    .setLabel("반복: 없음")
    .setStyle(ButtonStyle.Secondary))
  }
  else if (repeatMode === RepeatMode.QUEUE) {
    row.addComponents(new ButtonBuilder().setCustomId(MusicButtonId.QUEUE_LOOP)
    .setLabel("반복: 큐")
    .setStyle(ButtonStyle.Secondary))
  }
  else if (repeatMode === RepeatMode.SONG) {
    row.addComponents(new ButtonBuilder().setCustomId(MusicButtonId.SONG_LOOP)
    .setLabel("반복: 현재 노래")
    .setStyle(ButtonStyle.Secondary))
  }

  return row;
}

export function pauseMusicService(interaction: ButtonInteraction) {
  pauseMusicApi(interaction.guildId);
}

export function resumeMusicService(interaction: ButtonInteraction) {
  resumeMusicApi(interaction.guildId);
}

export function shuffleMusicService(interaction: ButtonInteraction) {
  shuffleApi(interaction.guildId);
}

export function stopMusicService(interaction: ButtonInteraction) {
  stopMusicApi(interaction.guildId);
}

export function skipMusicService(interaction: ButtonInteraction) {
  skipMusicApi(interaction.guildId);
}

export function toggleSongLoopService(interaction: ButtonInteraction) {
    toggleSongLoopApi(interaction.guildId);
}

export function toggleQueueLoopService(interaction: ButtonInteraction) {
    toggleQueueLoopApi(interaction.guildId);
}

export function toggleDisableLoopService(interaction: ButtonInteraction) {
    toggleDisableLoopApi(interaction.guildId);
}

export async function propagateEmbed(interaction: ButtonInteraction) {
  const channel = interaction.channel as TextChannel;
  await updateMusicEmbed(channel.messages, {
    queue: getOrCreateQueue(interaction.guildId),
  });
}
