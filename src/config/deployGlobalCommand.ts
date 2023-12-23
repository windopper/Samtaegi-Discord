import 'dotenv/config'
import { REST, Routes } from "discord.js";
import samtaegi from "../commands/music/samtaegi";
import init from '../commands/music/init';

const { token, clientId } = process.env

const commands = [];
const rest = new REST().setToken(token as string);

(async () => {
    commands.push(samtaegi.data, init.data);
    await rest.put(
        Routes.applicationCommands(clientId as string),
        { 
            body: commands
        }
    )
})()


