
import { Card } from "@/components/ui/card";
import { Trophy, Star } from "lucide-react";

interface RewardItemProps {
  title: string;
  description: string;
  points: number;
  unlocked: boolean;
}

export function RewardItem({ title, description, points, unlocked }: RewardItemProps) {
  return (
    <Card className={`p-4 transition-all ${
      unlocked ? "bg-gradient-to-br from-yellow-light to-yellow-light/50" : "bg-muted/50"
    }`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${
          unlocked ? "bg-yellow text-yellow-dark" : "bg-muted text-muted-foreground"
        }`}>
          <Trophy size={24} className={unlocked ? "fill-yellow-dark" : ""} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          
          <div className="flex items-center gap-1 mt-2">
            <Star size={16} className={`${
              unlocked ? "fill-yellow text-yellow-dark" : "text-muted-foreground"
            }`} />
            <span className={`text-sm ${
              unlocked ? "text-yellow-dark font-bold" : "text-muted-foreground"
            }`}>
              {points} points
            </span>
          </div>
        </div>
        
        <div className={`text-xs uppercase font-bold px-2 py-1 rounded ${
          unlocked 
            ? "bg-yellow/30 text-yellow-dark"
            : "bg-muted text-muted-foreground"
        }`}>
          {unlocked ? "Unlocked" : "Locked"}
        </div>
      </div>
    </Card>
  );
}
