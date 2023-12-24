import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  InteractionEditReplyOptions,
  MessagePayload,
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
} from "../../../api/music/music";
import { updateMusicEmbed } from "./updateMusicEmbed";
import { Queue, RepeatMode, Song } from "discord-music-player";
import { connect } from "pm2";

export enum MusicButtonId {
  RESUME = "music/resume",
  PAUSE = "music/pause",
  SKIP = "music/skip",
  SHUFFLE = "music/shuffle",
  STOP = "music/stop",
  NO_LOOP = "music/no_loop",
  SONG_LOOP = "music/song_loop",
  QUEUE_LOOP = "music/queue_loop",
  QUEUE_LIST = "music/queue_list"
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

  const list = new ButtonBuilder()
    .setCustomId(MusicButtonId.QUEUE_LIST)
    .setLabel("대기열 보기")
    .setStyle(ButtonStyle.Secondary)

  let row = new ActionRowBuilder<ButtonBuilder>();
  if (paused) row = row.addComponents(play);
  else row = row.addComponents(pause);
  row = row.addComponents(skip, stop, list);

  if (repeatMode === RepeatMode.DISABLED) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(MusicButtonId.NO_LOOP)
        .setLabel("반복: 없음")
        .setStyle(ButtonStyle.Secondary)
    );
  } else if (repeatMode === RepeatMode.QUEUE) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(MusicButtonId.QUEUE_LOOP)
        .setLabel("반복: 큐")
        .setStyle(ButtonStyle.Secondary)
    );
  } else if (repeatMode === RepeatMode.SONG) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(MusicButtonId.SONG_LOOP)
        .setLabel("반복: 현재 노래")
        .setStyle(ButtonStyle.Secondary)
    );
  }

  return row;
}

export async function pauseMusicService(interaction: ButtonInteraction) {
  pauseMusicApi(interaction.guildId);
  await interactionReply("음악을 일시정지 했어요", interaction);
}

export async function resumeMusicService(interaction: ButtonInteraction) {
  resumeMusicApi(interaction.guildId);
  await interactionReply("음악을 재생했어요", interaction);
}

export async function shuffleMusicService(interaction: ButtonInteraction) {
  shuffleApi(interaction.guildId);
  await interactionReply("음악을 섞었어요", interaction);
}

export async function stopMusicService(interaction: ButtonInteraction) {
  stopMusicApi(interaction.guildId);
  await interactionReply("음악을 정지하고 모든 큐를 삭제했어요", interaction);
}

export async function skipMusicService(interaction: ButtonInteraction) {
  skipMusicApi(interaction.guildId);
  await interactionReply("음악을 스킵했어요", interaction);
}

export async function toggleSongLoopService(interaction: ButtonInteraction) {
  toggleSongLoopApi(interaction.guildId);
  await interactionReply(`재생 반복을 "현재 음악"으로 설정했어요`, interaction);
}

export async function toggleQueueLoopService(interaction: ButtonInteraction) {
  toggleQueueLoopApi(interaction.guildId);
  await interactionReply(`재생 반복을 "현재 큐"로 설정했어요`, interaction);
}

export async function toggleDisableLoopService(interaction: ButtonInteraction) {
  toggleDisableLoopApi(interaction.guildId);
  await interactionReply(`재생 반복을 "없음"으로 설정했어요`, interaction);
}

export async function showQueueList(interaction: ButtonInteraction) {
  const queue = getOrCreateQueue(interaction.guildId);
  
  const newEmbed = {
    title: "현재 대기열",
    description: getDescription(queue)
  }

  await interactionReply({
    embeds: [newEmbed]
  }, interaction, -1)

  function getDescription(queue: Queue) {
    const { songs, nowPlaying, destroyed } = queue;
    let content = `♬ 현재 재생 중인 노래 ${nowPlaying && !destroyed ? `**${nowPlaying.name}** [${songs[0].duration}]` : "없다 맨이야"} \n`
    if (songs.length > 0) {
        content += `\n현재 큐 **${songs.length - 1} 곡** \n`
        for (let i = 1; i<songs.length; i++) {
            if ((content + getMusicInfo(songs[i]) + '\n').length <= 4000) content += `${i}.` + getMusicInfo(songs[i]) + '\n'
            else {
                content += `...이하 ${songs.length - i}곡`
                break;
            }
        }
    }
    return content;
  }

  function getMusicInfo(song: Song) {
    return `${song.name} [${song.duration}]`
  }
}

export async function propagateEmbed(interaction: ButtonInteraction) {
  const channel = interaction.channel as TextChannel;
  await updateMusicEmbed(channel.messages, {
    queue: getOrCreateQueue(interaction.guildId),
  });
}

/**
 * 
 * @param content 
 * @param interaction 
 * @param timeout -1 설정시 타임아웃 없음
 */
async function interactionReply(
  content: (string | MessagePayload | InteractionEditReplyOptions),
  interaction: ButtonInteraction,
  timeout: number = 3000
) {
  if (typeof content == "string") {
    await interaction.editReply({
      embeds: [{
        description: content
      }]
    })
  }
  else {
    await interaction.editReply(content);
  }
  if (timeout !== -1) {
    setTimeout(async () => {
      await interaction.deleteReply();
    }, timeout);
  }
}
