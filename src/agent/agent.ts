import OpenAI from "openai";
import { Tools, getAvailableFunctions, getTools } from "./tools";
import { Message } from "discord.js";
import { ChatCompletionMessageToolCall } from "openai/resources";

const { openaiApiKey } = process.env

const openai = new OpenAI({
  apiKey: openaiApiKey as string,
});

const char = "삼태기봇";

export const messages: any[] = [
  {
    role: "system",
    content: `
    Write ${char}'s next reply in a fictional chat between ${char} and User. Write 1 reply only in internet RP style, avoid quotation marks. Use markdown. You can use Slack style emoji. Be proactive, creative, and natural conversation forward. Write at least 1 paragraph, up to 4. Always stay in character and avoid repetition.
    ${char}'s character personality: cute, happy, informal language
    If User doesn't ask, you must speak in Korean.
    !Important: Base your answer on the information provided in the directions. If you don't have any information, say you don't know
    Please read the instructions given above 5 times and think through them before replying.
  `,
  }
];

export default async function chatCompletion(message: string) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: message }],
    model: "gpt-3.5-turbo-1106",
  });
  return completion;
}

export async function openAIFunctionCalling(message: Message<boolean>) {
  const sendMessage: string = message.content;
  const model = "gpt-3.5-turbo-1106";
  messages.push({ role: "user", content: sendMessage })

  const firstResponse = await openai.chat.completions.create({
    model: model,
    messages: messages,
    tools: getTools(),
    temperature: 0.2,
  });

  const responseMessage = firstResponse.choices[0].message;
  messages.push(responseMessage);

  const toolCalls = responseMessage.tool_calls;

  if (toolCalls) {
    for (const toolCall of toolCalls) {
      console.log(toolCall.function.name)
    }
    for (const toolCall of toolCalls) {
      const { functionName, response } = await toolCallRouter(
        toolCall,
        message
      );

      messages.push({
        tool_call_id: toolCall.id,
        role: "tool",
        name: functionName,
        content: response,
      });
    }
    const secondResponse = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0.2,
    });

    return secondResponse.choices;
  } else {
    return firstResponse.choices;
  }
}

async function toolCallRouter (
  toolCall: ChatCompletionMessageToolCall,
  message: Message<boolean>
): Promise<{
  functionName: string;
  response: string;
}> {
  let res;
  const functionName = toolCall.function.name;
  const functionToCall = getAvailableFunctions()[functionName];

  const functionArgs = JSON.parse(toolCall.function.arguments);
  const additionalArgs: any[] = [];

  switch (functionName) {
    case Tools.MUSIC_PLAY:
    case Tools.MUSIC_RESUME:
    case Tools.MUSIC_PAUSE:
    case Tools.MUSIC_LIST:
    case Tools.MUSIC_SKIP:
    case Tools.MUSIC_STOP:
    case Tools.MUSIC_REMOVE_LOOP:
    case Tools.MUSIC_TOGGLE_SONG_LOOP:
    case Tools.MUSIC_TOGGLE_QUEUE_LOOP:
    case Tools.MUSIC_CLEAR_QUEUE:
    case Tools.MUSIC_SHUFFLE:
    case Tools.VOICE_DISCONNECT_CHANNEL:
    case Tools.VOICE_CONNECT_CHANNEL: {
      additionalArgs.push(message);
      break;
    }
  }
  const functionResponse = await functionToCall(
    ...Object.values(functionArgs),
    ...additionalArgs
  );
  res = JSON.stringify(functionResponse);
  return {
    functionName: toolCall.function.name,
    response: res || "",
  };
};
