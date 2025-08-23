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
    <header className="sticky top-0 z-40 border-b backdrop-blur-md bg-card/80 border-border shadow-sm">
      <div className="flex h-14 items-center gap-4 px-6">
        <SidebarTrigger className="p-2 hover:bg-muted rounded-lg transition-colors" title="Open Menu">
          <Menu className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Toggle Menu</span>
        </SidebarTrigger>
        
        <div className="flex-1">
          <h1 className="text-base font-semibold text-foreground">
            {teacherName}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
            Teacher
          </Badge>
        </div>
      </div>
    </header>
  );
};