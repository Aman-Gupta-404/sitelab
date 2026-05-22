import Hint from "@/components/shared/Hint";
import { Button } from "@/components/ui/button";
import { ProjectFiles } from "@/types/project.types";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import Prism from "prismjs";

import "./code-theme.css";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import { getLanguagefromExtention } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";

interface Props {
  files: ProjectFiles;
  selectedFile: string | null;
}

interface RenderCodeProps {
  language: string;
  code: string;
}

function FileBreadCrumb({ path }: { path: string }) {
  const pathSegments = path.split("/").slice(1);
  console.log({ pathSegments });
  const maxSegments = 4;

  const renderBreadcrumbItems = () => {
    if (pathSegments.length <= maxSegments) {
      // show all segments
      return pathSegments.map((segment, idx) => {
        const isLast = idx + 1 === pathSegments.length;
        return (
          <Fragment key={idx}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage className="font-medium">
                  {segment}
                </BreadcrumbPage>
              ) : (
                <span className="text-muted-foreground">{segment}</span>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        );
      });
    } else {
      const firstSegment = pathSegments[0];
      const lastSegment = pathSegments[pathSegments.length - 1];

      return (
        <Fragment>
          <BreadcrumbItem>
            <span className="text-muted-foreground">{firstSegment}</span>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">
              {lastSegment}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </Fragment>
      );
    }
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>{renderBreadcrumbItems()}</BreadcrumbList>
    </Breadcrumb>
  );
}

function RenderCode({ language, code }: RenderCodeProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);
  return (
    <pre className="p-2 bg-transparent border-none rounded-none m-0 text-xs">
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
}

function FileView(props: Props) {
  const { files, selectedFile } = props;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (selectedFile) {
      navigator.clipboard.writeText(files[selectedFile].content);
      setCopied(true);
      toast.success("Code Copied");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {selectedFile && files[selectedFile] ? (
        <div className="h-full w-full flex flex-col">
          <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center">
            {/* TODO: Add breadcrums here */}
            <FileBreadCrumb path={selectedFile} />
            <Hint text="copy to clipboard" side="bottom">
              <Button
                variant="outline"
                size="icon"
                className="ml-auto"
                onClick={handleCopy}
                disabled={false}
              >
                {copied ? <CopyCheckIcon /> : <CopyIcon />}
              </Button>
            </Hint>
          </div>
          <div className="flex-1 overflow-auto">
            {/* <CodeView code="const a = 'hello world';" language="ts" /> */}
            <RenderCode
              language={getLanguagefromExtention(selectedFile)}
              code={files[selectedFile].content}
            />
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Select a file to view it's contents
        </div>
      )}
    </>
  );
}

export default FileView;
