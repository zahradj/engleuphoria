
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
      
      <main className="flex-1 container max-w-8xl mx-auto px-2 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main content area - expanded to take more space */}
          <div className="lg:col-span-10 space-y-6">
            {mainContent}
          </div>
          
          {/* Side content - split into chat and rewards line */}
          <div className="lg:col-span-2 grid grid-cols-12 gap-4 h-[calc(100vh-140px)]">
            <div className="col-span-9">
              {sidebarContent}
            </div>
            <div className="col-span-3 bg-white rounded-lg shadow-sm border">
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
