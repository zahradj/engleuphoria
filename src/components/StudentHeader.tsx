
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
          className="cursor-pointer"
        >
          <img 
            src="/lovable-uploads/4570be6a-7587-485e-b773-d00f9b02a024.png" 
            alt="Engleuphoria Logo" 
            className="h-12 w-auto" 
          />
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
