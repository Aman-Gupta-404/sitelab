import { ErrorType, Message, Project } from "@/types/common.types";
import { useEffect, useRef } from "react";
import MessageCard from "@/features/project/components/MessageCard";
import MessageForm from "@/features/project/components/MessageForm";
import MessageLoading from "@/features/project/components/MessageLoading";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Props {
  loading: boolean;
  messages: Message[];
  fetchProject: () => void;
  project: Project | ErrorType | null;
  messageStatus: "processing" | "complete" | "error" | "idle";
}

export function ChatPanelSkeleton() {
  return (
    <div className="flex h-full flex-col bg-[#0B0F1A]">
      {/* Messages */}
      <div className="flex-1 space-y-6 overflow-hidden p-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
          >
            <Skeleton
              className={`h-20 rounded-xl ${i % 2 === 0 ? "w-3/5" : "w-2/5"}`}
            />
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    </div>
  );
}

function ChatPanel(props: Props) {
  const { messages, messageStatus, fetchProject, loading, project } = props;
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const limitExceeded =
    (project && "totalPrompts" in project ? project.totalPrompts : 1) >= 3;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return loading ? (
    <ChatPanelSkeleton />
  ) : (
    <article className="relative flex h-full min-h-0 flex-col bg-[#0B0F1A]">
      {/* all messages */}
      <div
        className={cn(
          "flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar",
          limitExceeded ? "pb-62" : "pb-42",
        )}
      >
        {messages.map((msg) => (
          <MessageCard message={msg} key={msg._id + "1"} />
        ))}
        {messageStatus === "processing" ? (
          <MessageLoading />
        ) : messageStatus === "error" ? (
          <></>
        ) : null}

        <div ref={bottomRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <div className="pointer-events-none absolute -top-8 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-[#0B0F1A]" />
        <MessageForm
          totalPrompts={
            project && "totalPrompts" in project ? project.totalPrompts : 1
          }
          onAddPrompt={fetchProject}
          loading={messageStatus === "processing"}
        />
      </div>
    </article>
  );
}

export default ChatPanel;
