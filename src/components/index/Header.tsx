
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  return (
    <header className="w-full bg-white/80 backdrop-blur-sm shadow-sm py-3 px-4">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <Logo size="large" onClick={() => navigate('/')} />
        
        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/for-parents')}>For Parents</Button>
          <Button variant="ghost" onClick={() => navigate('/for-teachers')}>For Teachers</Button>
          <Button variant="outline" onClick={() => navigate('/login')}>Log In</Button>
          <Button onClick={() => navigate('/signup')}>Sign Up</Button>
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
              <Button variant="ghost" onClick={() => {
                navigate('/for-parents');
                setOpen(false);
              }}>For Parents</Button>
              <Button variant="ghost" onClick={() => {
                navigate('/for-teachers');
                setOpen(false);
              }}>For Teachers</Button>
              <Button variant="outline" onClick={() => {
                navigate('/login');
                setOpen(false);
              }}>Log In</Button>
              <Button onClick={() => {
                navigate('/signup');
                setOpen(false);
              }} className="mt-2">Sign Up</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
