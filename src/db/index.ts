import { Client, Guild, GuildManager } from "discord.js";
import fs from "fs";
import yaml from "yaml";

export interface GuildSchema {
  [guildId: string]: SamtaegiEmbedAndChannelSchema;
}

export interface SamtaegiEmbedAndChannelSchema {
  samtaegiEmbedId: string;
  samtaegiChannelId: string;
}

export function getGuildsData(): GuildSchema {
  const file = fs.readFileSync("src/db/file.yml", "utf-8");
  return yaml.parse(file) || {};
}

export function saveGuildsData(data: GuildSchema) {
  fs.writeFileSync("src/db/file.yml", yaml.stringify(data), "utf-8");
}
