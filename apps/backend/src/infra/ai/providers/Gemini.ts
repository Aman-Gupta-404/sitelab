import { GoogleGenAI } from "@google/genai";
import { getSystemPrompt } from "../prompts/systemPrompt.js";
import type { SummaryProps } from "../types.js";
import { summarizerSystemPrompt } from "../prompts/summarizerPrompt.js";

import { tryCatch } from "bullmq";

export class GeminiClient {
  private ai: GoogleGenAI;

  constructor() {
    // Automatically picks GEMINI_API_KEY from env
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY! || "",
    });
  }

  async generateContent(prompt: string) {
    // const response = await this.ai.models.generateContentStream({
    //   model: "gemini-3-flash-preview",
    //   contents: prompt,
    //   //   systemInstruction: getSystemPrompt(),
    // });
    // for await (const chunk of response) {
    //   console.log(chunk.text);
    // }
  }

  async summarizeExecution(data: SummaryProps) {
    try {
      const startTime = performance.now();
      const response = await this.ai.models.generateContent({
        // model: "gemini-2.5-flash",
        model: "gemini-3.6-flash",
        contents: JSON.stringify(data),
        config: {
          systemInstruction: summarizerSystemPrompt(),
        },
      });
      const endTime = performance.now();
      const durationSeconds = (endTime - startTime) / 1000;

      // TODO: need to add retry logic for 423 rate limit errors
      const resp = response.text ? JSON.parse(response.text) : {};
      return resp;
    } catch (error) {
      console.error(error);
    }
  }
}
