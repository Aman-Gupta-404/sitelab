import { Card } from "@/components/ui/card";
import { Message } from "@/types/common.types";
import React, { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import MessageCard from "@/features/project/components/MessageCard";
import MessageForm from "@/features/project/components/MessageForm";
import MessageError from "@/features/project/components/MessageError";
import MessageLoading from "@/features/project/components/MessageLoading";

interface Props {
  messages: Message[];
  messageStatus: "processing" | "complete" | "error" | "idle";
}

function ChatPanel(props: Props) {
  const { messages, messageStatus } = props;
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <article className="h-screen w-full bg-[#0B0F1A] relative">
      {/* all messages */}
      <div className="h-full overflow-y-auto p-4 pb-24 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <MessageCard message={msg} key={msg._id + "1"} />
        ))}
        {messageStatus === "processing" ? (
          <MessageLoading />
        ) : messageStatus === "error" ? (
          <MessageError />
        ) : null}

        <div ref={bottomRef} />
      </div>

      {/* Input Form */}
      <div className="absolute -top-6 left-0 right-0 h-6 bg-linear-to-b from-transparent to-background pointer-events-none" />
      <MessageForm />
    </article>
  );
}

export default ChatPanel;
