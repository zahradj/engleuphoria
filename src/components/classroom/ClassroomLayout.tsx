
import { ReactNode } from "react";
import { StudentHeader } from "@/components/StudentHeader";
import { StarRewardsLine } from "@/components/classroom/StarRewardsLine";

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
  // Define reward milestones (star levels)
  const rewardMilestones = [100, 250, 500, 1000, 2000];
  
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <StudentHeader studentName={studentName} points={points} />
      
      <main className="flex-1 container mx-auto py-4 px-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main content area - optimized for better fit */}
          <div className="lg:col-span-9 w-full flex flex-col items-center">
            {mainContent}
          </div>
          
          {/* Side content - split into chat and rewards line */}
          <div className="lg:col-span-3 grid grid-cols-12 gap-2 h-[calc(100vh-140px)]">
            <div className="col-span-10 lg:col-span-9">
              {sidebarContent}
            </div>
            <div className="col-span-2 lg:col-span-3 bg-white rounded-lg shadow-sm border">
              <StarRewardsLine 
                points={points} 
                milestones={rewardMilestones} 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
