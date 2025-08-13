import React from "react";
import { VideoTile } from "./VideoTile";
import { ToolButton } from "./ToolButton";
import { Gift, Clock, MessageSquare, Sparkles } from "lucide-react";

export type RailTool = "rewards" | "timer" | "chat" | "ai";

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
    <div className="h-full bg-background border-l border-border flex flex-col">
      {/* Teacher Video */}
      <div className="p-3 border-b border-border">
        <div className="aspect-[5/6] w-full">
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
      <div className="p-3 border-b border-border">
        <div className="aspect-[5/6] w-full">
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
      <div className="flex-1 p-3 space-y-3 min-h-0">
        <ToolButton
          icon={<Gift className="h-4 w-4" />}
          label="Rewards"
          onClick={() => onOpenTool("rewards")}
        />
        <ToolButton
          icon={<Clock className="h-4 w-4" />}
          label="Timer"
          onClick={() => onOpenTool("timer")}
        />
        <ToolButton
          icon={<MessageSquare className="h-4 w-4" />}
          label="Chat"
          onClick={() => onOpenTool("chat")}
        />
        <ToolButton
          icon={<Sparkles className="h-4 w-4" />}
          label="AI"
          onClick={() => onOpenTool("ai")}
        />
      </div>
    </div>
  );
}