import { Playlist, Song } from "discord-music-player";
import { MusicAPI, getOrCreateQueue, playMusicApi } from "../../../api/music/music";
import { ChannelError, ChannelErrorType } from "../../../errors/channel";
import { APIEmbed, ButtonBuilder, EmbedBuilder, GuildMessageManager, JSONEncodable, Message } from "discord.js";
import { updateMusicEmbed } from "./updateMusicEmbed";

export async function playMusicService(message: Message<boolean>) {
    const input = message.content;
    const guildId = message.guildId;
    const voiceChannelId = message.member?.voice.channelId;
    if (!guildId) throw new ChannelError(ChannelErrorType.NO_GUILD_ERROR)
    if (!voiceChannelId) throw new ChannelError(ChannelErrorType.NO_VOICE_CHANNEL_ERROR)

    const info = await playMusicApi(input, guildId, voiceChannelId, message.author);
    const guildQueue = getOrCreateQueue(guildId)

    replySuccess(info, message);
    await updateMusicEmbed(message.channel.messages as GuildMessageManager, {
      queue: guildQueue,
    })
}

export async function deleteLastMessage(message: Message<boolean>) {
    await message.delete();
}

async function replySuccess(info: MusicAPI, message: Message<boolean>) {
  const MESSAGE_DELETE_DELAY = 5000;
  const YOUTUBE_IMAGE_URL = "https://i.imgur.com/YHoAhki.png"
  const SPOTIFY_IMAGE_URL = "https://i.imgur.com/RL8Y2R8.png"
  const SOUNDCLOUD_IMAGE_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzlNGorViB6Z3tcjKvimNSuyU9kh1sJIWSsoxUbQffQN1BERYP0GzXmPPLIM7jXOwIxXg&usqp=CAU"
  const { song, type } = info;

  const embed: APIEmbed = {}

  if (type === "SoundCloudPlaylist" || type === "SoundCloudTrack") {
    embed.author = {
      name: `**${song.name}** 큐에 등록했습니다`,
      icon_url: SOUNDCLOUD_IMAGE_URL
    }
  }
  else if (type === "SpotifyAlbum" ||  type === "SpotifyPlayList" || type === "SpotifyTrack") {
    embed.author = {
      name: `**${song.name}** 큐에 등록했습니다`,
      icon_url: SPOTIFY_IMAGE_URL
    }
  }
  else if (type === "YoutubeVideo" || type === "YoutubePlayList" || type === "Search") {
    embed.author = {
      name: `**${song.name}** 큐에 등록했습니다`,
      icon_url: YOUTUBE_IMAGE_URL
    }
  }

  const replied = await message.reply({
    embeds: [embed],
    options: {
      ephemeral: true
    }
  })

  setTimeout(() => {
    replied.delete().catch(e => e);
  }, MESSAGE_DELETE_DELAY);
}

