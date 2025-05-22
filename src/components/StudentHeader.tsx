
import { useState } from "react";
import { PointsBadge } from "./PointsBadge";
import { Button } from "@/components/ui/button";
import { Bell, User, Menu, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

interface StudentHeaderProps {
  studentName: string;
  points: number;
}

export function StudentHeader({ studentName, points }: StudentHeaderProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { language, setLanguage, languageText } = useLanguage();

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
          
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Globe size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setLanguage("english")}
                className={language === "english" ? 'bg-muted' : ''}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLanguage("spanish")}
                className={language === "spanish" ? 'bg-muted' : ''}
              >
                Español
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLanguage("arabic")}
                className={language === "arabic" ? 'bg-muted' : ''}
              >
                العربية
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLanguage("french")}
                className={language === "french" ? 'bg-muted' : ''}
              >
                Français
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                  <span>{languageText.notifications}</span>
                </Button>
                <Button variant="outline" size="lg" className="flex gap-2 items-center justify-start" onClick={() => setOpen(false)}>
                  <User size={18} />
                  <span>{languageText.profile}</span>
                </Button>
                
                {/* Language Selection */}
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">{languageText.language}:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm" 
                      variant={language === "english" ? "default" : "outline"}
                      onClick={() => setLanguage("english")}
                    >
                      English
                    </Button>
                    <Button 
                      size="sm" 
                      variant={language === "spanish" ? "default" : "outline"}
                      onClick={() => setLanguage("spanish")}
                    >
                      Español
                    </Button>
                    <Button 
                      size="sm" 
                      variant={language === "arabic" ? "default" : "outline"}
                      onClick={() => setLanguage("arabic")}
                    >
                      العربية
                    </Button>
                    <Button 
                      size="sm" 
                      variant={language === "french" ? "default" : "outline"}
                      onClick={() => setLanguage("french")}
                    >
                      Français
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
