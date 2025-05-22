
import { Card } from "@/components/ui/card";

export interface AchievementBadgeProps {
  id: string;
  name: string;
  description: string;
  icon: string | React.ReactNode;
  level?: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlocked: boolean;
  progress?: {current: number, total: number};
  pointsAwarded: number;
  className?: string;
}

export function AchievementBadge({
  name,
  description,
  icon,
  level = 'bronze',
  unlocked,
  progress,
  pointsAwarded,
  className = "",
}: AchievementBadgeProps) {
  // Define background colors based on badge level
  const levelColors = {
    bronze: {
      bg: "bg-amber-100",
      border: "border-amber-300",
      iconBg: "bg-amber-200",
      text: "text-amber-800",
    },
    silver: {
      bg: "bg-gray-100",
      border: "border-gray-300",
      iconBg: "bg-gray-200", 
      text: "text-gray-800",
    },
    gold: {
      bg: "bg-yellow-100",
      border: "border-yellow-300",
      iconBg: "bg-yellow-200",
      text: "text-yellow-800",
    },
    platinum: {
      bg: "bg-indigo-100",
      border: "border-indigo-300", 
      iconBg: "bg-indigo-200",
      text: "text-indigo-800",
    },
  };

  const colors = levelColors[level];
  
  return (
    <Card 
      className={`p-4 flex items-center ${unlocked ? colors.bg : "bg-gray-100"} 
        ${unlocked ? colors.border : "border-gray-200"} 
        ${unlocked ? "" : "opacity-70"} ${className}`}
    >
      <div 
        className={`rounded-full p-3 mr-4 flex items-center justify-center ${
          unlocked ? colors.iconBg : "bg-gray-200"
        }`}
        style={{ minWidth: "3.5rem", height: "3.5rem" }}
      >
        {typeof icon === 'string' ? (
          <img 
            src={icon} 
            alt={name} 
            className={`w-full h-full ${!unlocked ? "grayscale" : ""}`} 
          />
        ) : (
          <div className={unlocked ? colors.text : "text-gray-500"}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className={`font-bold ${unlocked ? colors.text : "text-gray-500"}`}>
            {name}
          </h4>
          
          <div className="text-sm font-medium bg-yellow-dark/10 text-yellow-dark px-2 py-1 rounded-full">
            +{pointsAwarded}
          </div>
        </div>
        
        <p className={`text-sm ${unlocked ? "text-muted-foreground" : "text-gray-500"}`}>
          {description}
        </p>
        
        {progress && (
          <div className="mt-2">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${unlocked ? "bg-green-500" : colors.border}`}
                style={{width: `${Math.min(100, (progress.current / progress.total) * 100)}%`}}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {progress.current}/{progress.total}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
