import React from "react";
import { format } from "date-fns";

import { Card } from "@/components/ui/card";
import { Message } from "@/types/common.types";

interface Props {
  message: Message;
}

function MessageCard({ message }: Props) {
  const isUser = message.role === "user";

  const formatMessage = (response: string) => {
    const formatted = response.replace(/<\/?task_summary>/g, "").trim();

    return formatted;
  };

  return (
    <div
      key={message._id}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <Card
        className={`max-w-[80%] px-4 py-3 border border-white/10 ${
          isUser ? "bg-[#7C5CFF] text-white" : "bg-[#141A2A] text-white"
        }`}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-words ">
          {formatMessage(message.content)}
        </div>

        <div className="text-[10px] mt-2 text-white/60 text-right">
          {format(new Date(message.createdAt), "hh:mm a")}
        </div>
      </Card>
    </div>
  );
}

export default MessageCard;
