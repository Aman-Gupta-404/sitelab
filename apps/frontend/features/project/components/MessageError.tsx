import { Card } from "@/components/ui/card";
import React from "react";

function MessageError() {
  return (
    <div className={"flex w-full justify-start"}>
      <Card className={"max-w-[80%] px-4 py-3 bg-surface border"}>
        <div className="flex items-center gap-2 opacity-70 text-red-500 font-bold">
          Error occured in fetching the data
        </div>

        {/* <div className="text-[10px] mt-2 text-white/60 text-right">
          {format(new Date(message.createdAt), "hh:mm a")}
        </div> */}
      </Card>
    </div>
  );
}

export default MessageError;
