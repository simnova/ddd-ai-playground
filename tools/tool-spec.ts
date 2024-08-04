import OpenAI from "openai";


export interface Tool<TProps> {
  tool: (props: TProps) => string;
  toolSpecification: OpenAI.Chat.Completions.ChatCompletionTool;
}