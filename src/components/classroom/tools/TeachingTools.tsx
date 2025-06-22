
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Upload, Trophy, Gamepad2 } from "lucide-react";

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
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onStartTimer}
        className="flex items-center gap-1 hover:bg-orange-50"
      >
        <Clock size={16} />
        <span className="hidden sm:inline">Timer</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onUploadMaterial}
        className="flex items-center gap-1 hover:bg-blue-50"
      >
        <Upload size={16} />
        <span className="hidden sm:inline">Upload</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onShowGames}
        className="flex items-center gap-1 hover:bg-green-50"
      >
        <Gamepad2 size={16} />
        <span className="hidden sm:inline">Games</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onShowRewards}
        className="flex items-center gap-1 hover:bg-purple-50"
      >
        <Trophy size={16} />
        <span className="hidden sm:inline">Rewards</span>
        <Badge variant="secondary" className="ml-1 text-xs">
          New
        </Badge>
      </Button>
    </div>
  );
}
