import { REST, Routes } from "discord.js";
import path from "node:path";
import fs from "node:fs";
import chalk from "chalk";

const commands: any[] = [];

const { token, clientId, devGuildId } = process.env

const rest = new REST().setToken(token as string);

(async () => {
  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    if (folder.endsWith(".ts")) continue;
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command: any = (await import(filePath)).default;
      if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
      } else {
        console.log(
          chalk.red(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property`
          )
        );
      }
    }
  }

  try {
    console.log(
      chalk.greenBright(
        `Started refreshing ${commands.length} application (/) commands`
      )
    );
    const data: any = await rest.put(
      Routes.applicationGuildCommands(clientId as string, devGuildId as string),
      { body: commands }
    );

    console.log(
      chalk.greenBright(
        `Successfully reloaded ${data.length} application (/) commands.`
      )
    );
  } catch (err) {
    console.error(err);
  }
})();
