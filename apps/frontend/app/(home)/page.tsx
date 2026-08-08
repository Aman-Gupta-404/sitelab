"use client";

import { Show } from "@clerk/nextjs";
import PromptPage from "@/features/home/sections/PromptPage";
import LandingHero from "@/features/home/sections/LandingPage";

function page() {
  return (
    <>
      <Show when={"signed-out"}>
        <LandingHero />
      </Show>
      <Show when={"signed-in"}>
        <PromptPage />
      </Show>
    </>
  );
}

export default page;
