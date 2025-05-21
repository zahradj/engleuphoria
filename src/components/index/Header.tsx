
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="w-full bg-white shadow-sm py-3 px-4">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-purple/20 rounded-full p-2">
            <span className="text-xl font-bold text-purple">E!</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple to-teal bg-clip-text text-transparent">
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
