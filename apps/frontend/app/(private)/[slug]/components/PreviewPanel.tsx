import Link from "next/link";
import { useState } from "react";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import UserControl from "@/components/layout/UserControl";
import { ErrorType, Project } from "@/types/common.types";
import WebView from "@/features/project/components/WebView";
import CodeView from "@/features/project/components/code-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpgradeComingSoonModal } from "@/features/project/modals/upgradeModal";

interface Props {
  project: Project | ErrorType | null;
  loading: boolean;
  refetch: number;
}

type TabStateType = "preview" | "code";

export function PreviewPanelSkeleton() {
  return (
    <div className="flex h-full flex-col bg-background p-1">
      {/* Header */}
      <Skeleton className="mb-2 h-8 w-full" />

      {/* Browser bar */}
      <Skeleton className="mb-3 h-10 w-full rounded-lg" />

      {/* Main preview */}
      <Skeleton className="flex-1 rounded-xl" />
    </div>
  );
}

function PreviewPanel(props: Props) {
  const { project, loading } = props;
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const [tabState, setTabState] = useState<TabStateType>("preview");

  return loading ? (
    <PreviewPanelSkeleton />
  ) : (
    <Tabs
      className={"h-full gap-y-0 flex-col "}
      defaultValue="preview"
      value={tabState}
      onValueChange={(value) => setTabState(value as TabStateType)}
    >
      <div className="w-full flex items-center p-2 border-b gap-x-2 h-10">
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
          <Button
            // asChild
            size="sm"
            variant="secondary"
            onClick={() => setUpgradeModalOpen(true)}
            className="bg-amber-500/15 text-amber-400"
          >
            {/* <Link href={"/pricing"}> */}
            <CrownIcon /> Upgrade
            {/* </Link> */}
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
        <CodeView refetch={props.refetch} />
      </TabsContent>

      <UpgradeComingSoonModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
      />
    </Tabs>
  );
}

export default PreviewPanel;
