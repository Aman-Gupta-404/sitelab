"use client";

import { z } from "zod";
import { toast } from "sonner";
import { KeyboardEvent, MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PROJECT_TEMPLATES } from "../constats";
import { projectsApi } from "@/apis/projects/projects.api";

const PROMPTS = [
  "Build a SaaS dashboard with auth, billing, and analytics",
  "Create a real-time chat app with WebSockets and Redis",
  "Generate a Next.js blog with markdown and SEO optimization",
];

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Value is required" })
    .max(10000, { message: "Value is too long" }),
});

export const ProjectForm = () => {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // typewriter effect states
  const [charIndex, setCharIndex] = useState(0);
  const [promptIndex, setPromptIndex] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const handleSend = async () => {
    try {
      console.log("here 1");
      const res = await projectsApi.sendPrompt({ content: input });
      console.log({ res, s: res.status });
      if (res.status === 201) {
        // navigate user to the project page
        router.push(`/${res.data.name}`);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const onTemplateSelect = (val: string) => {
    setInput(val);
  };

  //   useEffect(() => {
  //     const currentPrompt = PROMPTS[promptIndex];

  //     const timeout = setTimeout(
  //       () => {
  //         if (!isDeleting) {
  //           // Typing
  //           setPlaceholder(currentPrompt.slice(0, charIndex + 1));
  //           setCharIndex((prev) => prev + 1);

  //           // Finished typing
  //           if (charIndex === currentPrompt.length) {
  //             setTimeout(() => {
  //               setIsDeleting(true);
  //             }, 1200);
  //           }
  //         } else {
  //           // Deleting
  //           setPlaceholder(currentPrompt.slice(0, charIndex - 1));
  //           setCharIndex((prev) => prev - 1);

  //           // Finished deleting
  //           if (charIndex === 0) {
  //             setIsDeleting(false);
  //             setPromptIndex((prev) => (prev + 1) % PROMPTS.length);
  //           }
  //         }
  //       },
  //       isDeleting ? 40 : 80,
  //     );

  //     return () => clearTimeout(timeout);
  //   }, [charIndex, isDeleting, promptIndex]);

  return (
    <section className="space-y-6">
      <form
        className={cn(
          "relative border border-black/15 p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
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
          className="pt-4 resize-none border-none w-full outline-none bg-transparent"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              handleSend();
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
            onClick={(e) => {
              e.preventDefault();
              handleSend();
            }}
            variant="outline"
            className={cn(
              "size-8 rounded-full cursor-pointer ",
              //   isPending && "bg-muted-foreground border",
            )}
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <ArrowUpIcon className="text-black" />
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
