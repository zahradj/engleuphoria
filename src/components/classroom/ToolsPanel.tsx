
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { MediaControls } from "./tools/MediaControls";
import { TeachingTools } from "./tools/TeachingTools";
import { ClassroomAIAssistant } from "./ai/ClassroomAIAssistant";

interface ToolsPanelProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isHandRaised: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleHand: () => void;
  onShowGames: () => void;
  onLayoutChange: (layout: string) => void;
  onShowRewards: () => void;
  onStartTimer: () => void;
  onUploadMaterial: () => void;
}

export function ToolsPanel({
  isMuted,
  isVideoOff,
  isHandRaised,
  onToggleMute,
  onToggleVideo,
  onToggleHand,
  onShowGames,
  onLayoutChange,
  onShowRewards,
  onStartTimer,
  onUploadMaterial
}: ToolsPanelProps) {
  const { languageText } = useLanguage();
  const { toast } = useToast();
  const [currentLayout, setCurrentLayout] = useState("default");
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const handleLayoutChange = (layout: string) => {
    if (!layout) return;
    setCurrentLayout(layout);
    onLayoutChange(layout);
    
    toast({
      title: languageText.layoutChanged,
      description: `${languageText.switchedTo} ${layout} ${languageText.view}`,
    });
  };

  const handleShowAIAssistant = () => {
    setIsAIAssistantOpen(true);
  };

  return (
    <>
      <Card className="p-3">
        <div className="flex flex-wrap gap-3 justify-between">
          {/* Media Controls */}
          <MediaControls 
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            isHandRaised={isHandRaised}
            currentLayout={currentLayout}
            onToggleMute={onToggleMute}
            onToggleVideo={onToggleVideo}
            onToggleHand={onToggleHand}
            onLayoutChange={handleLayoutChange}
          />

          {/* Teaching Tools */}
          <TeachingTools 
            onStartTimer={onStartTimer}
            onUploadMaterial={onUploadMaterial}
            onShowGames={onShowGames}
            onShowRewards={onShowRewards}
            onShowAIAssistant={handleShowAIAssistant}
          />
        </div>
      </Card>

      <ClassroomAIAssistant 
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />
    </>
  );
}
