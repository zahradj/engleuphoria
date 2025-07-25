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
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4">
        <SidebarTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="p-2 hover:bg-accent"
            title="Open Menu"
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SidebarTrigger>
        
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-sm font-semibold text-foreground">
                Welcome back, {teacherName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  🔒 Clean Workspace Mode
                </Badge>
                <span className="text-xs text-muted-foreground">
                  ☰ Click menu to access tools
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs hidden sm:inline-flex">
            Teacher
          </Badge>
        </div>
      </div>
    </header>
  );
};