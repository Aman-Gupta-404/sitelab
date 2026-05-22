import crypto from "crypto";

export function generateHash(content: string) {
  return crypto.createHash("sha256").update(content).digest("hex");
}
