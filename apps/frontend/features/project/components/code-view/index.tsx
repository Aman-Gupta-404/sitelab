import React, { useCallback, useEffect, useState } from "react";

import { projectsApi } from "@/apis/projects/projects.api";
import { useParams } from "next/navigation";

import { ProjectFiles, TreeStructure } from "@/types/project.types";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Hint from "@/components/shared/Hint";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import TreeView from "./tree-view";
import FileView from "./file-view";

interface Props {
  code: string;
  language: string;
}

function CodeView() {
  const params = useParams();

  const [tree, setTree] = useState<TreeStructure[]>([]);
  const [files, setFiles] = useState<ProjectFiles>({});
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleSelectFile = useCallback(
    (path: string) => {
      setSelectedFile(path);
    },
    [files],
  );

  useEffect(() => {
    const getFiles = async () => {
      if (!params.slug) return;

      const result = await projectsApi.getProjectFiles(params.slug as string);
      console.log(result.data.tree);

      if (result.status === 200) {
        setTree(result.data.tree);
        setFiles(result.data.files);
        setSelectedFile("/app/page.tsx");
      }
    };

    getFiles();
  }, []);

  return (
    <ResizablePanelGroup>
      <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
        <TreeView
          tree={tree}
          files={files}
          onSelect={handleSelectFile}
          selectedPath={selectedFile}
        />
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors" />
      <ResizablePanel defaultSize={70} minSize={50}>
        {/* <p>TODO: Code view</p> */}
        <FileView files={files} selectedFile={selectedFile} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default CodeView;
