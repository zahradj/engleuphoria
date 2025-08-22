import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

interface CleanWorkspaceHeaderProps {
  teacherName: string;
}

export const CleanWorkspaceHeader = ({ teacherName }: CleanWorkspaceHeaderProps) => {
  const { open } = useSidebar();

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-md bg-surface/80 border-border/50 shadow-sm">
      <div className="flex h-14 items-center gap-4 px-6">
        <SidebarTrigger className="p-2 hover:bg-muted/70 rounded-lg transition-all duration-200 hover:scale-105" title="Open Menu">
          <Menu className="h-4 w-4 text-text-muted" />
          <span className="sr-only">Toggle Menu</span>
        </SidebarTrigger>
        
        <div className="flex-1">
          <h1 className="text-base font-semibold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {teacherName}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 text-primary font-medium px-3 py-1">
            Teacher
          </Badge>
        </div>
      </div>
    </header>
  );
};