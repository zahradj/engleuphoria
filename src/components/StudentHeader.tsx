
import { useState } from "react";
import { PointsBadge } from "./PointsBadge";
import { Button } from "@/components/ui/button";
import { Bell, User, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface StudentHeaderProps {
  studentName: string;
  points: number;
}

export function StudentHeader({ studentName, points }: StudentHeaderProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm py-3 px-4">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <Logo size="large" onClick={() => navigate('/dashboard')} />
        
        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-4">
          <PointsBadge points={points} />
          
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell size={20} />
          </Button>
          
          <Button variant="outline" size="icon" className="rounded-full">
            <User size={20} />
          </Button>
        </div>
        
        {/* Mobile menu */}
        <div className="flex sm:hidden items-center gap-2">
          <PointsBadge points={points} className="mr-2" />
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px]">
              <div className="flex flex-col gap-4 mt-8">
                <Logo size="medium" onClick={() => {
                  navigate('/dashboard');
                  setOpen(false);
                }} />
                <div className="flex items-center justify-center my-4">
                  <PointsBadge points={points} />
                </div>
                <Button variant="outline" size="lg" className="flex gap-2 items-center justify-start" onClick={() => setOpen(false)}>
                  <Bell size={18} />
                  <span>Notifications</span>
                </Button>
                <Button variant="outline" size="lg" className="flex gap-2 items-center justify-start" onClick={() => setOpen(false)}>
                  <User size={18} />
                  <span>Profile</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
