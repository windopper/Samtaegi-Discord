import {
  Client,
  Collection,
  EmbedBuilder,
  Guild,
  GuildMessageManager,
  Message,
  TextChannel,
} from "discord.js";
import {
  GuildSchema,
  SamtaegiEmbedAndChannelSchema,
  getGuildsData,
  saveGuildsData,
} from "../../db";
import { updateMusicEmbed } from "./service/messageService";
import { getOrCreateQueue } from "../../api/music";
import { Player } from "discord-music-player";
import { listenClientEvent } from "./events/musicClientEvents";

type GuildId = string;

export const samtaegiEmbedMemory = new Collection<
  GuildId,
  SamtaegiEmbedAndChannelSchema
>();

export function getSamtaegiEmbedMemory(guildId: string) {
  const value = samtaegiEmbedMemory.get(guildId);
  if (value) return value;
  throw new Error("no guildId in memory");
}

export async function initializeMusicFunction(client: Client) {
  // 순서 중요
  // initializeSamtaegiChannels 함수는 채널을 cleanUp 하고 새로운 임베드 메시지를 생성하고
  // listenClientEvent 함수는 삼태기 메시지와 채널이 삭제될 때 삼태기 채널을 다시 초기화 하는 listen 콜백을 생성함
  // 순서가 바뀌면 채널을 cleanUp 할 때 listen 콜백이 작동해서 채널이 여러개 생성됨
  await initializeSamtaegiChannels(client);
  await listenClientEvent(client);
}

export async function initializeSamtaegiChannels(client: Client) {
  loadSamtaegiEmbedMemory();
  const promises = client.guilds.cache.map(async (g, k) => {
    await initializeSamtaegiChannel(client, g);
  });

  await Promise.all(promises);
  saveSamtaegiEmbedMemory();
}

export async function initializeSamtaegiChannel(
  client: Client,
  guild: Guild
) {
  await createSamtaegiChannelIfNotExist(client, guild);
  await clearChannel(client, guild);
  await generateNewEmbed(client, guild);
}

function loadSamtaegiEmbedMemory() {
  const guildsData = getGuildsData();
  for (const key of Object.keys(guildsData)) {
    const { samtaegiChannelId, samtaegiEmbedId } = guildsData[key];
    samtaegiEmbedMemory.set(key, {
      samtaegiChannelId,
      samtaegiEmbedId,
    });
  }
}

async function createSamtaegiChannelIfNotExist(client: Client, guild: Guild) {
  // db에 길드 id가 없다면
  if (!samtaegiEmbedMemory.get(guild.id)) {
    await createSamtaegiChannelAndSave(guild);
  } else {
    const { samtaegiChannelId } = getSamtaegiEmbedMemory(guild.id)
    // 길드에 삼태기 채널이 없다면

    try {
      await guild.channels.fetch(samtaegiChannelId)
    }
    catch (err) {
      await createSamtaegiChannelAndSave(guild);
    }
  }
}

async function createSamtaegiChannelAndSave(guild: Guild) {
  const channel = await guild.channels.create({
    name: "삼태기 메들리 ♬",
  });

  // const embed = createEmbed();
  // const message = await channel.send({ embeds: [embed] });

  samtaegiEmbedMemory.set(guild.id, {
    samtaegiChannelId: channel.id,
    samtaegiEmbedId: "",
  });
}

async function clearChannel(client: Client, guild: Guild) {
  const { samtaegiChannelId } = getSamtaegiEmbedMemory(guild.id);

  const channel = (await client.channels.fetch(
    samtaegiChannelId
  )) as TextChannel;

  if (!channel) return;

  let fetched: Collection<string, Message<true>>;
  do {
    fetched = await channel.messages.fetch({
      limit: 100,
    });
    await channel.bulkDelete(fetched);
  } while (fetched.size >= 2);
}

async function generateNewEmbed(client: Client, guild: Guild) {
  const { samtaegiChannelId } = getSamtaegiEmbedMemory(guild.id);
  const guildId = guild.id;

  const textChannel = await client.channels.fetch(samtaegiChannelId);
  if (!(textChannel instanceof TextChannel)) return;

  let message: Message<true>;
  const embed = createEmbed();

  message = await textChannel.send({
    embeds: [embed],
  });
  samtaegiEmbedMemory.set(guildId, {
    samtaegiChannelId: samtaegiChannelId,
    samtaegiEmbedId: message.id,
  });

  // try {
  //   // 저장된 임베드 아이디로 메시지 가져옴
  //   // 있으면 수정하고 없으면 새로 만듬
  //   message = await textChannel.messages.fetch(samtaegiEmbedId);
  //   await message.edit({
  //     embeds: [embed],
  //   });
  // } catch (err) {

  // }

  const guildQueue = getOrCreateQueue(guildId);
  await updateMusicEmbed(message.channel.messages as GuildMessageManager, {
    queue: guildQueue,
  });
}

export async function saveSamtaegiEmbedMemory() {
  let data: GuildSchema = {};
  samtaegiEmbedMemory.forEach((v, k) => {
    data = {
      ...data,
      [k]: v,
    };
  });
  saveGuildsData(data);
}

function createEmbed() {
  let description = "";
  description += "로딩 중...";
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setDescription(description);
  return embed;
}
