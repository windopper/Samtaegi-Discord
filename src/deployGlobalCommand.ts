import 'dotenv/config'
import { REST, Routes } from "discord.js";
import samtaegi from "./commands/music/samtaegi";

const { token, clientId } = process.env

const commands = [];
const rest = new REST().setToken(token as string);

(async () => {
    const { data } = samtaegi;
    commands.push(data);
    await rest.put(
        Routes.applicationCommands(clientId as string),
        { 
            body: commands
        }
    )
})()


