"use client";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Rocket } from "lucide-react";

interface UpgradeComingSoonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpgradeComingSoonModal({
  open,
  onOpenChange,
}: UpgradeComingSoonModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Rocket className="h-8 w-8 text-primary" />
        </div>

        <DialogHeader className="space-y-3 text-center">
          <div className="flex justify-center">
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-xs"
            >
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Coming Soon
            </Badge>
          </div>

          <DialogTitle className="text-2xl font-bold">
            Upgrades are on the way 🚀
          </DialogTitle>

          <DialogDescription className="text-sm leading-6">
            We're building premium plans packed with more powerful AI features,
            higher limits, and productivity tools.
            <br />
            <br />
            This feature isn't available just yet, but we're working hard to
            bring it to you soon.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-4">
          <h4 className="mb-3 font-medium">Planned benefits include:</h4>

          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✨ Higher AI usage limits</li>
            <li>⚡ Faster generations</li>
            <li>📁 More projects & storage</li>
            <li>🧠 Access to premium AI models</li>
          </ul>
        </div>

        <DialogFooter>
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
