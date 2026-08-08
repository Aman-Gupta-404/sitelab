export type Message = {
  content: string;
  createdAt: string;
  role: "agent" | "user";
  error?: boolean;
  _id: string;
};

export type Project = {
  _id: string;
  name: string;
  userId: string;
  createdAt: string;
  projectUrl: string;
  totalPrompts: number;
};

export type ErrorType = {
  error: boolean;
  message: string;
};
