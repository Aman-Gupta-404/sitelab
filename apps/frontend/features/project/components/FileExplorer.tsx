import Hint from "@/components/shared/Hint";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { CopyIcon } from "lucide-react";
import React, { useState } from "react";
import CodeView from "./code-view";

type FileCollection = { [path: string]: string };

function getFileExtention(filename: string): string {
  const extention = filename.split(".").pop()?.toLocaleLowerCase();
  return extention || "text";
}

interface FileExplorerProps {
  files: FileCollection;
}

function FileExplorer({ files }: FileExplorerProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });

  return (
    <ResizablePanelGroup>
      <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
        <p>TODO: Tree view</p>
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors" />
      <ResizablePanel defaultSize={70} minSize={50}>
        {/* <p>TODO: Code view</p> */}
        {selectedFile && files[selectedFile] ? (
          <div className="h-full w-full flex flex-col">
            <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center">
              {/* TODO: Add breadcrums here */}
              <Hint text="copy to clipboard" side="bottom">
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-auto"
                  onClick={() => {}}
                  disabled={false}
                >
                  <CopyIcon />
                </Button>
              </Hint>
            </div>
            <div className="flex-1 overflow-auto">
              {/* <CodeView code="const a = 'hello world';" language="ts" /> */}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select a file to view it's contents
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default FileExplorer;
