import { Sandbox } from "@e2b/code-interpreter";

class SandboxClass {
  private static sandboxId: string | null = null;
  private static sandboxIdPromise: Promise<string> | null = null;

  private constructor() {} // prevent instantiation

  private static async execute(): Promise<string> {
    console.log("Executing async...");

    const sandboxInstance = await Sandbox.create(
      "ag9139563/sitelab-next-test-2",
    );
    const id = sandboxInstance.sandboxId;
    return id;
  }

  public static async getSandboxId(): Promise<string> {
    // If already resolved → return immediately
    if (SandboxClass.sandboxId) {
      return SandboxClass.sandboxId;
    }

    // If already in progress → return same promise
    if (!SandboxClass.sandboxIdPromise) {
      SandboxClass.sandboxIdPromise = (async () => {
        const id = await SandboxClass.execute();
        SandboxClass.sandboxId = id;
        return id;
      })();
    }

    return SandboxClass.sandboxIdPromise;
  }
}

export default SandboxClass;
