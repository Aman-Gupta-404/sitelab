import { GoogleGenAI } from "@google/genai";
import { getSystemPrompt } from "./prompts/systemPrompt.js";
import { AnthropicClient } from "./providers/Antropic.js";
import type { RunAgentParams } from "./types.js";

export class LlmClient {
  private anthropicClient: AnthropicClient;
  constructor() {
    this.anthropicClient = new AnthropicClient();
  }

  async runAgent(data: RunAgentParams) {
    return await this.anthropicClient.runAgent(data);
  }
}
