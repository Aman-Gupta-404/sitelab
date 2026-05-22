import type {
  ReadFileInput,
  RunCommandInput,
  WriteFilesInput,
  UpdateFilesInput,
} from "./common.js";

export type ToolUseType = {
  name: String;
  input: WriteFilesInput & ReadFileInput & RunCommandInput & UpdateFilesInput;
  id: string;
};
