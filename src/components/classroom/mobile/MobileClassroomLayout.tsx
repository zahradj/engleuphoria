import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  MessageSquare,
  Users,
  PhoneOff,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";

interface MobileClassroomLayoutProps {
  currentUser: {
    id: string;
    name: string;
    role: "teacher" | "student";
  };
  videoContent: React.ReactNode;
  chatContent: React.ReactNode;
  whiteboardContent: React.ReactNode; // The lesson — gets full screen
  studentsContent: React.ReactNode;
  classTime: number;
  onLeave?: () => void;
}

/**
 * Lesson-first mobile classroom.
 *
 * - Lesson (whiteboardContent) fills the full screen.
 * - Video collapses to a draggable-feel floating bubble in the top-right.
 *   Tap to expand into a half-screen overlay; tap minimize to return.
 * - Chat & Participants open as bottom sheets.
 * - Sticky bottom action bar holds mic / camera / chat / participants / leave.
 */
export function MobileClassroomLayout({
  currentUser,
  videoContent,
  chatContent,
  whiteboardContent,
  studentsContent,
  classTime,
  onLeave,
}: MobileClassroomLayoutProps) {
  const [videoExpanded, setVideoExpanded] = useState(false);
  const [videoVisible, setVideoVisible] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col overflow-hidden">
      {/* ───────── Lesson takes the entire screen ───────── */}
      <main
        className="flex-1 relative overflow-auto"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 76px)" }}
      >
        {whiteboardContent}
      </main>

      {/* ───────── Floating session badge (top-left) ───────── */}
      <div
        className="absolute top-3 left-3 z-30 flex items-center gap-2 pointer-events-none"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <Badge className="bg-primary/90 text-primary-foreground text-[11px] backdrop-blur shadow-md">
          ● Live · {formatTime(classTime)}
        </Badge>
      </div>

      {/* ───────── Floating video bubble (top-right, minimized) ───────── */}
      {videoVisible && !videoExpanded && (
        <button
          type="button"
          onClick={() => setVideoExpanded(true)}
          className={cn(
            "absolute z-40 right-3 top-3 w-24 h-32 rounded-2xl overflow-hidden",
            "border-2 border-primary/60 shadow-2xl ring-1 ring-black/10",
            "bg-black/70 backdrop-blur active:scale-95 transition-transform"
          )}
          style={{ marginTop: "env(safe-area-inset-top)" }}
          aria-label="Expand video"
        >
          <div className="absolute inset-0">{videoContent}</div>
          <span className="absolute bottom-1 right-1 bg-black/60 text-white rounded p-0.5">
            <Maximize2 className="h-3 w-3" />
          </span>
        </button>
      )}

      {/* ───────── Expanded video (half-screen overlay) ───────── */}
      {videoVisible && videoExpanded && (
        <div
          className="absolute z-50 inset-x-2 top-2 h-[42%] rounded-2xl overflow-hidden border border-border shadow-2xl bg-black"
          style={{ marginTop: "env(safe-area-inset-top)" }}
        >
          <div className="absolute inset-0">{videoContent}</div>

          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white border-0"
              onClick={() => setVideoExpanded(false)}
              aria-label="Minimize video"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white border-0"
              onClick={() => setVideoVisible(false)}
              aria-label="Hide video"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute bottom-2 left-2 right-2 flex justify-center">
            <div className="flex gap-1.5 bg-black/60 backdrop-blur rounded-full px-2 py-1">
              <Button
                size="icon"
                variant={micOn ? "secondary" : "destructive"}
                className="h-9 w-9 rounded-full"
                onClick={() => setMicOn(!micOn)}
                aria-label={micOn ? "Mute" : "Unmute"}
              >
                {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              <Button
                size="icon"
                variant={camOn ? "secondary" : "destructive"}
                className="h-9 w-9 rounded-full"
                onClick={() => setCamOn(!camOn)}
                aria-label={camOn ? "Turn camera off" : "Turn camera on"}
              >
                {camOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden-video re-show pill */}
      {!videoVisible && (
        <button
          type="button"
          onClick={() => {
            setVideoVisible(true);
            setVideoExpanded(false);
          }}
          className="absolute z-40 right-3 top-3 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg"
          style={{ marginTop: "env(safe-area-inset-top)" }}
        >
          <Video className="h-3 w-3 inline mr-1" />
          Show video
        </button>
      )}

      {/* ───────── Sticky bottom action bar ───────── */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border/60 shadow-[0_-4px_20px_-6px_rgba(0,0,0,0.2)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Classroom controls"
      >
        <div className="grid grid-cols-5 gap-1 px-2 pt-1.5 pb-1.5">
          <ActionBtn
            label={micOn ? "Mute" : "Unmute"}
            icon={micOn ? Mic : MicOff}
            onClick={() => setMicOn(!micOn)}
            danger={!micOn}
          />
          <ActionBtn
            label={camOn ? "Camera" : "Cam off"}
            icon={camOn ? Video : VideoOff}
            onClick={() => setCamOn(!camOn)}
            danger={!camOn}
          />
          <ActionBtn
            label="Chat"
            icon={MessageSquare}
            onClick={() => setChatOpen(true)}
          />
          <ActionBtn
            label="People"
            icon={Users}
            onClick={() => setStudentsOpen(true)}
          />
          <ActionBtn
            label="Leave"
            icon={PhoneOff}
            onClick={onLeave}
            danger
          />
        </div>
      </nav>

      {/* ───────── Chat bottom sheet ───────── */}
      <Sheet open={chatOpen} onOpenChange={setChatOpen}>
        <SheetContent side="bottom" className="h-[80vh] p-0 flex flex-col">
          <SheetHeader className="px-4 py-3 border-b">
            <SheetTitle className="text-base">Chat</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-hidden">{chatContent}</div>
        </SheetContent>
      </Sheet>

      {/* ───────── Participants bottom sheet ───────── */}
      <Sheet open={studentsOpen} onOpenChange={setStudentsOpen}>
        <SheetContent side="bottom" className="h-[60vh] p-0 flex flex-col">
          <SheetHeader className="px-4 py-3 border-b">
            <SheetTitle className="text-base">Participants</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-auto">{studentsContent}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

interface ActionBtnProps {
  label: string;
  icon: typeof Mic;
  onClick?: () => void;
  danger?: boolean;
}

const ActionBtn: React.FC<ActionBtnProps> = ({ label, icon: Icon, onClick, danger }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center gap-0.5 w-full min-h-[52px] rounded-xl",
      "transition-all duration-200 touch-manipulation select-none active:scale-95",
      danger
        ? "text-destructive bg-destructive/10"
        : "text-foreground hover:bg-muted/60"
    )}
    aria-label={label}
  >
    <Icon size={22} strokeWidth={2.2} />
    <span className="text-[10px] font-semibold tracking-tight">{label}</span>
  </button>
);
