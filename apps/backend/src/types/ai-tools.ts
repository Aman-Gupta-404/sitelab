import type {
  ReadFileInput,
  RunCommandInput,
  WriteFilesInput,
  UpdateFilesInput,
} from "./common.js";

export type ToolUseType = {
  name: string;
  input: WriteFilesInput & ReadFileInput & RunCommandInput & UpdateFilesInput;
  id: string;
};
