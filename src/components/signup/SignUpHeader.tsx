
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const SignUpHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white/80 backdrop-blur-sm border-b border-purple-100 py-4 px-4 relative z-10">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/')}
        >
          <img 
            src="/lovable-uploads/a38a7187-5f12-41aa-bcc6-ef6ffb768fbf.png" 
            alt="EnglEuphoria Logo" 
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            EnglEuphoria
          </h1>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/login')}
            className="text-gray-600 hover:text-purple-600 transition-colors"
          >
            Already have an account?
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </header>
  );
};
