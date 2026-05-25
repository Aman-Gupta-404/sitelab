"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import UserControl from "./UserControl";

function Navbar() {
  return (
    <nav className="p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent">
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
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
