export interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
}

export interface SendPromptType {
  content: string;
  projectSlug?: string;
}

export interface SendPromptResponseType {
  message: string;
  name: string;
  projectUrl: string | null;
  userId: string;
  _id: string;
}

export interface ProjectResponseType {
  _id: string;
  name: string;
  userId: string;
  projectUrl: string;
  totalPrompts: number;
}

export interface TreeStructure {
  name: string;
  path: string;
  type: string;
  children?: TreeStructure[];
}

export interface ProjectFilesResponse {
  files: {
    [key: string]: { content: string; hash: string };
  };
  tree: TreeStructure[];
}

// export interface SendMessagePayload {
//   text: string;
//   receiverId: string;
// }
