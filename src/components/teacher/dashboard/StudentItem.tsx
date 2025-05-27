
import { Button } from "@/components/ui/button";

interface StudentItemProps {
  name: string;
  level: string;
  lastClass: string;
  progress: number;
  onViewDetails: () => void;
}

export const StudentItem = ({ name, level, lastClass, progress, onViewDetails }: StudentItemProps) => (
  <div className="flex items-center justify-between py-3 border-b">
    <div>
      <h3 className="font-medium">{name}</h3>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{level}</span>
        <span className="text-xs text-muted-foreground">Last class: {lastClass}</span>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{progress}%</span>
        <div className="w-24 h-2 bg-muted rounded">
          <div className="h-full bg-primary rounded" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={onViewDetails}>View Details</Button>
    </div>
  </div>
);
