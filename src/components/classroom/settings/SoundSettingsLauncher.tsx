import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, X } from "lucide-react";
import { SoundSettings } from "./SoundSettings";

/**
 * Floating launcher that opens the Sound Settings test panel.
 * Lives bottom-left so it never collides with the bottom-right reward toast.
 */
export function SoundSettingsLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-[95] flex flex-col items-start gap-2">
      {open && <SoundSettings />}
      <Button
        size="icon"
        variant={open ? "secondary" : "outline"}
        className="rounded-full shadow-lg backdrop-blur bg-background/80"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close sound settings" : "Open sound settings"}
        title="Sound Settings"
      >
        {open ? <X className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </Button>
    </div>
  );
}
