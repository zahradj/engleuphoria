
import React from "react";
import { Card } from "@/components/ui/card";
import { FunctionalVideoPanel } from "../video/FunctionalVideoPanel";

interface OneOnOneVideoSectionProps {
  roomId: string;
  currentUserId: string;
  currentUserName: string;
  isTeacher: boolean;
}

export function OneOnOneVideoSection({
  roomId,
  currentUserId,
  currentUserName,
  isTeacher
}: OneOnOneVideoSectionProps) {
  return (
    <Card className="h-full p-4 shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">Video Conference</h3>
      </div>
      
      <div className="h-[calc(100%-40px)]">
        <FunctionalVideoPanel
          roomId={roomId}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          isTeacher={isTeacher}
        />
      </div>
    </Card>
  );
}
