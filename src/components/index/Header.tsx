
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const Header = () => {
  const navigate = useNavigate();
  const { languageText, language, setLanguage } = useLanguage();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-xl text-gray-900">EnglishLearner</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate("/for-parents")}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {languageText.forParents}
            </button>
            <button
              onClick={() => navigate("/for-teachers")}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {languageText.forTeachers}
            </button>
            <button
              onClick={() => navigate("/payment")}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Pricing
            </button>
            <span className="text-gray-600">{languageText.contact}</span>
          </nav>
          
          <div className="flex items-center space-x-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="english">English</option>
              <option value="spanish">Español</option>
              <option value="french">Français</option>
              <option value="arabic">العربية</option>
            </select>
            
            <Button 
              variant="outline" 
              onClick={() => navigate("/login")}
            >
              {languageText.logIn}
            </Button>
            <Button onClick={() => navigate("/signup")}>
              {languageText.signUp}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
