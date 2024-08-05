import OpenAI from "openai";
import { Tool } from './tools/tool-spec';

export const conversation = async (openai:OpenAI, messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[], tools: Tool<any>[]) =>{
    // Step 1: send the user's message
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      tools: tools.map((tool) => tool.toolSpecification),
      tool_choice: "auto", // auto is default, but we'll be explicit
    });
    const responseMessage = response.choices[0].message;
  
    // Step 2: check if the model wanted to call a function
    const toolCalls = responseMessage.tool_calls;
    if (toolCalls) {
      // Step 3: call the function
      // Note: the JSON response may not always be valid; be sure to handle errors
      messages.push(responseMessage); // extend conversation with assistant's reply
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionSpec = tools.find((tool) => tool.toolSpecification.function.name === functionName);
        if(functionSpec){
            const functionArgs = JSON.parse(toolCall.function.arguments);
            const functionResponse = functionSpec.tool(functionArgs);
            messages.push({
              tool_call_id: toolCall.id,
              role: "tool",
              content: await functionResponse,
            }); // extend conversation with function response
        }
      }
      const secondResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
      }); // get a new response from the model where it can see the function response
      return secondResponse.choices;
    }
  }