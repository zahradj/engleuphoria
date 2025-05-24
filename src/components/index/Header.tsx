
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Menu, X, Globe } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

export const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { language, setLanguage, languageText } = useLanguage();
  
  return (
    <header className="w-full bg-white/80 backdrop-blur-sm shadow-sm py-3 px-4">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <Logo size="large" onClick={() => navigate('/')} />
        
        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/for-parents">{languageText.forParents}</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/for-teachers">{languageText.forTeachers}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/login">{languageText.logIn}</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">{languageText.signUp}</Link>
          </Button>
          
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Globe className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setLanguage('english')}
                className={language === 'english' ? 'bg-muted' : ''}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLanguage('arabic')}
                className={language === 'arabic' ? 'bg-muted' : ''}
              >
                العربية
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLanguage('french')}
                className={language === 'french' ? 'bg-muted' : ''}
              >
                Français
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="sm:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px]">
            <div className="flex flex-col gap-4 mt-8">
              <Logo size="medium" onClick={() => {
                navigate('/');
                setOpen(false);
              }} />
              <Button variant="ghost" asChild onClick={() => setOpen(false)}>
                <Link to="/for-parents">{languageText.forParents}</Link>
              </Button>
              <Button variant="ghost" asChild onClick={() => setOpen(false)}>
                <Link to="/for-teachers">{languageText.forTeachers}</Link>
              </Button>
              <Button variant="outline" asChild onClick={() => setOpen(false)}>
                <Link to="/login">{languageText.logIn}</Link>
              </Button>
              <Button asChild onClick={() => setOpen(false)} className="mt-2">
                <Link to="/signup">{languageText.signUp}</Link>
              </Button>
              
              {/* Mobile Language Selector */}
              <div className="mt-4 border-t pt-4 flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Language:</p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={language === 'english' ? 'default' : 'outline'}
                    onClick={() => setLanguage('english')}
                  >
                    English
                  </Button>
                  <Button 
                    size="sm" 
                    variant={language === 'arabic' ? 'default' : 'outline'}
                    onClick={() => setLanguage('arabic')}
                  >
                    العربية
                  </Button>
                  <Button 
                    size="sm" 
                    variant={language === 'french' ? 'default' : 'outline'}
                    onClick={() => setLanguage('french')}
                  >
                    Français
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
