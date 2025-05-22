
import { ReactNode } from "react";
import { StudentHeader } from "@/components/StudentHeader";

interface ClassroomLayoutProps {
  studentName: string;
  points: number;
  mainContent: ReactNode;
  sidebarContent: ReactNode;
}

export function ClassroomLayout({
  studentName,
  points,
  mainContent,
  sidebarContent,
}: ClassroomLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <StudentHeader studentName={studentName} points={points} />
      
      <main className="flex-1 container max-w-8xl mx-auto px-2 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          {/* Main content area - expanded to take more space */}
          <div className="lg:col-span-5 space-y-6">
            {mainContent}
          </div>
          
          {/* Sidebar - reduced to take less space */}
          <div className="lg:col-span-1">
            {sidebarContent}
          </div>
        </div>
      </main>
    </div>
  );
}
