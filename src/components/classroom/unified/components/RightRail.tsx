import React from "react";
import { VideoTile } from "./VideoTile";
import { ToolButton } from "./ToolButton";
import { Gift, Clock, MessageSquare, Languages } from "lucide-react";

export type RailTool = "rewards" | "chat" | "translator";

interface RightRailProps {
  localStream: MediaStream | null;
  remoteStream?: MediaStream | null;
  isTeacher: boolean;
  isCameraOff?: boolean;
  teacherName: string;
  studentName: string;
  onOpenTool: (tool: RailTool) => void;
}

export function RightRail({
  localStream,
  remoteStream = null,
  isTeacher,
  isCameraOff = false,
  teacherName,
  studentName,
  onOpenTool,
}: RightRailProps) {
  const teacherLabel = teacherName || "Teacher";
  const studentLabel = studentName || "Student";

  // For the right rail, teacher video is always at top, student below
  const topStream = isTeacher ? localStream : remoteStream;
  const bottomStream = isTeacher ? remoteStream : localStream;
  const topIsCameraOff = isTeacher ? isCameraOff : false;
  const bottomIsCameraOff = isTeacher ? false : isCameraOff;

  return (
    <div className="h-full bg-gradient-to-b from-neutral-50/80 to-primary-50/60 border-l border-neutral-200/80 flex flex-col backdrop-blur-sm relative">
      {/* Decorative side accent */}
      <div className="absolute left-0 top-1/4 w-1 h-1/2 bg-gradient-to-b from-primary-300/60 via-accent-300/40 to-primary-300/60 rounded-r-full"></div>
      
      {/* Teacher Video */}
      <div className="p-3 border-b border-neutral-200/60 relative">
        <div className="aspect-video w-full relative">
          {/* Video section label */}
          <div className="absolute -top-1 left-2 bg-primary-100/80 backdrop-blur-sm text-primary-700 text-xs px-2 py-0.5 rounded-md z-10 font-medium">
            Teacher
          </div>
          <VideoTile
            stream={topStream}
            hasVideo={!!topStream}
            isTeacher={true}
            userLabel={teacherLabel}
            isCameraOff={topIsCameraOff}
          />
        </div>
      </div>

      {/* Student Video */}
      <div className="p-3 border-b border-neutral-200/60 relative">
        <div className="aspect-video w-full relative">
          {/* Video section label */}
          <div className="absolute -top-1 left-2 bg-accent-100/80 backdrop-blur-sm text-accent-700 text-xs px-2 py-0.5 rounded-md z-10 font-medium">
            Student
          </div>
          <VideoTile
            stream={bottomStream}
            hasVideo={!!bottomStream}
            isTeacher={false}
            userLabel={studentLabel}
            isCameraOff={bottomIsCameraOff}
          />
        </div>
      </div>

      {/* Tool Buttons */}
      <div className="flex-1 p-4 space-y-3 min-h-0 relative">
        {/* Section header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-200/60 to-transparent"></div>
          <span className="text-xs font-medium text-primary-600/80 uppercase tracking-wider">Tools</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-200/60 to-transparent"></div>
        </div>
        
        {/* Floating decoration */}
        <div className="absolute top-8 right-6 w-1 h-1 bg-primary-300/40 rounded-full animate-pulse-subtle"></div>
        <div className="absolute bottom-12 left-6 w-0.5 h-0.5 bg-accent-300/50 rounded-full animate-pulse-subtle animation-delay-500"></div>
        
        <ToolButton
          icon={<Gift className="h-4 w-4" />}
          label="Rewards"
          onClick={() => onOpenTool("rewards")}
        />
        <ToolButton
          icon={<MessageSquare className="h-4 w-4" />}
          label="Chat"
          onClick={() => onOpenTool("chat")}
        />
        <ToolButton
          icon={<Languages className="h-4 w-4" />}
          label="Translator"
          onClick={() => onOpenTool("translator")}
        />
      </div>
    </div>
  );
}