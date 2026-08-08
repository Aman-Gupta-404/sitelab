import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt } from "../prompts/systemPrompt.js";
import { tools } from "../tools/toolDefinitions.js";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { toolHandlers } from "../tools/handlers.js";
import type { ToolUseType } from "@/types/ai-tools.js";
import SandboxClass from "@/infra/sandbox/index.js";
import { getSandbox } from "@/shared/utils/sandbox.js";
import logger from "@/shared/utils/logger.js";
import { ProjectRepository } from "@/modules/project/repository/project.repository.js";
import redisClient from "@/infra/redis/redis.client.js";
import type { Redis } from "ioredis";
import { GeminiClient } from "./Gemini.js";
import type {
  ExecutionLog,
  MemoryContext,
  RawMemoryContext,
} from "@/types/common.js";
import type { RunAgentParams } from "../types.js";

const MAX_ITERATIONS = 15;

export class AnthropicClient {
  private client: Anthropic;
  private gemini: GeminiClient;
  private projectRepository: ProjectRepository;
  private publisher: Redis;

  constructor() {
    this.client = new Anthropic();
    this.gemini = new GeminiClient();
    this.projectRepository = new ProjectRepository();
    this.publisher = redisClient.getClient();
  }

  async runAgent({
    prompt,
    projectId,
    memory,
    sandbox,
    sandboxId,
  }: RunAgentParams) {
    try {
      // creating an execution log object
      const executionLog: ExecutionLog = {
        initialPrompt: prompt,
        finalResponse: "",
        toolCalls: [],
      };

      await this.publisher.publish(
        `projectId:${projectId}`,
        JSON.stringify({
          type: "start",
        }),
      );

      // initialize variables
      let messages: MessageParam[] = [{ role: "user", content: prompt }];
      let iterations = 0;
      let finalContent = null;
      let finalTextBlock = null;
      const prevMemoryContext = Object.keys(memory).length
        ? (memory as MemoryContext)
        : undefined;

      // start the AI Iteration
      while (true) {
        iterations++;

        try {
          const response = await this.client.messages.create({
            max_tokens: 4000,
            messages: messages,
            system: getSystemPrompt(prevMemoryContext),
            // model: "claude-sonnet-4-6",
            model: "claude-haiku-4-5-20251001",
            tools: tools,
          });

          const content = response.content;

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

            executionLog.finalResponse = finalTextBlock?.text ?? "";

            break;
          }

          messages.push({
            role: "assistant",
            content,
          });

          const toolResults = await Promise.all(
            toolUses.map(async (toolUse) => {
              let { name, input, id } = toolUse as ToolUseType;

              let result: string | any;

              try {
                const handler = toolHandlers[name as keyof typeof toolHandlers];

                if (!handler) throw new Error(`Unknown tool: ${name}`);

                result = await handler(input, sandbox);

                // parse the handler output and then check if success of not
                // if success, then add to execution log
                const parsedRes = JSON.parse(result);

                if (parsedRes.success) {
                  const parsedInputs =
                    typeof input.files === "string"
                      ? JSON.parse(input.files)
                      : input.files;

                  const filesEffected = parsedInputs.map(
                    ({ path }: { path: string }) => path,
                  );

                  executionLog.toolCalls.push({
                    tool: name,
                    filesEffected: filesEffected,
                    success: true,
                    summary: this.summarizeToolResult(name, input, result),
                  });
                }
              } catch (err: any) {
                result = `ERROR: ${err.message}`;
                // executionLog.toolCalls.push({
                //   tool: name,
                //   filesEffected: parsedInputs.map(
                //     ({ path }: { path: string }) => path,
                //   ),
                //   success: false,
                //   summary: err.message,
                // });
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
        } catch (error: any) {
          throw new Error(error);
        }
      }

      // generating a compiled memory from execution logs
      const memoryContext = await this.gemini.summarizeExecution({
        currentMemory: prevMemoryContext,
        executionLog,
      });

      // extracting the important updated files
      const updatedFilesList = executionLog.toolCalls
        .map((item) => item.filesEffected)
        .flat();

      const sandboxHost = sandbox.getHost(3000);
      const sandboxUrl = `https://${sandboxHost}`;

      const body = {
        sandboxId,
        sandboxUrl: sandboxUrl,
        projectId,
        message: finalTextBlock ? finalTextBlock.text : null,
        executionLog,
        updatedFilesList,
        memoryContext: memoryContext as RawMemoryContext,
      };

      return body;
    } catch (error: any) {
      // todo: update redis state to failure
      throw new Error(error);
    }
  }

  summarizeToolResult(tool: string, input: any, result: any): string {
    switch (tool) {
      case "read_file":
        return `Read file ${input.path}`;

      case "write_file":
        return `Updated ${input.path}`;

      case "create_file":
        return `Created ${input.path}`;

      case "delete_file":
        return `Deleted ${input.path}`;

      case "rename_file":
        return `Renamed ${input.oldPath} -> ${input.newPath}`;

      case "run_command":
        return `Executed "${input.command}"`;

      case "list_files":
        return `Listed directory ${input.path}`;

      default:
        return `${tool} executed`;
    }
  }
}
