import OpenAI from "openai";
import { Tool } from "../tools/tool-spec";

export interface Assistant {
  assistantSpecification: Omit<OpenAI.Beta.Assistants.AssistantCreateParams, "tools" | "model">;
  tools: Tool<any>[];
}

