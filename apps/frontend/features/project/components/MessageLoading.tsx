"use client";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

import { Card } from "@/components/ui/card";

const MESSAGES = [
  "processing your request",
  "Updating project files",
  "Optimizing your builds",
];

function MessageLoading() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx(Math.floor(Math.random() * MESSAGES.length));
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    console.log({ msgIdx });
  }, [msgIdx]);

  return (
    <div className={"flex w-full justify-start"}>
      <Card className={"max-w-[80%] px-4 py-3 bg-surface text-white"}>
        <div className="flex items-center gap-2 opacity-70">
          <LoaderCircle className="animate-spin w-5 h-5" />
          <p>{MESSAGES[msgIdx]}</p>
        </div>
      </Card>
    </div>
  );
}

export default MessageLoading;
