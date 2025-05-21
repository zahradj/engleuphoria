
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="w-full bg-white/80 backdrop-blur-sm shadow-sm py-3 px-4">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img 
            src="/lovable-uploads/3d4ffe1c-aaa5-4e34-8441-fe0b477cf8ba.png" 
            alt="Engleuphoria Logo" 
            className="h-8 w-auto" 
          />
          <h1 className="text-xl font-bold text-foreground">
            Engleuphoria
          </h1>
        </div>
        
        <div className="hidden sm:flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/for-parents')}>For Parents</Button>
          <Button variant="ghost" onClick={() => navigate('/for-teachers')}>For Teachers</Button>
          <Button variant="outline" onClick={() => navigate('/login')}>Log In</Button>
          <Button onClick={() => navigate('/signup')}>Sign Up</Button>
        </div>
      </div>
    </header>
  );
};
