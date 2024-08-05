import { setupEnvironment } from './setup-environment';
setupEnvironment();

let openAiApiKey = process.env.VITE_OPENAI_API_KEY;

import OpenAI from "openai";
const openai = new OpenAI({ apiKey: openAiApiKey});

import tools from './tools';
import {conversation} from './conversation';


const main = async () => {
    const messages: OpenAI.ChatCompletionMessageParam[] = [
        { role: "user", content: "Please show me all the communities I have access to", name: "message-1" },
    ];

    const result = await conversation(openai, messages, tools);
    if(result){
        console.log(result[0]?.message?.content);
    }
}

main();