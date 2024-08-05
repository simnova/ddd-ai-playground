import OpenAI from "openai";


export interface Tool<TProps> {
  tool: (props: TProps) => Promise<string>;
  toolSpecification: OpenAI.Chat.Completions.ChatCompletionTool;
}