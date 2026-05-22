export type Message = {
  content: string;
  createdAt: string;
  role: "agent" | "user";
  _id: string;
};

export type Project = {
  _id: string;
  name: string;
  userId: string;
  projectUrl: string;
};

export type ErrorType = {
  error: boolean;
  message: string;
};
