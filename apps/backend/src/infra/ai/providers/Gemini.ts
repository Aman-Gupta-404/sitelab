import { GoogleGenAI } from "@google/genai";
import { getSystemPrompt } from "../prompts/systemPrompt.js";

export class GeminiClient {
  private ai: GoogleGenAI;

  constructor() {
    // Automatically picks GEMINI_API_KEY from env
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY! || "",
    });
  }

  async generateContent(prompt: string) {
    const response = await this.ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: prompt,
      //   systemInstruction: getSystemPrompt(),
    });
    for await (const chunk of response) {
      console.log(chunk.text);
    }
  }
}
