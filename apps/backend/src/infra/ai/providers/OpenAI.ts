import OpenAI from "openai";
import { summarizerSystemPrompt } from "../prompts/summarizerPrompt.js";
import type { SummaryProps } from "../types.js";

export class OpenAIClient {
  private ai: OpenAI;

  constructor() {
    // Automatically picks OPENAI_API_KEY from env
    this.ai = new OpenAI();
  }

  async summarizeExecution(data: SummaryProps) {
    try {
      const response = await this.ai.responses.create({
        model: "gpt-5-nano",
        instructions: summarizerSystemPrompt(),
        input: JSON.stringify(data),
      });

      const outputResponse = response.output_text;
      console.log({ outputResponse });
    } catch (error: any) {
      console.log("Error with Open AI API!");
      throw new Error(error);
    }
  }
}
