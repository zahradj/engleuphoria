
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
  console.log("OneOnOneVideoSection rendering with props:", { roomId, currentUserId, currentUserName, isTeacher });
  
  try {
    return (
      <Card className="h-full shadow-lg overflow-hidden">
        <div className="p-3 border-b bg-gradient-to-r from-blue-50 to-green-50">
          <h3 className="font-semibold text-gray-700 text-sm">Video Conference</h3>
          <p className="text-xs text-gray-500 mt-1">
            {isTeacher ? "Teacher View" : "Student View"}
          </p>
        </div>
        
        <div className="h-[calc(100%-60px)]">
          <FunctionalVideoPanel
            roomId={roomId}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            isTeacher={isTeacher}
          />
        </div>
      </Card>
    );
  } catch (error) {
    console.error("Error in OneOnOneVideoSection:", error);
    return (
      <Card className="h-full shadow-lg flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="font-medium">Video section failed to load</p>
          <p className="text-sm mt-1">Please refresh the page</p>
        </div>
      </Card>
    );
  }
}
