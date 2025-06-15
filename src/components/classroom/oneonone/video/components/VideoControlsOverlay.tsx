
import React from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, Sparkles } from "lucide-react";
import { ReportIssueDropdown } from "../../ReportIssueDropdown";
import { IssueType } from "../types";

interface Props {
  media: any;
  lessonStarted: boolean;
  onReportIssue: (issue: IssueType) => void;
}

export function VideoControlsOverlay({ media, lessonStarted, onReportIssue }: Props) {
  if (!lessonStarted) return null;
  return (
    <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
      <Button
        variant={media.isMuted ? "destructive" : "outline"}
        size="icon"
        onClick={media.toggleMicrophone}
      >
        {media.isMuted ? <MicOff size={18} /> : <Mic size={18} />}
      </Button>
      <Button
        variant={media.isCameraOff ? "destructive" : "outline"}
        size="icon"
        onClick={media.toggleCamera}
      >
        {media.isCameraOff ? <VideoOff size={18} /> : <Video size={18} />}
      </Button>
      <Button
        variant={media.isConnected ? "destructive" : "outline"}
        size="icon"
        onClick={media.isConnected ? media.leave : media.join}
      >
        {media.isConnected ? (
          <span className="text-xs" title="Disconnect">⏻</span>
        ) : (
          <span className="text-xs" title="Connect">▶️</span>
        )}
      </Button>
      <ReportIssueDropdown onReport={onReportIssue} />
    </div>
  );
}
