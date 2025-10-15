import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";

interface CleanWorkspaceHeaderProps {
  teacherName: string;
}

export const CleanWorkspaceHeader = ({ teacherName }: CleanWorkspaceHeaderProps) => {
  const { open } = useSidebar();

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 backdrop-blur-lg bg-card/80 shadow-sm">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <SidebarTrigger className="p-2 hover:bg-primary/10 rounded-lg transition-colors" title="Open Menu">
          <Menu className="h-5 w-5 text-muted-foreground hover:text-primary" />
          <span className="sr-only">Toggle Menu</span>
        </SidebarTrigger>
        
        <Logo size="small" className="mx-2" />
        
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {teacherName}
          </h1>
          <p className="text-xs text-muted-foreground hidden md:block">Professional Dashboard</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs border-primary/30 bg-primary/5 text-primary font-semibold">
            Teacher
          </Badge>
        </div>
      </div>
    </header>
  );
};