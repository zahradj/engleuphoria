
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
          <img 
            src="/lovable-uploads/3d4ffe1c-aaa5-4e34-8441-fe0b477cf8ba.png" 
            alt="Engleuphoria Logo" 
            className="h-7 w-auto" 
          />
          <h1 className="text-xl font-bold text-foreground">
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
