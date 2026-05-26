import Link from "next/link";
import { useState } from "react";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import UserControl from "@/components/layout/UserControl";
import { ErrorType, Project } from "@/types/common.types";
import WebView from "@/features/project/components/WebView";
import CodeView from "@/features/project/components/code-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            className={
              tabState === "preview"
                ? "bg-sidebar text-foreground border-sidebar-border"
                : ""
            }
          >
            <EyeIcon /> <span>Demo</span>
          </TabsTrigger>
          <TabsTrigger
            value="code"
            className={
              tabState === "code"
                ? "bg-sidebar text-foreground border-sidebar-border"
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
          <UserControl />
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
