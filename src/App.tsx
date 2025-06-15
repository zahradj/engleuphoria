
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ClassroomAuthProvider } from "@/hooks/useClassroomAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Page imports
import Index from "./pages/Index";
import TeacherPortal from "./pages/TeacherPortal";
import StudentPortal from "./pages/StudentPortal";
import ParentPortal from "./pages/ParentPortal";
import AdminPortal from "./pages/AdminPortal";
import ClassroomPage from "./pages/ClassroomPage";
import UnifiedClassroomPage from "./pages/UnifiedClassroomPage";
import StudentManagement from "./pages/StudentManagement";
import LessonPlanCreator from "./pages/LessonPlanCreator";
import LessonScheduler from "./pages/LessonScheduler";
import PaymentPage from "./pages/PaymentPage";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { EnhancedTeacherDashboard } from "./pages/EnhancedTeacherDashboard";
import { CurriculumLibraryManager } from "./components/teacher/curriculum/CurriculumLibraryManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ClassroomAuthProvider>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/teacher" element={<TeacherPortal />} />
                <Route path="/enhanced-teacher" element={<EnhancedTeacherDashboard />} />
                <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
                <Route path="/student" element={<StudentPortal />} />
                <Route path="/parent" element={<ParentPortal />} />
                <Route path="/admin" element={<AdminPortal />} />
                <Route path="/classroom" element={<ClassroomPage />} />
                <Route path="/classroom/teacher/:roomId" element={<UnifiedClassroomPage />} />
                <Route path="/classroom/student/:roomId" element={<UnifiedClassroomPage />} />
                <Route path="/oneonone-classroom-new" element={<UnifiedClassroomPage />} />
                <Route path="/student-management" element={<StudentManagement />} />
                <Route path="/lesson-plan-creator" element={<LessonPlanCreator />} />
                <Route path="/lesson-scheduler" element={<LessonScheduler />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/curriculum-library" element={<CurriculumLibraryManager />} />
              </Routes>
            </BrowserRouter>
          </LanguageProvider>
        </ClassroomAuthProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
