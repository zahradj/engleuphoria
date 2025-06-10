
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const SignUpHeader = () => {
  const navigate = useNavigate();
  const { languageText } = useLanguage();

  return (
    <header className="w-full bg-white/80 backdrop-blur-sm shadow-sm py-3 px-4 relative z-10">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="bg-purple/20 rounded-full p-2">
            <span className="text-xl font-bold text-purple">E!</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple to-teal bg-clip-text text-transparent">
            Engleuphoria
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/for-parents')}>{languageText.forParents}</Button>
          <Button variant="ghost" onClick={() => navigate('/for-teachers')}>{languageText.forTeachers}</Button>
          <Button variant="outline" onClick={() => navigate('/login')}>{languageText.logIn}</Button>
          <Button className="font-semibold" onClick={() => navigate('/signup')}>{languageText.signUp}</Button>
        </div>
      </div>
    </header>
  );
};
