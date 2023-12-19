"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openAIFunctionCalling = exports.messages = void 0;
const openai_1 = __importDefault(require("openai"));
const tools_1 = require("./tools");
const { openaiApiKey } = process.env;
const openai = new openai_1.default({
    apiKey: openaiApiKey,
});
const char = "삼태기봇";
exports.messages = [
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
function chatCompletion(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const completion = yield openai.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "gpt-3.5-turbo-1106",
        });
        return completion;
    });
}
exports.default = chatCompletion;
function openAIFunctionCalling(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const sendMessage = message.content;
        const model = "gpt-3.5-turbo-1106";
        exports.messages.push({ role: "user", content: sendMessage });
        const firstResponse = yield openai.chat.completions.create({
            model: model,
            messages: exports.messages,
            tools: (0, tools_1.getTools)(),
            temperature: 0.2,
        });
        const responseMessage = firstResponse.choices[0].message;
        exports.messages.push(responseMessage);
        const toolCalls = responseMessage.tool_calls;
        if (toolCalls) {
            for (const toolCall of toolCalls) {
                console.log(toolCall.function.name);
            }
            for (const toolCall of toolCalls) {
                const { functionName, response } = yield toolCallRouter(toolCall, message);
                exports.messages.push({
                    tool_call_id: toolCall.id,
                    role: "tool",
                    name: functionName,
                    content: response,
                });
            }
            const secondResponse = yield openai.chat.completions.create({
                model: model,
                messages: exports.messages,
                temperature: 0.2,
            });
            return secondResponse.choices;
        }
        else {
            return firstResponse.choices;
        }
    });
}
exports.openAIFunctionCalling = openAIFunctionCalling;
function toolCallRouter(toolCall, message) {
    return __awaiter(this, void 0, void 0, function* () {
        let res;
        const functionName = toolCall.function.name;
        const functionToCall = (0, tools_1.getAvailableFunctions)()[functionName];
        const functionArgs = JSON.parse(toolCall.function.arguments);
        const additionalArgs = [];
        switch (functionName) {
            case tools_1.Tools.MUSIC_PLAY:
            case tools_1.Tools.MUSIC_RESUME:
            case tools_1.Tools.MUSIC_PAUSE:
            case tools_1.Tools.MUSIC_LIST:
            case tools_1.Tools.MUSIC_SKIP:
            case tools_1.Tools.MUSIC_STOP:
            case tools_1.Tools.MUSIC_REMOVE_LOOP:
            case tools_1.Tools.MUSIC_TOGGLE_SONG_LOOP:
            case tools_1.Tools.MUSIC_TOGGLE_QUEUE_LOOP:
            case tools_1.Tools.MUSIC_CLEAR_QUEUE:
            case tools_1.Tools.MUSIC_SHUFFLE:
            case tools_1.Tools.VOICE_DISCONNECT_CHANNEL:
            case tools_1.Tools.VOICE_CONNECT_CHANNEL: {
                additionalArgs.push(message);
                break;
            }
        }
        const functionResponse = yield functionToCall(...Object.values(functionArgs), ...additionalArgs);
        res = JSON.stringify(functionResponse);
        return {
            functionName: toolCall.function.name,
            response: res || "",
        };
    });
}
;
