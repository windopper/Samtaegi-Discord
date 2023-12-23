import {
  Client,
} from "discord.js";
import { listenClientEvent } from "./events/musicClientEvents";
import { initializeSamtaegiChannels } from "./service/channelService";

export async function initializeMusicFunction(client: Client) {
  // 순서 중요
  // initializeSamtaegiChannels 함수는 채널을 cleanUp 하고 새로운 임베드 메시지를 생성하고
  // listenClientEvent 함수는 삼태기 메시지와 채널이 삭제될 때 삼태기 채널을 다시 초기화 하는 listen 콜백을 생성함
  // 순서가 바뀌면 채널을 cleanUp 할 때 listen 콜백이 작동해서 채널이 여러개 생성됨
  await initializeSamtaegiChannels(client);
  await listenClientEvent(client);
}