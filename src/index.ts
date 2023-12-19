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
import { openAIFunctionCalling } from "./agent/agent";
import { initializeTools } from "./agent/tools";
import chalk from "chalk";
import { initializeCommands } from "./commands";
import initializeMusicPlayer from "./api/music";
import { initializeMusicFunction, initializeSamtaegiChannels } from "./functions/music";
import { musicMessageController } from "./functions/music/controller/messageController";
import { musicButtonController } from "./functions/music/controller/buttonController";
import { musicCommandController } from "./functions/music/controller/commandController";

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
  initializeTools();
  initializeCommands();
  initializeMusicFunction(client);
  console.log(chalk.green(`Ready! Logged in as ${c.user.tag}`));
  client.user?.setActivity("삼태기 메들리", { type: ActivityType.Competing });
});

client.on("messageCreate", (m) => {
  if (m.author.id === client.user?.id) return;
  if (m.inGuild()) {
    musicMessageController(m);
    //m.channel.sendTyping();

    return;
    openAIFunctionCalling(m)
      .then((r) => {
        if (r === undefined) return;
        m.reply(r[0]?.message.content || "");
      })
      .catch(console.error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton()) {
    const buttonInteraction = interaction as ButtonInteraction;
    musicButtonController(buttonInteraction);
  }
  if (interaction.isChatInputCommand()) {
    const chatInteraction = interaction as ChatInputCommandInteraction;
    musicCommandController(chatInteraction);
  }
});

client.login(token);
