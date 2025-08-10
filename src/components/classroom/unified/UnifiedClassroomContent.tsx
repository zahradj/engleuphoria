
import React from "react";
import { UnifiedCenterPanel } from "./UnifiedCenterPanel";
import { useUnifiedClassroomContext } from "./UnifiedClassroomProvider";
import { TwoUpVideo } from "./TwoUpVideo";
import { MinimalTopBar } from "./MinimalTopBar";

interface ClassroomState {
  activeRightTab: string;
  activeCenterTab: string;
  studentXP: number;
  showRewardPopup: boolean;
  setActiveRightTab: (tab: string) => void;
  setActiveCenterTab: (tab: string) => void;
  awardPoints: (points: number, reason?: string) => void;
}

interface UnifiedClassroomContentProps {
  classroomState: ClassroomState;
  enhancedClassroom: any;
}

export function UnifiedClassroomContent({ 
  classroomState, 
  enhancedClassroom 
}: UnifiedClassroomContentProps) {
  const { currentUser } = useUnifiedClassroomContext();
  
  const {
    activeCenterTab,
    studentXP,
    setActiveCenterTab
  } = classroomState;

  return (
    <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
      <MinimalTopBar currentUser={currentUser} studentXP={studentXP} />

      <main className="px-2 sm:px-4 pb-2 sm:pb-4">
        <h1 className="sr-only">Live Classroom - Lesson and Video</h1>

        {/* Mobile Layout - Video first, then lesson */}
        <div className="block lg:hidden space-y-4">
          <section className="h-64 sm:h-80">
            <TwoUpVideo currentUser={currentUser} />
          </section>

          <section className="min-h-[28rem]">
            <UnifiedCenterPanel
              activeCenterTab={activeCenterTab}
              onTabChange={setActiveCenterTab}
              currentUser={currentUser}
            />
          </section>
        </div>

        {/* Desktop Layout - Two column: Lesson (8) + Video (4) */}
        <div className="hidden lg:grid grid-cols-12 gap-4 h-[calc(100vh-6rem)]">
          <section className="col-span-8 min-h-0">
            <UnifiedCenterPanel
              activeCenterTab={activeCenterTab}
              onTabChange={setActiveCenterTab}
              currentUser={currentUser}
            />
          </section>

          <aside className="col-span-4 min-h-0">
            <div className="sticky top-4 h-[calc(100vh-8rem)]">
              <TwoUpVideo currentUser={currentUser} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
