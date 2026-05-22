import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt } from "../prompts/systemPrompt.js";
import { tools } from "../tools/toolDefinitions.js";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { toolHandlers } from "../tools/handlers.js";
import type { ToolUseType } from "@/types/ai-tools.js";
import SandboxClass from "@/infra/sandbox/index.js";
import { getSandbox } from "@/shared/utils/sandbox.js";
import type { RunAgentParams } from "../types.js";
import logger from "@/shared/utils/logger.js";
import { ProjectRepository } from "@/modules/project/repository/project.repository.js";
import redisClient from "@/infra/redis/redis.client.js";
import type { Redis } from "ioredis";

const MAX_ITERATIONS = 15;

export class AnthropicClient {
  private client: Anthropic;
  private projectRepository: ProjectRepository;
  private publisher: Redis;
  constructor() {
    this.client = new Anthropic();
    this.projectRepository = new ProjectRepository();
    this.publisher = redisClient.getClient();
  }

  async runAgent({ prompt, projectId }: RunAgentParams) {
    try {
      console.log("==== queue worker started ====");

      //
      await this.publisher.publish(
        `projectId:${projectId}`,
        JSON.stringify({
          type: "start",
        }),
      );

      let messages: MessageParam[] = [{ role: "user", content: prompt }];
      let iterations = 0;
      let finalContent = null;
      let finalTextBlock = null;
      while (true) {
        iterations++;
        try {
          console.log(
            `\n====== Running the loop | Iteration: ${iterations} ======\n`,
          );

          const response = await this.client.messages.create({
            max_tokens: 4000,
            messages: messages,
            system: getSystemPrompt(),
            // model: "claude-sonnet-4-6",
            model: "claude-haiku-4-5-20251001",
            tools: tools,
          });

          console.log("response");
          console.log(response);

          const content = response.content;

          console.log("content");
          console.log(content);

          // Check if Claude wants to use a tool
          const toolUses = content.filter(
            (c): c is Extract<typeof c, { type: "tool_use" }> =>
              c.type === "tool_use",
          );

          if (!toolUses.length) {
            finalContent = content;
            finalTextBlock = content.find(
              (c): c is Extract<typeof c, { type: "text" }> =>
                c.type === "text",
            );

            break;
          }

          messages.push({
            role: "assistant",
            content,
          });

          const toolResults = await Promise.all(
            toolUses.map(async (toolUse) => {
              let { name, input, id } = toolUse as ToolUseType;

              console.log(`🛠 Tool: ${name}`, input);

              let result: string | any;

              try {
                const handler = toolHandlers[name as keyof typeof toolHandlers];

                if (!handler) throw new Error(`Unknown tool: ${name}`);

                result = await handler(input);
              } catch (err: any) {
                result = `ERROR: ${err.message}`;
              }

              return {
                type: "tool_result" as const,
                tool_use_id: id,
                content: result,
              };
            }),
          );

          // 👉 Send ALL tool results back in ONE message
          messages.push({
            role: "user",
            content: toolResults,
          });

          // adding a maximum limit
          if (iterations >= MAX_ITERATIONS) break;
        } catch (error) {
          console.log({ error });
          return false;
        }
      }

      console.log(
        "==================== Completed the Execution ============================",
      );
      const sandboxId = await SandboxClass.getSandboxId();
      const sandbox = await getSandbox(sandboxId);
      const sandboxHost = sandbox.getHost(3000);
      const sandboxUrl = `https://${sandboxHost}`;
      console.log({ finalContent });
      logger.info({ finalContent });
      logger.error({ finalContent });

      const body = {
        sandboxId,
        sandboxUrl: sandboxUrl,
        projectId,
        message: finalTextBlock ? finalTextBlock.text : null,
      };

      // TODO: Check this later
      // await this.projectRepository.handlePromptResponse(body);
      return body;
    } catch (error) {
      console.log({ error });
      return false;
    }
  }
}
