
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StudentHeader } from "@/components/StudentHeader";
import { Whiteboard } from "@/components/Whiteboard";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const WhiteboardPage = () => {
  const [studentName, setStudentName] = useState<string>("");
  const [points, setPoints] = useState<number>(0);
  const navigate = useNavigate();
  const { languageText } = useLanguage();
  
  useEffect(() => {
    // In a real app, we'd fetch this from an API
    const storedName = localStorage.getItem("studentName");
    const storedPoints = localStorage.getItem("points");
    
    if (!storedName) {
      navigate("/");
      return;
    }
    
    setStudentName(storedName);
    setPoints(storedPoints ? parseInt(storedPoints) : 0);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <StudentHeader studentName={studentName} points={points} />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-bold">{languageText.interactiveWhiteboard}</h1>
          </div>
          
          <div>
            <Button onClick={() => navigate("/dashboard")}>
              {languageText.backToDashboard}
            </Button>
          </div>
        </div>
        
        <Whiteboard className="mb-6" />
        
        <div className="bg-white rounded-lg p-6 border">
          <h2 className="font-bold mb-4">{languageText.activityDrawAndLearn}</h2>
          <p className="mb-2">{languageText.useWhiteboardComplete}</p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-purple/20 flex items-center justify-center">
                <span className="font-bold text-purple">1</span>
              </div>
              <p>{languageText.drawAnimal}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-teal/20 flex items-center justify-center">
                <span className="font-bold text-teal">2</span>
              </div>
              <p>{languageText.writeAnimalName}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-orange/20 flex items-center justify-center">
                <span className="font-bold text-orange">3</span>
              </div>
              <p>{languageText.drawWhatEats}</p>
            </div>
          </div>
          
          <Button 
            onClick={() => {
              // In a real app, we'd save the drawing and update points
              const currentPoints = parseInt(localStorage.getItem("points") || "0");
              const newPoints = currentPoints + 15;
              localStorage.setItem("points", String(newPoints));
              setPoints(newPoints);
              navigate("/dashboard");
            }}
          >
            {languageText.submitActivity}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default WhiteboardPage;
