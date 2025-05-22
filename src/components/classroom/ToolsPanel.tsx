
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Timer,
  Award,
  Upload,
  BookOpen,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Hand,
  Layout,
  Maximize2,
  Gamepad2,
  Star
} from "lucide-react";

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

  const handleLayoutChange = (layout: string) => {
    if (!layout) return;
    setCurrentLayout(layout);
    onLayoutChange(layout);
    
    toast({
      title: languageText.layoutChanged,
      description: `${languageText.switchedTo} ${layout} ${languageText.view}`,
    });
  };

  const awardStar = () => {
    toast({
      title: "⭐ " + languageText.starAwarded,
      description: languageText.goodJob,
    });
  };

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border">
      <div className="flex flex-wrap gap-3 justify-between">
        {/* Media Controls */}
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className={isMuted ? "bg-destructive text-white hover:text-white hover:bg-destructive/90" : ""}
            onClick={onToggleMute}
          >
            {isMuted ? <MicOff /> : <Mic />}
          </Button>
          
          <Button
            size="icon"
            variant="outline"
            className={isVideoOff ? "bg-destructive text-white hover:text-white hover:bg-destructive/90" : ""}
            onClick={onToggleVideo}
          >
            {isVideoOff ? <VideoOff /> : <Video />}
          </Button>
          
          <Button
            size="icon"
            variant="outline"
            className={isHandRaised ? "bg-yellow text-yellow-dark hover:text-yellow-dark hover:bg-yellow/90" : ""}
            onClick={onToggleHand}
          >
            <Hand />
          </Button>
          
          <Separator orientation="vertical" className="h-8" />
          
          {/* Layout Controls */}
          <ToggleGroup type="single" value={currentLayout} onValueChange={handleLayoutChange}>
            <ToggleGroupItem value="default" aria-label="Default view">
              <Layout size={18} />
            </ToggleGroupItem>
            <ToggleGroupItem value="material" aria-label="Material focus">
              <BookOpen size={18} />
            </ToggleGroupItem>
            <ToggleGroupItem value="video" aria-label="Video focus">
              <Maximize2 size={18} />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Teaching Tools */}
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={onStartTimer}>
            <Timer size={16} className="mr-1" />
            {languageText.timer}
          </Button>
          
          <Button size="sm" variant="outline" onClick={onUploadMaterial}>
            <Upload size={16} className="mr-1" />
            {languageText.upload}
          </Button>
          
          <Button size="sm" variant="outline" onClick={onShowGames}>
            <Gamepad2 size={16} className="mr-1" />
            {languageText.games}
          </Button>
          
          <Button size="sm" variant="outline" onClick={onShowRewards}>
            <Award size={16} className="mr-1" />
            {languageText.rewards}
          </Button>
          
          <Button 
            size="sm" 
            variant="secondary" 
            className="bg-yellow text-yellow-dark hover:bg-yellow/80"
            onClick={awardStar}
          >
            <Star size={16} className="mr-1" />
            {languageText.awardStar}
          </Button>
        </div>
      </div>
    </div>
  );
}
