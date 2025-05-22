
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-muted/10 to-muted/30">
      <StudentHeader studentName={studentName} points={points} />
      
      <main className="flex-1 container mx-auto py-4 px-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Main content area - optimized for better fit */}
          <div className="lg:col-span-9 w-full">
            {mainContent}
          </div>
          
          {/* Sidebar with rewards line integrated */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border p-3">
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-700">Rewards Progress</h3>
                <StarRewardsLine 
                  points={points} 
                  milestones={rewardMilestones} 
                />
              </div>
              {sidebarContent}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
