
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
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-3 space-y-6">
            {mainContent}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {sidebarContent}
          </div>
        </div>
      </main>
    </div>
  );
}
