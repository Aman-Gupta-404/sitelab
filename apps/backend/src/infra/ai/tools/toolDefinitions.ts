import type { Tool } from "@anthropic-ai/sdk/resources/messages";

export const tools: Tool[] = [
  {
    name: "write_files",
    description: "Write multiple files in the project",
    input_schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: {
            type: "object",
            properties: {
              path: { type: "string" },
              content: { type: "string" },
            },
            required: ["path", "content"],
          },
        },
      },
      required: ["files"],
    },
  },
  {
    name: "update_files",
    description:
      "Apply precise updates to files using find-and-replace operations",
    input_schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: {
            type: "object",
            properties: {
              path: { type: "string" },
              updates: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    find: {
                      type: "string",
                      description: "Exact code snippet to find in the file",
                    },
                    replace: {
                      type: "string",
                      description: "Code that will replace the matched snippet",
                    },
                    replaceAll: {
                      type: "boolean",
                      description:
                        "If true, replace all occurrences. Default false",
                    },
                  },
                  required: ["find", "replace"],
                },
              },
            },
            required: ["path", "updates"],
          },
        },
      },
      required: ["files"],
    },
  },
  {
    name: "read_file",
    description: "Read a file",
    input_schema: {
      type: "object",
      properties: {
        paths: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["paths"],
    },
  },
  {
    name: "run_command",
    description: "Run a shell command in the project",
    input_schema: {
      type: "object",
      properties: {
        command: { type: "string" },
      },
      required: ["command"],
    },
  },
];

/*
[
{
  path: string,
  updates: [
    {
      startLine: number,
      endLine: number,
      content
    }
  ]
},
{}
]
*/
