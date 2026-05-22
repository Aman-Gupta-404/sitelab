import type { Job } from "bullmq";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, getSandboxFiles } from "@/shared/utils/sandbox.js";
import { LlmClient } from "@/infra/ai/index.js";
import redisClient from "@/infra/redis/redis.client.js";
import { updateRedisProjectStatus } from "@/infra/redis/services/project.services.js";
import { ProjectRepository } from "@/modules/project/repository/project.repository.js";
import SandboxClass from "@/infra/sandbox/index.js";

export async function processAIJob(job: Job) {
  // initialize redis publisher once
  const publisher = redisClient.getClient();
  const projectRepository = new ProjectRepository();

  try {
    const { prompt, projectId, projectSlug: slug } = job.data;

    await updateRedisProjectStatus({
      slug,
      response: null,
      status: "processing",
    });

    const aiClient = new LlmClient();

    console.log("Executing the LLM Process");

    // publish the start of the job
    await publisher.publish(
      `projectId:${slug}`,
      JSON.stringify({
        type: "start",
      }),
    );

    // ! This is commented for testing purpose, revert this later on
    // const response = await aiClient.runAgent({ prompt, projectId });
    // await projectRepository.handlePromptResponse(response);
    const response = {
      sandboxId: "11111",
      sandboxUrl: "www.sandbox.com",
      projectId: projectId,
      message: `<task_summary>
Created a simple counter button app with a pastel blue theme. The app includes increment/decrease buttons, a large circular display for the count, and a reset button. It uses a soft blue color palette with gradients and is fully functional with React state management.
</task_summary>`,
    };

    // ! [TESTING] - Final result after delay
    await new Promise((resolve) => {
      setTimeout(async () => {
        await updateRedisProjectStatus({
          slug,
          response,
          status: "processed",
        });

        // read the sandbox files
        const sandboxId = await SandboxClass.getSandboxId();
        console.log({ sandboxId });

        console.log("---- Reading the updated file ----");
        // /app/layout.tsx
        // const files = await getSandboxFiles({
        //   sandboxId,
        //   selectedFiles: ["/app/layout.tsx"],
        // });

        // console.log({ files });

        await projectRepository.handlePromptResponse(response);

        // publish the completion of the job
        await publisher.publish(
          `projectId:${slug}`,
          JSON.stringify({
            type: "complete",
            data: response,
          }),
        );

        resolve(true);
      }, 5000);
    });

    // await updateRedisProjectStatus({ projectId, response });

    // // publish the completion of the job
    // await publisher.publish(
    //   `projectId:${slug}`,
    //   JSON.stringify({
    //     type: "complete",
    //     data: response,
    //   }),
    // );

    console.log("LLM Process Completed!");

    return true;
  } catch (error) {
    // publish the start of the job
    await publisher.publish(
      `projectId:${job.data.projectSlug}`,
      JSON.stringify({
        type: "complete",
        error: error,
      }),
    );
    return false;
  }
}
