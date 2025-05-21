
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";

export const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-muted py-6">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <Logo size="large" />
          </div>
          
          {/* Mobile Footer Links */}
          <div className="flex flex-col md:hidden gap-4 text-center">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              About Us
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.preventDefault();
                navigate('/for-parents');
              }}
            >
              For Parents
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.preventDefault();
                navigate('/for-teachers');
              }}
            >
              For Teachers
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Contact
            </a>
          </div>
          
          {/* Desktop Footer Links */}
          <div className="hidden md:flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              About Us
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.preventDefault();
                navigate('/for-parents');
              }}
            >
              For Parents
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.preventDefault();
                navigate('/for-teachers');
              }}
            >
              For Teachers
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Engleuphoria. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
