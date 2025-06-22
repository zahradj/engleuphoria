
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/index/Header";
import { Hero } from "@/components/index/Hero";
import { CurriculumFramework } from "@/components/index/CurriculumFramework";
import { Features } from "@/components/index/Features";
import { DashboardDemo } from "@/components/index/DashboardDemo";
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
    // Direct users to sign up for systematic flow
    navigate("/signup");
  };
  
  const handleNameSubmit = () => {
    setStep("avatar");
  };
  
  const handleComplete = () => {
    // In a real app, we'd save this info to a backend
    localStorage.setItem("studentName", name);
    localStorage.setItem("avatarId", String(selectedAvatar));
    localStorage.setItem("points", "50"); // Starting points
    
    navigate("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1">
        {step === "welcome" && (
          <>
            <Hero onStartClick={handleStart} />
            <Features />
            <CurriculumFramework />
            <DashboardDemo />
            <HowItWorks onStartClick={handleStart} />
            <Testimonials />
            <FAQ />
            <CallToAction onStartClick={handleStart} />
          </>
        )}
        
        {step === "login" && (
          <div className="container max-w-7xl mx-auto px-4 py-8">
            <LoginForm />
          </div>
        )}
        
        {step === "avatar" && (
          <div className="container max-w-7xl mx-auto px-4 py-8">
            <AvatarForm
              onComplete={handleComplete}
              onGoBack={() => setStep("login")}
              selectedAvatar={selectedAvatar}
              setSelectedAvatar={setSelectedAvatar}
            />
          </div>
        )}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
