
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Timer, Award, Upload, Gamepad2, Star, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TeachingToolsProps {
  onStartTimer: () => void;
  onUploadMaterial: () => void;
  onShowGames: () => void;
  onShowRewards: () => void;
  onShowAIAssistant?: () => void;
}

export function TeachingTools({
  onStartTimer,
  onUploadMaterial,
  onShowGames,
  onShowRewards,
  onShowAIAssistant
}: TeachingToolsProps) {
  const { languageText } = useLanguage();
  const { toast } = useToast();
  
  const awardStar = () => {
    toast({
      title: "⭐ " + languageText.starAwarded,
      description: languageText.goodJob,
    });
  };

  return (
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

      {onShowAIAssistant && (
        <Button 
          size="sm" 
          variant="outline" 
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border-0"
          onClick={onShowAIAssistant}
        >
          <Sparkles size={16} className="mr-1" />
          AI Assistant
        </Button>
      )}
      
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
  );
}
