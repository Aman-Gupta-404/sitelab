"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, useForm } from "react-hook-form";

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Value is required" })
    .max(10000, { message: "Value is too long" }),
});

interface Props {
  projectId: string;
}

function MessageForm() {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const handleSend = () => {
    console.log("Input: ", input);
  };

  // <Form {...form}>
  {
    /* {showUsage && (
    <Usage points={usage.remainingPoints} msBeforeNext={usage.msBeforeNext} />
  )} */
  }
  return (
    <div className="absolute bottom-0 left-0 w-full  border-white/10 bg-[#0B0F1A] p-3">
      <form
        onSubmit={form.handleSubmit(handleSend)}
        className={cn(
          "relative border border-white/10 p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all bg-[#141A2A]",
          isFocused && "shadow-xs",
          // showUsage && "rounded-t-none",
        )}
      >
        <TextareaAutosize
          disabled={isPending}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          minRows={2}
          maxRows={8}
          className="pt-4 resize-none border-none w-full outline-none text-white bg-transparent"
          //
          placeholder="What would you like to build?"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              form.handleSubmit(handleSend)(e);
            }
          }}
        />
        <div className="flex gap-x-2 items-end justify-between pt-2">
          <div className="text-[10px] text-muted-foreground font-mono">
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span>&#8984;</span>Enter
            </kbd>
            &nbsp;to submit
          </div>
          <Button
            disabled={isPending}
            className={cn(
              "size-8 rounded-full",
              isPending && "bg-muted-foreground border",
            )}
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <ArrowUpIcon />
            )}
          </Button>
        </div>
      </form>
    </div>
  );

  // return (
  //   <div className="absolute bottom-0 left-0 w-full border-t border-white/10 bg-[#0B0F1A] p-3">
  //     <div className="max-w-3xl mx-auto flex gap-2">
  //       <Input
  //         value={input}
  //         onChange={(e) => setInput(e.target.value)}
  //         placeholder="Type your message..."
  //         className="bg-[#141A2A] border border-white/10 text-white"
  //         onKeyDown={(e) => {
  //           if (e.key === "Enter") handleSend();
  //         }}
  //       />
  //       <Button
  //         onClick={handleSend}
  //         className="bg-[#7C5CFF] hover:bg-[#9B85FF] text-white"
  //       >
  //         Send
  //       </Button>
  //     </div>
  //   </div>
  // );
}

export default MessageForm;
