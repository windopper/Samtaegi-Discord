import { CacheType, ChatInputCommandInteraction, Collection } from "discord.js";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import Command from "./type";
import { SamtaegiError } from "../errors/samtaegi";

export const commandCollection = new Collection<string, Command>();

export async function initializeCommands() {
  console.log(chalk.blue("Initialize Commands..."));
  const foldersPath = path.join(__dirname);
  const commandFolders = fs
    .readdirSync(foldersPath)
    .filter((file) => !file.match(/\.ts$|\.js$/));

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder.toString());
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.match(/\.ts$|\.js$/));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file.toString());
      const command: Command = (await import(filePath)).default;

      if ("data" in command && "execute" in command) {
        commandCollection.set(command.data.name, command);
        console.log(
          chalk.bgCyan(chalk.black("Commands")),
          chalk.cyan(command.data.name)
        );
      } else {
        console.log(
          chalk.red(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property`
          )
        );
      }
    }
  }

  console.log(chalk.greenBright(`${commandCollection.size} commands found!`));
}
