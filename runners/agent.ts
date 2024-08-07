import OpenAI from "openai";
import { Assistant } from '../assistants/assistant-spec';
import { AssistantRunner } from "./assistant-runner";

export const agent = async (openai:OpenAI, messages: OpenAI.Beta.Threads.Messages.MessageCreateParams[], assistantSpec: Assistant ): Promise<OpenAI.Beta.Threads.Messages.Message[]> =>{
    const assistantParams = {
        ...assistantSpec.assistantSpecification,
    } as OpenAI.Beta.Assistants.AssistantCreateParams;
    assistantParams.model = "gpt-4o";  
    assistantParams.tools = assistantSpec.tools.map((tool) => tool.toolSpecification);
    
    const assistant = await openai.beta.assistants.create(assistantParams);

    const thread = await openai.beta.threads.create();

    for(const message of messages) {
        await openai.beta.threads.messages.create(
            thread.id,
            message,
        ); 
    };

    const assistantRunner = new AssistantRunner(openai, thread, assistantSpec);

    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: assistant.id,
        parallel_tool_calls:false
      });

    return assistantRunner.handleRunStatus(run);
    

}