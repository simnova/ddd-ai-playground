import { OpenAI } from "openai";
import { Assistant } from "../assistants/assistant-spec";


export class AssistantRunner {
    private client: OpenAI;
    private thread: OpenAI.Beta.Thread;
    private assistant:  Assistant;
    constructor(client: OpenAI, thread: OpenAI.Beta.Thread, assistant: Assistant) {
      this.client = client;
      this.thread = thread;
      this.assistant = assistant;
    }

private async runFunction(toolCall: OpenAI.Beta.Threads.Runs.RequiredActionFunctionToolCall): Promise<OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParams.ToolOutput|undefined> {
  const functionName = toolCall.function.name;
  const functionSpec = this.assistant.tools.find((tool) => tool.toolSpecification.function.name === functionName);
  if(functionSpec){
      const functionArgs = JSON.parse(toolCall.function.arguments);
      return {
        tool_call_id: toolCall.id,
        output: await functionSpec.tool(functionArgs),
      } ;
  }
}

private  async handleRequiresAction (run:OpenAI.Beta.Threads.Runs.Run): Promise<OpenAI.Beta.Threads.Messages.Message[]|undefined> {
    // Check if there are tools that require outputs
    if (
      run.required_action &&
      run.required_action.submit_tool_outputs &&
      run.required_action.submit_tool_outputs.tool_calls
    ) {
      // Loop through each tool in the required action section
      let toolOutputs: OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParams.ToolOutput[] = [];
      for await (const toolCall of run.required_action.submit_tool_outputs.tool_calls) {
        const toolOutput = await this.runFunction(toolCall);
        if (toolOutput) {
          toolOutputs.push(toolOutput);
        }
      }
      
      // Submit all tool outputs at once after collecting them in a list
      if ( toolOutputs.length > 0) {
        run = await this.client.beta.threads.runs.submitToolOutputsAndPoll(
          this.thread.id,
          run.id,
          {
            tool_outputs: toolOutputs,

          } as OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParamsNonStreaming          
        );
      } else {
        console.log("No tool outputs to submit.");
      }
  
      // Check status after submitting tool outputs
      return this.handleRunStatus(run);
    }
  };
  
   public async handleRunStatus(run: OpenAI.Beta.Threads.Runs.Run): Promise<OpenAI.Beta.Threads.Messages.Message[]> {
    // Check if the run is completed
    if (run.status === "completed") {
      let messages = await this.client.beta.threads.messages.list(this.thread.id);
      console.log(messages.data);
      return messages.data;
    } else if (run.status === "requires_action") {
      console.log(run.status);
      return await this.handleRequiresAction(run)??[];
    } else {
      console.error("Run did not complete:", run);
      return [];
    }
  };
}