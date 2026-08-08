import type { MemoryContext } from "@/types/common.js";
import { Sandbox } from "@e2b/code-interpreter";

export type RunAgentParams = {
  prompt: string;
  projectId: string;
  memory: MemoryContext | {};
  sandbox: Sandbox;
  sandboxId: string;
};

export type SummaryProps = {
  currentMemory: any;
  executionLog: any;
};
