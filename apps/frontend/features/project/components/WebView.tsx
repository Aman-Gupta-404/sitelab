import Hint from "@/components/shared/Hint";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
  url: string | null;
}

function WebView(props: Props) {
  const [copied, setCopied] = useState(false);
  const [fragmentKey, setFragmentKey] = useState(0);

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1);
  };

  const handleCopy = () => {
    if (props.url) {
      navigator.clipboard.writeText(props.url);
      setCopied(true);
      toast.success("URL Copied");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!props.url) {
    return (
      <div className="flex flex-col w-full h-full">
        <p>No Project View</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className={"p-2 border-b bg-sidebar flex items-center gap-x-2"}>
        <Hint text="Refresh" side="bottom" align="start">
          <Button size="sm" variant="outline" onClick={onRefresh}>
            <RefreshCcwIcon />
          </Button>
        </Hint>

        <Hint text="Click to copy" side="bottom">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            disabled={!props.url || copied}
            className="flex-1 justify-start text-start font-normal"
          >
            <span className="truncate">{props.url}</span>
          </Button>
        </Hint>

        <Hint text="Open in a new tab" side="bottom" align="start">
          <Button
            size="sm"
            disabled={!props.url}
            variant="outline"
            onClick={() => {
              if (!props.url) return;
              window.open(props.url, "_blank");
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>
      <iframe
        key={fragmentKey}
        className="h-full w-full"
        sandbox="allow-forms allow-scripts allow-same-origin"
        loading="lazy"
        src={props.url}
      />
    </div>
  );
}

export default WebView;
