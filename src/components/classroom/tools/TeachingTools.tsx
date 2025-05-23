
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Timer, Award, Upload, Gamepad2, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TeachingToolsProps {
  onStartTimer: () => void;
  onUploadMaterial: () => void;
  onShowGames: () => void;
  onShowRewards: () => void;
}

export function TeachingTools({
  onStartTimer,
  onUploadMaterial,
  onShowGames,
  onShowRewards
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
