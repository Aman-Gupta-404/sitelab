"use client";

import { z } from "zod";
import { toast } from "sonner";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PROJECT_TEMPLATES } from "../constats";
import { projectsApi } from "@/apis/projects/projects.api";

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Value is required" })
    .max(10000, { message: "Value is too long" }),
});

const MAX_WORDS = 20;

export const ProjectForm = () => {
  const [input, setInput] = useState(
    "Make a sinlge component with blue square",
  );
  const [isFocused, setIsFocused] = useState(false);

  // typewriter effect states
  const [isPending, setIsPending] = useState(false);
  const [placeholder, setPlaceholder] = useState("");

  const router = useRouter();
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
    if (isWordLimitExceeded) {
      toast.error(`Maximum ${MAX_WORDS} words allowed`);
      return;
    }
    try {
      setIsPending(true);
      const res = await projectsApi.sendPrompt({ content: input });

      if (res.status === 201) {
        // navigate user to the project page
        router.push(`/${res.data.name}`);
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong, please try again");
    } finally {
      setIsPending(false);
    }
  };

  const onTemplateSelect = (val: string) => {
    setInput(val);
  };

  return (
    <section className="space-y-6">
      <form
        className={cn(
          "relative border border-black/15 p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
          isFocused && "shadow-xs",
        )}
      >
        <TextareaAutosize
          disabled={isPending}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          minRows={2}
          maxRows={8}
          className="pt-4 resize-none border-none w-full outline-none bg-transparent"
          value={input}
          onChange={handleInputChange}
          placeholder={placeholder}
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
            disabled={isPending || isWordLimitExceeded}
            className={cn(
              "size-8 rounded-full",
              isPending && "bg-muted-foreground border",
            )}
            onClick={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <ArrowUpIcon />
            )}
          </Button>
        </div>
      </form>
      <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl">
        {PROJECT_TEMPLATES.map((template) => (
          <Button
            key={template.title}
            variant="outline"
            size="sm"
            className="bg-white dark:bg-sidebar border-black/20 cursor-pointer"
            onClick={() => onTemplateSelect(template.prompt)}
          >
            {template.emoji} {template.title}
          </Button>
        ))}
      </div>
    </section>
  );
};
