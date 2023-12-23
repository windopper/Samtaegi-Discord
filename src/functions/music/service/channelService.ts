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
} from "../../../db";
import { updateMusicEmbed } from "./messageService";
import { getOrCreateQueue } from "../../../api/music";

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

export async function initializeSamtaegiChannels(client: Client) {
  loadSamtaegiEmbedMemory();
  const promises = client.guilds.cache.map(async (g, k) => {
    await initializeSamtaegiChannel(g);
  });

  await Promise.all(promises);
  saveSamtaegiEmbedMemory();
}

export async function initializeSamtaegiChannel(guild: Guild) {
  const channel = await createSamtaegiChannelIfNotExist(guild);
  await clearChannel(guild);
  await generateNewEmbed(guild);
  return channel;
}

export async function checkHasSamtaegiChannel(guild: Guild) {
  const memory = samtaegiEmbedMemory.get(guild.id);
  if (memory) {
    const { samtaegiChannelId } = memory;
    const channel = guild.channels.cache.get(guild.id)
    if (channel) return channel;
  }
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

async function createSamtaegiChannelIfNotExist(guild: Guild) {
  // db에 길드 id가 없다면
  if (!samtaegiEmbedMemory.get(guild.id)) {
    return await createSamtaegiChannelAndSave(guild);
  } else {
    const { samtaegiChannelId } = getSamtaegiEmbedMemory(guild.id);
    // 길드에 삼태기 채널이 없다면

    try {
      await guild.channels.fetch(samtaegiChannelId);
    } catch (err) {
      return await createSamtaegiChannelAndSave(guild);
    }
  }
}

async function createSamtaegiChannelAndSave(guild: Guild) {
  const channel = await guild.channels.create({
    name: "삼태기 메들리 ♬",
  });
  samtaegiEmbedMemory.set(guild.id, {
    samtaegiChannelId: channel.id,
    samtaegiEmbedId: "",
  });
  return channel;
}

async function clearChannel(guild: Guild) {
  const { samtaegiChannelId } = getSamtaegiEmbedMemory(guild.id);
  const channel = (await guild.channels.fetch(
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

async function generateNewEmbed(guild: Guild) {
  const { samtaegiChannelId } = getSamtaegiEmbedMemory(guild.id);
  const guildId = guild.id;

  const textChannel = await guild.channels.fetch(samtaegiChannelId);
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

  const guildQueue = getOrCreateQueue(guildId);
  await updateMusicEmbed(message.channel.messages as GuildMessageManager, {
    queue: guildQueue,
  });
}

export function saveSamtaegiEmbedMemory() {
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
