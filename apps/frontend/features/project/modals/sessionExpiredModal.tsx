"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock3, RotateCcw, Sparkles } from "lucide-react";

interface SessionExpiredModalProps {
  open: boolean;
  //   onOpenChange: (open: boolean) => void;
  onOpenChange: any;
  //   onStartNewSession?: () => void;
  //   onUpgrade?: () => void;
}

export function SessionExpiredModal({
  open,
  onOpenChange,
  //   onStartNewSession,
  //   onUpgrade,
}: SessionExpiredModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border bg-muted">
            <Clock3 className="size-5 text-muted-foreground" />
          </div>

          <DialogTitle className="text-xl">
            Your session has expired
          </DialogTitle>

          <DialogDescription className="pt-1 leading-relaxed">
            Your free sandbox session has reached its 20-minute limit. Your
            project is safe, but the current sandbox is no longer running.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 rounded-lg border bg-muted/40 p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div className="space-y-1">
              <p className="text-sm font-medium">
                Session restart is coming soon
              </p>

              <p className="text-xs leading-relaxed text-muted-foreground">
                We&apos;re working on making it possible to restart your sandbox
                and continue where you left off.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2 sm:justify-center">
          <Button
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // TODO: this is with restart session CTA
  //   return (
  //     <Dialog open={open} onOpenChange={onOpenChange}>
  //       <DialogContent className="sm:max-w-md">
  //         <DialogHeader className="text-center sm:text-center">
  //           <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full border bg-muted">
  //             <Clock3 className="size-6 text-muted-foreground" />
  //           </div>

  //           <DialogTitle className="text-xl">
  //             Your session has expired
  //           </DialogTitle>

  //           <DialogDescription className="pt-1 text-sm leading-relaxed">
  //             Your free sandbox session has reached its 20-minute limit. Your
  //             current sandbox is no longer running.
  //           </DialogDescription>
  //         </DialogHeader>

  //         <div className="rounded-lg border bg-muted/50 p-4">
  //           <div className="flex items-start gap-3">
  //             <RotateCcw className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

  //             <div className="space-y-1">
  //               <p className="text-sm font-medium">Start a new session</p>
  //               <p className="text-xs leading-relaxed text-muted-foreground">
  //                 Restart the sandbox to continue working on your project.
  //               </p>
  //             </div>
  //           </div>
  //         </div>

  //         <DialogFooter className="flex-col gap-2 sm:flex-col">
  //           <Button className="w-full" onClick={onStartNewSession}>
  //             <RotateCcw className="size-4" />
  //             Start new session
  //           </Button>

  //           <Button variant="ghost" className="w-full" onClick={onUpgrade}>
  //             <Sparkles className="size-4" />
  //             Upgrade for longer sessions
  //           </Button>
  //         </DialogFooter>
  //       </DialogContent>
  //     </Dialog>
  //   );
}
