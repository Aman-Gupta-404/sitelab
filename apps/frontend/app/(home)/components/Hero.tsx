"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { projectsApi } from "@/apis/projects/projects.api";
import { Textarea } from "@/components/ui/textarea";

const PROMPTS = [
  "Build a SaaS dashboard with auth, billing, and analytics",
  "Create a real-time chat app with WebSockets and Redis",
  "Generate a Next.js blog with markdown and SEO optimization",
];

function Hero() {
  const [prompt, setPrompt] = useState("");
  const [display, setDisplay] = useState("");
  const [pIndex, setPIndex] = useState(0);
  const [typing, setTyping] = useState(true);

  const idxRef = useRef(0);

  const router = useRouter();

  const handleSendPrompt = async () => {
    try {
      const res = await projectsApi.sendPrompt({ content: prompt });
      console.log({ res, s: res.status });
      if (res.status === 201) {
        // navigate user to the project page
        router.push(`/${res.data.name}`);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  // Typewriter effect
  useEffect(() => {
    const current = PROMPTS[pIndex];
    let timeout: NodeJS.Timeout;

    if (typing) {
      if (idxRef.current < current.length) {
        timeout = setTimeout(() => {
          idxRef.current += 1;
          setDisplay(current.slice(0, idxRef.current));
        }, 40);
      } else {
        timeout = setTimeout(() => setTyping(false), 1200);
      }
    } else {
      if (idxRef.current > 0) {
        timeout = setTimeout(() => {
          idxRef.current -= 1;
          setDisplay(current.slice(0, idxRef.current));
        }, 20);
      } else {
        // move to next prompt and reset
        setTyping(true);
        setPIndex((prev) => (prev + 1) % PROMPTS.length);
        idxRef.current = 0;
        setDisplay("");
      }
    }

    return () => clearTimeout(timeout);
  }, [typing, pIndex]);

  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4 sm:px-6 py-20 sm:py-28 gap-5 sm:gap-6">
      <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold max-w-3xl leading-tight">
        Build Anything with AI
      </h2>
      <p className="text-white/70 max-w-lg text-sm sm:text-base">
        Describe your idea and generate full-stack apps instantly.
      </p>

      {/* Prompt */}
      <div className="w-full max-w-2xl relative">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px] sm:min-h-[140px] pr-20 sm:pr-28 text-sm sm:text-base bg-[#141A2A] border border-white/10 focus:border-[#7C5CFF]"
        />

        {!prompt && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 text-white/40 text-sm sm:text-base pointer-events-none">
            {display}
            <span className="animate-pulse">|</span>
          </div>
        )}

        <Button
          onClick={handleSendPrompt}
          size="sm"
          className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-[#7C5CFF] hover:bg-[#9B85FF] text-white"
        >
          Run
        </Button>
      </div>
    </section>
  );
}

export default Hero;
