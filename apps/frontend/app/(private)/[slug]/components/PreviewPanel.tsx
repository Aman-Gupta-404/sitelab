import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeView from "@/features/project/components/code-view";
import FileExplorer from "@/features/project/components/FileExplorer";
import WebView from "@/features/project/components/WebView";
import { cn } from "@/lib/utils";
import { ErrorType, Project } from "@/types/common.types";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface Props {
  project: Project | ErrorType | null;
}

type TabStateType = "preview" | "code";

function PreviewPanel(props: Props) {
  const { project } = props;

  const [tabState, setTabState] = useState<TabStateType>("preview");

  return (
    <Tabs
      className={"h-full gap-y-0 flex-col"}
      defaultValue="preview"
      value={tabState}
      onValueChange={(value) => setTabState(value as TabStateType)}
    >
      <div className="w-full flex items-center p-2 border-b gap-x-2">
        <TabsList className="p-0 border rounded-md">
          <TabsTrigger
            value="preview"
            // className={cn(
            //   tabState === "preview" ? "bg-sidebar color-red" : null,
            // )}
            className={
              tabState === "preview"
                ? "bg-sidebar text-destructive border-sidebar-border"
                : ""
            }
          >
            <EyeIcon /> <span>Demo</span>
          </TabsTrigger>
          <TabsTrigger
            value="code"
            className={
              tabState === "code"
                ? "bg-sidebar text-destructive border-sidebar-border"
                : ""
            }
          >
            <CodeIcon /> <span>Code</span>
          </TabsTrigger>
        </TabsList>

        <div className="ml-auto flex items-center gap-x-2">
          <Button asChild size="sm" variant="tertiary">
            <Link href={"/pricing"}>
              <CrownIcon /> Upgrade
            </Link>
          </Button>
        </div>
      </div>
      <TabsContent value="preview">
        {project && "projectUrl" in project && (
          <WebView url={project.projectUrl} />
        )}
      </TabsContent>
      <TabsContent value="code" className="min-h-0">
        {/* <CodeView code="const a = 'hello world';" language="ts" /> */}
        {/* <FileExplorer files={{ "index.tsx": "const a = 'hello world';" }} /> */}
        <CodeView />
      </TabsContent>
    </Tabs>
  );
}

export default PreviewPanel;
