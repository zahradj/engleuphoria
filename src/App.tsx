
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PaymentPage from "./pages/PaymentPage";
import MaterialLibraryPage from "./pages/MaterialLibraryPage";
import CurriculumLibraryPage from "./pages/CurriculumLibraryPage";
import ForParents from "./pages/ForParents";
import ForTeachers from "./pages/ForTeachers";
import UnifiedClassroom from "./pages/UnifiedClassroom";
import OneOnOneClassroomNew from "./pages/OneOnOneClassroomNew";

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
              <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/material-library" element={<MaterialLibraryPage />} />
              <Route path="/curriculum-library" element={<CurriculumLibraryPage />} />
              <Route path="/for-parents" element={<ForParents />} />
              <Route path="/for-teachers" element={<ForTeachers />} />
              <Route path="/classroom" element={<UnifiedClassroom />} />
              <Route path="/oneonone-classroom-new" element={<OneOnOneClassroomNew />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
