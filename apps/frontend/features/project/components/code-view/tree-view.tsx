import React, { useState } from "react";
import {
  Sidebar,
  SidebarRail,
  SidebarMenu,
  SidebarGroup,
  SidebarContent,
  SidebarMenuSub,
  SidebarMenuItem,
  SidebarProvider,
  SidebarMenuButton,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import { ProjectFiles, TreeStructure } from "@/types/project.types";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  FileCode2,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TreeNodeProps {
  node: TreeStructure;
  level: number;
  selectedPath?: string;
  onSelect?: (path: string) => void;
}

function getFileIcon(fileName: string) {
  if (fileName.endsWith(".json")) {
    return <FileJson className="h-4 w-4 shrink-0 text-yellow-300" />;
  }

  if (
    fileName.endsWith(".ts") ||
    fileName.endsWith(".tsx") ||
    fileName.endsWith(".js") ||
    fileName.endsWith(".jsx")
  ) {
    return <FileCode2 className="h-4 w-4 shrink-0 text-blue-400" />;
  }

  return <FileText className="h-4 w-4 shrink-0 text-neutral-400" />;
}

function TreeNode({ node, level, selectedPath, onSelect }: TreeNodeProps) {
  const isFolder = node.type === "folder";

  const [open, setOpen] = useState(false);

  const isSelected = selectedPath === node.path;

  const handleClick = () => {
    if (isFolder) {
      setOpen((prev) => !prev);
      return;
    }
    onSelect?.(node.path);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "flex w-full items-center gap-1 rounded-md py-1 pr-2 text-sm hover:text-neutral-200 hover:bg-neutral-800",
          isSelected && "bg-neutral-800 text-neutral-200",
        )}
        style={{
          paddingLeft: `${level * 14 + 8}px`,
        }}
      >
        {isFolder ? (
          open ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
          )
        ) : (
          <div className="w-4" />
        )}

        {isFolder ? (
          open ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-yellow-400" />
          ) : (
            <Folder className="h-4 w-4 shrink-0 text-yellow-400" />
          )
        ) : (
          getFileIcon(node.name)
        )}

        <span className="truncate">{node.name}</span>
      </button>

      {isFolder && open && node.children?.length ? (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              level={level + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

interface Props {
  loading: boolean;
  files: ProjectFiles;
  tree: TreeStructure[];
  selectedPath: string | null;
  onSelect: (path: string) => void;
}

function TreeView(props: Props) {
  const { tree, onSelect, selectedPath, loading } = props;

  return (
    <div className="h-full overflow-hidden bg-sidebar">
      <SidebarProvider className="custom-scrollbar h-full overflow-y-auto overflow-x-hidden">
        <Sidebar collapsible="none" className="w-full h-auto">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-neutral-400">
                Explorer
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="mt-2">
                  {loading ? (
                    <>
                      <Skeleton className="w-[95%] h-5 mb-2 rounded ml-2 mr-2" />
                      <Skeleton className="w-[95%] h-5 mb-2 rounded ml-2 mr-2" />
                      <Skeleton className="w-[95%] h-5 mb-2 rounded ml-2 mr-2" />
                      <Skeleton className="w-[95%] h-5 mb-2 rounded ml-2 mr-2" />
                      <Skeleton className="w-[95%] h-5 mb-2 rounded ml-2 mr-2" />
                      <Skeleton className="w-[95%] h-5 mb-2 rounded ml-2 mr-2" />
                    </>
                  ) : (
                    tree.map((node) => (
                      <TreeNode
                        key={node.path}
                        node={node}
                        level={0}
                        selectedPath={selectedPath || ""}
                        onSelect={onSelect}
                      />
                    ))
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}

export default TreeView;
