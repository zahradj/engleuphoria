
import { PointsBadge } from "./PointsBadge";
import { Button } from "@/components/ui/button";
import { Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StudentHeaderProps {
  studentName: string;
  points: number;
}

export function StudentHeader({ studentName, points }: StudentHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white shadow-sm py-3 px-4">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <div 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="bg-purple/20 rounded-full p-2">
            <span className="text-xl font-bold text-purple">E!</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple to-teal bg-clip-text text-transparent">
            Engleuphoria
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <PointsBadge points={points} />
          
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell size={20} />
          </Button>
          
          <Button variant="outline" size="icon" className="rounded-full">
            <User size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
}
