
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LessonPlanCreator, LessonPlan } from "@/components/teacher/LessonPlanCreator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LessonPlanCreatorPage = () => {
  const navigate = useNavigate();
  const { languageText } = useLanguage();

  const handleSaveLessonPlan = (plan: LessonPlan) => {
    // Store in localStorage for now (in real app, would save to backend)
    const existingPlans = JSON.parse(localStorage.getItem("lessonPlans") || "[]");
    const updatedPlans = [...existingPlans, plan];
    localStorage.setItem("lessonPlans", JSON.stringify(updatedPlans));
    
    // Navigate back to teacher dashboard
    navigate("/teacher-dashboard");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b py-4">
        <div className="container max-w-7xl mx-auto px-4 flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/teacher-dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-bold">{languageText.createLessonPlan}</h1>
        </div>
      </header>
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        <LessonPlanCreator onSave={handleSaveLessonPlan} />
      </main>
    </div>
  );
};

export default LessonPlanCreatorPage;
