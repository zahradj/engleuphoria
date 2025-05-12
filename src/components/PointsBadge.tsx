
import { Star } from "lucide-react";

interface PointsBadgeProps {
  points: number;
  className?: string;
}

export function PointsBadge({ points, className = "" }: PointsBadgeProps) {
  return (
    <div className={`flex items-center gap-1 bg-yellow-light px-3 py-1 rounded-full ${className}`}>
      <Star size={16} className="fill-yellow text-yellow-dark" />
      <span className="font-bold text-yellow-dark">{points} points</span>
    </div>
  );
}
