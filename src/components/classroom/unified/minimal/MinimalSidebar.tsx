import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Gift, Clock, MessageSquare, Sparkles, Disc3, ChevronsLeft, ChevronsRight } from "lucide-react";

export type MinimalTool = "rewards" | "timer" | "chat" | "wheel" | "ai";

interface MinimalSidebarProps {
  side?: "left" | "right";
  collapsedByDefault?: boolean;
  onOpenTool: (tool: MinimalTool) => void;
}

export function MinimalSidebar({ side = "left", collapsedByDefault = true, onOpenTool }: MinimalSidebarProps) {
  const [collapsed, setCollapsed] = useState(collapsedByDefault);

  const commonBtn = "w-10 h-10";
  const containerCls = cn(
    "pointer-events-auto fixed z-30 top-1/4 flex flex-col items-center gap-3 p-2 rounded-xl border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg",
    side === "left" ? "left-4" : "right-4"
  );

  const labelVisible = !collapsed;

  return (
    <aside className={containerCls} aria-label="Classroom tools">
      <Button variant="ghost" size="icon" className={commonBtn} onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand toolbar" : "Collapse toolbar"}>
        {collapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
      </Button>

      <div className="flex flex-col items-center gap-2">
        <ToolButton icon={<Gift className="h-5 w-5" />} label="Rewards" showLabel={labelVisible} onClick={() => onOpenTool("rewards")} />
        <ToolButton icon={<Clock className="h-5 w-5" />} label="Timer" showLabel={labelVisible} onClick={() => onOpenTool("timer")} />
        <ToolButton icon={<MessageSquare className="h-5 w-5" />} label="Chat" showLabel={labelVisible} onClick={() => onOpenTool("chat")} />
        <ToolButton icon={<Disc3 className="h-5 w-5" />} label="Wheel" showLabel={labelVisible} onClick={() => onOpenTool("wheel")} />
        <ToolButton icon={<Sparkles className="h-5 w-5" />} label="AI" showLabel={labelVisible} onClick={() => onOpenTool("ai")} />
      </div>
    </aside>
  );
}

function ToolButton({ icon, label, showLabel, onClick }: { icon: React.ReactNode; label: string; showLabel: boolean; onClick: () => void }) {
  return (
    <Button variant="outline" size="icon" className="w-10 h-10" onClick={onClick} title={label} aria-label={label}>
      {icon}
      {showLabel && <span className="ml-2 text-xs text-muted-foreground hidden">{label}</span>}
    </Button>
  );
}
