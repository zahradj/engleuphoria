
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import { StudentDashboard } from "./pages/StudentDashboard";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import ClassroomPage from "./pages/ClassroomPage";
import EnhancedOneOnOneClassroom from "./pages/EnhancedOneOnOneClassroom";
import LessonPlanCreator from "./pages/LessonPlanCreator";
import LessonScheduler from "./pages/LessonScheduler";
import StudentManagement from "./pages/StudentManagement";
import { Login } from "./pages/Login";
import SignUp from "./pages/SignUp";
import { UnifiedTeacherDashboard } from "./pages/UnifiedTeacherDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/unified-teacher" element={<UnifiedTeacherDashboard />} />
              <Route path="/classroom" element={<ClassroomPage />} />
              <Route path="/oneonone-classroom-new" element={<EnhancedOneOnOneClassroom />} />
              <Route path="/lesson-plan-creator" element={<LessonPlanCreator />} />
              <Route path="/lesson-scheduler" element={<LessonScheduler />} />
              <Route path="/student-management" element={<StudentManagement />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
