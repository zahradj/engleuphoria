
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background circular effects */}
      <div className="absolute -z-10 top-1/4 left-1/4 w-[110%] h-[110%] bg-purple/20 rounded-full blur-3xl animate-pulse-subtle opacity-70"></div>
      <div className="absolute -z-10 bottom-1/3 right-1/4 w-[90%] h-[90%] bg-teal/15 rounded-full blur-3xl animate-pulse-subtle opacity-65 animation-delay-300"></div>
      <div className="absolute -z-10 top-1/2 left-1/2 w-[80%] h-[80%] bg-orange/10 rounded-full blur-3xl animate-pulse-subtle opacity-60 animation-delay-700"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md animate-fade-in">
          <div className="text-8xl font-bold mb-4 bg-gradient-to-r from-purple to-teal bg-clip-text text-transparent animate-float">
            404
          </div>
          
          <h1 className="text-3xl font-bold mb-4 animate-fade-in animation-delay-300">Page Not Found</h1>
          
          <p className="text-muted-foreground mb-8 animate-fade-in animation-delay-500">
            Oops! It looks like you've wandered to a part of our universe that doesn't exist.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => navigate('/')}
            className="animate-bounce-light animation-delay-700"
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
