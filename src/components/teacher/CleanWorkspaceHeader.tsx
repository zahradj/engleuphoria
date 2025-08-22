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
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="flex h-12 items-center gap-4 px-4">
        <SidebarTrigger className="p-2 hover:bg-muted rounded-md transition-colors" title="Open Menu">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle Menu</span>
        </SidebarTrigger>
        
        <div className="flex-1">
          <h1 className="text-sm font-medium text-foreground">
            {teacherName}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20 text-primary">
            Teacher
          </Badge>
        </div>
      </div>
    </header>
  );
};