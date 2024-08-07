import { setupEnvironment } from './setup-environment';
setupEnvironment();

let openAiApiKey = process.env.VITE_OPENAI_API_KEY;

import OpenAI from "openai";
const openai = new OpenAI({ apiKey: openAiApiKey});

import tools from './tools';
import {conversation} from './runners/conversation';
import {agent} from './runners/agent';
import {data} from './assistants/data';


const main = async () => {
  const runType = "agent";
  if(runType === "agent"){
    const messages = [
      { role: "user" as const, content: "Can you draft an email to sam altman thanking him from all the communities I manage and include a signature of my name" },
    ];
          
    const result = await agent(openai,messages,data);
    if(result){
      console.log("done!");
      if(result[0]?.content[0].type === "text"){
        console.log(result[0]?.content[0].text.value);
      }
    }
  }else{
    const messages: OpenAI.ChatCompletionMessageParam[] = [
        { role: "user", content: "Please show me all the communities I have access to", name: "message-1" },
    ];
        
    const result = await conversation(openai, messages, tools);
    if(result){
      console.log(result[0]?.message?.content);
    }
  }
}

main();