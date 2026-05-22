export interface TreeStructure {
  name: string;
  path: string;
  type: string;
  children?: TreeStructure[];
}

export interface ProjectFiles {
  [key: string]: { content: string; hash: string };
}
