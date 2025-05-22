
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mic, MicOff, Video, VideoOff, Hand, UserCircle2, Maximize2 } from "lucide-react";
import { Draggable } from "./ui/Draggable";

interface VideoFeed {
  id: string;
  name: string;
  isTeacher: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  isHandRaised?: boolean;
  videoSrc?: string; // In a real app, this would come from WebRTC
}

interface VideoConferencePanelProps {
  feeds: VideoFeed[];
  onToggleMute: (id: string) => void;
  onToggleCamera: (id: string) => void;
  onRaiseHand?: (id: string) => void;
  onMaximize?: (id: string) => void;
  currentUserId: string;
  compact?: boolean;
}

export function VideoConferencePanel({
  feeds,
  onToggleMute,
  onToggleCamera,
  onRaiseHand,
  onMaximize,
  currentUserId,
  compact = false,
}: VideoConferencePanelProps) {
  const { languageText } = useLanguage();
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(
    feeds.find(feed => feed.isTeacher)?.id || null
  );

  // Sort feeds to put active speaker first, then teacher, then others
  const sortedFeeds = [...feeds].sort((a, b) => {
    if (a.id === activeSpeakerId) return -1;
    if (b.id === activeSpeakerId) return 1;
    if (a.isTeacher) return -1;
    if (b.isTeacher) return 1;
    return 0;
  });

  const mainFeed = sortedFeeds[0] || null;
  const sideFeeds = sortedFeeds.slice(1);

  const isCurrentUser = (id: string) => id === currentUserId;

  // In compact mode, only show the main feed
  if (compact) {
    if (!mainFeed) return null;
    
    return (
      <Draggable>
        <div className="w-48 aspect-video bg-black rounded-lg overflow-hidden shadow-md border border-muted relative">
          {renderVideoFeed(mainFeed, true)}
        </div>
      </Draggable>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {/* Main Video Feed */}
      {mainFeed && (
        <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
          {renderVideoFeed(mainFeed, false)}
          
          <div className="absolute top-2 right-2 flex gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-black/30 hover:bg-black/50 text-white border-white/20"
              onClick={() => onMaximize?.(mainFeed.id)}
            >
              <Maximize2 size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Side Video Feeds */}
      {sideFeeds.length > 0 && (
        <div className="flex overflow-x-auto gap-2 pb-1">
          {sideFeeds.map(feed => (
            <div
              key={feed.id}
              className="w-32 flex-shrink-0 aspect-video bg-black rounded-md overflow-hidden relative cursor-pointer"
              onClick={() => setActiveSpeakerId(feed.id)}
            >
              {renderVideoFeed(feed, true)}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  function renderVideoFeed(feed: VideoFeed, isSmall: boolean) {
    const { id, name, isTeacher, isMuted, isCameraOff, isHandRaised, videoSrc } = feed;
    const isCurrentUserFeed = isCurrentUser(id);
    
    return (
      <>
        {/* Video Placeholder */}
        {isCameraOff ? (
          <div className="h-full w-full flex flex-col items-center justify-center bg-muted-foreground/10">
            <UserCircle2 className="h-12 w-12 text-muted-foreground/80" />
            <span className="text-sm text-white font-medium mt-1">{name}</span>
          </div>
        ) : (
          <div className="h-full w-full bg-muted-foreground/20">
            {videoSrc ? (
              <video 
                src={videoSrc}
                className="h-full w-full object-cover"
                autoPlay
                muted
              />
            ) : (
              // Placeholder for real video
              <div className="h-full w-full flex items-center justify-center">
                <span className="text-white/80 text-sm">{name}'s video</span>
              </div>
            )}
          </div>
        )}
        
        {/* Status badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isTeacher && (
            <span className="bg-teal px-2 py-0.5 rounded-full text-xs text-white">
              {languageText.teacher}
            </span>
          )}
          {isCurrentUserFeed && (
            <span className="bg-purple px-2 py-0.5 rounded-full text-xs text-white">
              {languageText.you}
            </span>
          )}
        </div>

        {/* Controls overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {isMuted && (
              <div className="bg-red-500 rounded-full p-1">
                <MicOff size={isSmall ? 12 : 16} className="text-white" />
              </div>
            )}
            
            {isHandRaised && (
              <div className="bg-yellow rounded-full p-1">
                <Hand size={isSmall ? 12 : 16} className="text-yellow-dark" />
              </div>
            )}
          </div>

          {/* Only show control buttons for current user and not in small view */}
          {isCurrentUserFeed && !isSmall && (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full size-8 ${
                  isMuted ? "bg-red-500 text-white border-transparent" : "bg-black/30 text-white border-white/20"
                }`}
                onClick={() => onToggleMute(id)}
              >
                {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full size-8 ${
                  isCameraOff ? "bg-red-500 text-white border-transparent" : "bg-black/30 text-white border-white/20"
                }`}
                onClick={() => onToggleCamera(id)}
              >
                {isCameraOff ? <VideoOff size={14} /> : <Video size={14} />}
              </Button>
              
              {onRaiseHand && (
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full size-8 ${
                    isHandRaised ? "bg-yellow text-yellow-dark border-transparent" : "bg-black/30 text-white border-white/20"
                  }`}
                  onClick={() => onRaiseHand(id)}
                >
                  <Hand size={14} />
                </Button>
              )}
            </div>
          )}
        </div>
      </>
    );
  }
}
