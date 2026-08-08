"use client";

import { z } from "zod";
import { toast } from "sonner";
import { ChangeEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { AlertTriangle, ArrowUpIcon, Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { projectsApi } from "@/apis/projects/projects.api";

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Value is required" })
    .max(10000, { message: "Value is too long" }),
});

interface Props {
  onAddPrompt: () => void;
  loading: boolean;
  totalPrompts: number;
}

const MAX_WORDS = 20;

function MessageForm(props: Props) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [limitExceeded, setLimitExceeded] = useState(false);

  const params = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const countWords = (text: string) => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  };

  const wordCount = countWords(input);
  const isWordLimitExceeded = wordCount > MAX_WORDS;

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (countWords(value) <= MAX_WORDS) {
      setInput(value);
    } else {
      toast.warning("Maximum word limit exceeded");
    }
  };

  const handleSend = async () => {
    const projectSlug = params.slug as string;

    if (!projectSlug) {
      toast.error("Project not found!");
      return;
    }
    if (isWordLimitExceeded) {
      toast.error(`Maximum ${MAX_WORDS} words allowed`);
      return;
    }
    try {
      setIsPending(true);
      const res = await projectsApi.sendPrompt({
        content: input,
        projectSlug: projectSlug || "",
      });
      if (res.status === 201) {
        // re-fetch the project
        props.onAddPrompt();
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong, please try again");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="border-t border-white/10 bg-[#0B0F1A] p-3">
      {props.totalPrompts >= 3 && (
        <div className="mx-2 my-2 flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Prompt limit exceeded. Upgrade your plan to continue creating
            prompts.
          </span>
        </div>
      )}
      <form
        // onSubmit={form.handleSubmit(handleSend)}
        className={cn(
          "relative border border-white/10 p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all bg-[#141A2A]",
          isFocused && "shadow-xs",
        )}
      >
        <TextareaAutosize
          disabled={isPending || props.loading || props.totalPrompts >= 3}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          minRows={2}
          maxRows={8}
          className="pt-4 resize-none border-none w-full outline-none text-white bg-transparent"
          value={input}
          onChange={handleInputChange}
          placeholder="enter your prompt..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <div className="flex items-end justify-between pt-2">
          <div className="flex flex-col gap-1">
            <div className="text-[10px] text-muted-foreground font-mono">
              <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px]">
                <span>&#8984;</span>Enter
              </kbd>{" "}
              to submit
            </div>

            <p
              className={cn(
                "text-xs",
                wordCount > MAX_WORDS
                  ? "text-destructive"
                  : wordCount > MAX_WORDS * 0.8
                    ? "text-yellow-500"
                    : "text-muted-foreground",
              )}
            >
              {wordCount}/{MAX_WORDS} words
            </p>
          </div>

          <Button
            disabled={
              isPending || isWordLimitExceeded || props.totalPrompts >= 3
            }
            className={cn(
              "size-8 rounded-full",
              isPending && "bg-muted-foreground border",
            )}
            onClick={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            {isPending || props.loading ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <ArrowUpIcon />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default MessageForm;
