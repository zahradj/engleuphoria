
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Payment from "./pages/Payment";
import MaterialLibrary from "./pages/MaterialLibrary";
import CurriculumLibrary from "./pages/CurriculumLibrary";
import ForParents from "./pages/ForParents";
import ForTeachers from "./pages/ForTeachers";
import Pricing from "./pages/Pricing";
import UnifiedClassroom from "./pages/UnifiedClassroom";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/material-library" element={<MaterialLibrary />} />
              <Route path="/curriculum-library" element={<CurriculumLibrary />} />
              <Route path="/for-parents" element={<ForParents />} />
              <Route path="/for-teachers" element={<ForTeachers />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/classroom" element={<UnifiedClassroom />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
