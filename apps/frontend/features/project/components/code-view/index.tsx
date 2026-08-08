import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { projectsApi } from "@/apis/projects/projects.api";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ProjectFiles, TreeStructure } from "@/types/project.types";

import TreeView from "./tree-view";
import FileView from "./file-view";

interface Props {
  refetch: number;
}

function CodeView(props: Props) {
  const params = useParams();

  const [isFetching, setIsFetching] = useState(false);
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
      setIsFetching(true);
      try {
        const result = await projectsApi.getProjectFiles(params.slug as string);

        if (result.status === 200) {
          setTree(result.data.tree);
          setFiles(result.data.files);
          setSelectedFile("/app/page.tsx");
        } else {
          toast.error("Error in fetching files");
        }
      } catch (error: any) {
        toast.error(error?.message || "Error in fetching files");
      } finally {
        setIsFetching(false);
      }
    };

    getFiles();
  }, [props.refetch]);

  return (
    <ResizablePanelGroup>
      <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
        <TreeView
          tree={tree}
          files={files}
          loading={isFetching}
          onSelect={handleSelectFile}
          selectedPath={selectedFile}
        />
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors" />
      <ResizablePanel defaultSize={70} minSize={50}>
        {/* <p>TODO: Code view</p> */}
        <FileView
          files={files}
          loading={isFetching}
          selectedFile={selectedFile}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default CodeView;
