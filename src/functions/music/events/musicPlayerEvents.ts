import { Player, Queue } from "discord-music-player";
import { Client, TextChannel } from "discord.js";
import { updateMusicEmbed } from "../service/messageService";
import { getSamtaegiEmbedMemory } from "../service/channelService";

export function listenMusicPlayerEvent(client: Client, player: Player) {
  player
    .on("channelEmpty", async (q) => {
      await propagateMusicEmbed(q);
    })
    .on("songAdd", (q) => {})
    .on("playlistAdd", (q) => {})
    .on("queueDestroyed", async (q) => {
      await propagateMusicEmbed(q);
    })
    .on("queueEnd", async (q) => {
      await propagateMusicEmbed(q);
    })
    .on("songChanged", async (q, newSong, oldSong) => {
      await propagateMusicEmbed(q);
    })
    .on("songFirst", (q) => {})
    .on("clientDisconnect", async (q) => {
      await propagateMusicEmbed(q);
    })
    .on("error", (err, q) => {
    });
}

async function propagateMusicEmbed(queue: Queue) {
  const { samtaegiChannelId } = getSamtaegiEmbedMemory(queue.guild.id);
  const channel = (await queue.guild.channels.fetch(
    samtaegiChannelId
  )) as TextChannel;
  await updateMusicEmbed(channel.messages, {
    queue: queue,
  });
}
