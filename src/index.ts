import {
  ActivityType,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Client,
  Events,
  GatewayIntentBits,
  Partials,
} from "discord.js";
import 'dotenv/config'
import chalk from "chalk";
import { initializeCommands } from "./commands";
import initializeMusicPlayer from "./api/music/music";
import { initializeMusicFunction } from "./functions/music";
import { musicMessageController } from "./functions/music/controller/messageController";
import { musicButtonController } from "./functions/music/controller/buttonController";
import { musicCommandController } from "./functions/music/controller/commandController";
import "./config/authorization"

const { token } = process.env;

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Channel],
});

client.once(Events.ClientReady, (c) => {
  initializeMusicPlayer(client);
  initializeCommands().catch(console.log);
  initializeMusicFunction(client);
  console.log(chalk.green(`Ready! Logged in as ${c.user.tag}`));
  client.user?.setActivity("삼태기 메들리", { type: ActivityType.Competing });
});

client.on("messageCreate", (m) => {
  musicMessageController(m).catch(console.log);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton()) {
    const buttonInteraction = interaction as ButtonInteraction;
    musicButtonController(buttonInteraction).catch(console.log);
  }
  if (interaction.isChatInputCommand()) {
    const chatInteraction = interaction as ChatInputCommandInteraction;
    musicCommandController(chatInteraction).catch(console.log);
  }
});

client.login(token);
