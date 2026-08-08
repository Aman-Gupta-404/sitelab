import type { Job } from "bullmq";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, getSandboxFiles } from "@/shared/utils/sandbox.js";
import { LlmClient } from "@/infra/ai/index.js";
import redisClient from "@/infra/redis/redis.client.js";
import { updateRedisProjectStatus } from "@/infra/redis/services/project.services.js";
import { ProjectRepository } from "@/modules/project/repository/project.repository.js";
import { ProjectService } from "@/modules/project/service/project.service.js";

export async function processAIJob(job: Job) {
  // initialize redis publisher once
  const publisher = redisClient.getClient();
  const projectRepository = new ProjectRepository();
  const projectService = new ProjectService(projectRepository);

  try {
    const {
      prompt,
      projectId,
      projectSlug: slug,
      memory,
      sandboxId,
    } = job.data;

    // updating the redis project status as processing
    await updateRedisProjectStatus({
      slug,
      response: null,
      status: "processing",
    });

    // initialize the AI client
    const aiClient = new LlmClient();

    // publish the start of the job
    await publisher.publish(
      `projectId:${slug}`,
      JSON.stringify({
        type: "start",
      }),
    );

    // start/get existing sandbox
    const sandboxData = await projectService.getProjectSandbox({
      projectId,
      sandboxId: sandboxId as string,
    });

    // Run the AI agent with the given prompt and existing project memory
    const response = await aiClient.runAgent({
      prompt,
      projectId,
      memory,
      sandbox: sandboxData.sandbox,
      sandboxId: sandboxData.sandboxId,
    });

    await projectRepository.handlePromptResponse(response, sandboxData.sandbox);

    // Updating the redis project status to processed
    await updateRedisProjectStatus({ slug, response, status: "processed" });

    // publishing the complete event
    await publisher.publish(
      `projectId:${slug}`,
      JSON.stringify({
        type: "complete",
        data: response,
      }),
    );

    return true;
  } catch (error: any) {
    // update the date
    await projectRepository.addAgentErrorMsg({
      projectId: job.data.projectId,
      message: error?.message || "Something went wrong, please try again",
    });

    // publish the start of the job
    await updateRedisProjectStatus({
      slug: job.data.projectSlug,
      response: {
        sandboxId: null,
        sandboxUrl: null,
        projectId: null,
        message: error?.message || "Something went wrong, please try again",
      },
      status: "error",
    });

    await publisher.publish(
      `projectId:${job.data.projectSlug}`,
      JSON.stringify({
        type: "complete",
        error: error?.message || "Something went wrong, please try again",
      }),
    );
    return false;
  }
}
