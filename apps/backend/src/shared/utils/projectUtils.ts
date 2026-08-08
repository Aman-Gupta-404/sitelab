import type { MemoryContext, RawMemoryContext } from "@/types/common.js";

export const parseRawSummaryResponse = (
  data: RawMemoryContext,
): MemoryContext => {
  return {
    goal: data.projectGoal,
    state: data.currentState,
    completed: data.completedFeatures,
    pending: data.pendingFeatures,
    architecture: data.architecture,
    preferences: data.userPreferences,
    issues: data.knownIssues,
    importantFiles: data.importantFiles,
    lastTask: data.lastTask,
  };
};
