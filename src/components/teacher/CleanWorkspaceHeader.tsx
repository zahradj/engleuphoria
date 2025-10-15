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
    <header className="sticky top-0 z-40 border-b border-purple-200/50 backdrop-blur-lg bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 shadow-md">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <SidebarTrigger className="p-2 hover:bg-purple-100/50 rounded-lg transition-colors" title="Open Menu">
          <Menu className="h-5 w-5 text-purple-600 hover:text-purple-700" />
          <span className="sr-only">Toggle Menu</span>
        </SidebarTrigger>
        
        <div className="relative">
          <Logo size="small" className="mx-2" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse" />
        </div>
        
        <div className="flex-1">
          <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
            👋 {teacherName}
          </h1>
          <p className="text-xs text-purple-600/70 font-medium hidden md:block">Professional Dashboard ✨</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs border-purple-400/50 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold shadow-sm">
            👨‍🏫 Teacher
          </Badge>
        </div>
      </div>
    </header>
  );
};