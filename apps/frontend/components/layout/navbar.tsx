"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import UserControl from "./UserControl";
import useScroll from "@/hooks/useScroll";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";

function Navbar() {
  const isScrolled = useScroll();

  return (
    <nav
      className={cn(
        "h-15 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent",
        "flex justify-center align-center",
        isScrolled && "bg-background border-border",
      )}
    >
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center m-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image src={"logo.svg"} alt="logo" width={24} height={24} />
          <span className="font-semibold text-lg">Sitelab</span>
        </Link>
        <Show when={"signed-out"}>
          <div className="flex gap-2">
            <SignUpButton>
              <Button variant="outline" size="sm">
                Sign up
              </Button>
            </SignUpButton>
            <SignInButton>
              <Button size="sm">Sign in</Button>
            </SignInButton>
          </div>
        </Show>
        <Show when={"signed-in"}>
          <UserControl showName={false} />
        </Show>
      </div>
    </nav>
  );
}

export default Navbar;
