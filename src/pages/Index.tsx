
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/index/Header";
import { Hero } from "@/components/index/Hero";
import { LearningPathway } from "@/components/index/LearningPathway";
import { Features } from "@/components/index/Features";
import { XPShowcase } from "@/components/index/XPShowcase";
import { DashboardDemo } from "@/components/index/DashboardDemo";
import { TeacherShowcase } from "@/components/index/TeacherShowcase";
import { HowItWorks } from "@/components/index/HowItWorks";
import { Testimonials } from "@/components/index/Testimonials";
import { FAQ } from "@/components/index/FAQ";
import { CallToAction } from "@/components/index/CallToAction";
import { LoginForm } from "@/components/index/LoginForm";
import { AvatarForm } from "@/components/index/AvatarForm";
import { Footer } from "@/components/index/Footer";

const Index = () => {
  const [step, setStep] = useState<"welcome" | "login" | "avatar">("welcome");
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<number | undefined>(undefined);
  
  const navigate = useNavigate();
  
  const handleStart = () => {
    // Direct users to login page for authentication flow
    navigate("/login");
  };
  
  const handleNameSubmit = () => {
    setStep("avatar");
  };
  
  const handleComplete = () => {
    // In a real app, we'd save this info to a backend
    localStorage.setItem("studentName", name);
    localStorage.setItem("avatarId", String(selectedAvatar));
    localStorage.setItem("points", "50"); // Starting points
    
    navigate("/login");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        {step === "welcome" && (
          <>
            <Hero onStartClick={handleStart} />
            <LearningPathway />
            <XPShowcase />
            <Features />
            <DashboardDemo />
            <TeacherShowcase />
            <HowItWorks onStartClick={handleStart} />
            <Testimonials />
            <FAQ />
            <CallToAction onStartClick={handleStart} />
          </>
        )}
        
        {step === "login" && (
          <LoginForm 
            onSubmit={handleNameSubmit} 
            onGoBack={() => setStep("welcome")} 
            name={name}
            setName={setName}
          />
        )}
        
        {step === "avatar" && (
          <AvatarForm
            onComplete={handleComplete}
            onGoBack={() => setStep("login")}
            selectedAvatar={selectedAvatar}
            setSelectedAvatar={setSelectedAvatar}
          />
        )}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
