
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ClassroomAuthProvider } from "@/hooks/useClassroomAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Page imports - only existing pages
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import StudentManagement from "./pages/StudentManagement";
import LessonPlanCreator from "./pages/LessonPlanCreator";
import LessonScheduler from "./pages/LessonScheduler";
import PaymentPage from "./pages/PaymentPage";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { EnhancedTeacherDashboard } from "./pages/EnhancedTeacherDashboard";
import OneOnOneClassroomNew from "./pages/OneOnOneClassroomNew";
import SimpleClassroomSelector from "./pages/SimpleClassroomSelector";
import StudentDashboard from "./pages/StudentDashboard";
import ForTeachers from "./pages/ForTeachers";
import ForParents from "./pages/ForParents";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import CurriculumLibraryPage from "./pages/CurriculumLibraryPage";
import MaterialLibraryPage from "./pages/MaterialLibraryPage";
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
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/for-teachers" element={<ForTeachers />} />
                <Route path="/for-parents" element={<ForParents />} />
                <Route path="/enhanced-teacher" element={<EnhancedTeacherDashboard />} />
                <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/classroom-selector" element={<SimpleClassroomSelector />} />
                <Route path="/oneonone-classroom-new" element={<OneOnOneClassroomNew />} />
                <Route path="/student-management" element={<StudentManagement />} />
                <Route path="/lesson-plan-creator" element={<LessonPlanCreator />} />
                <Route path="/lesson-scheduler" element={<LessonScheduler />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/curriculum-library" element={<CurriculumLibraryManager />} />
                <Route path="/curriculum-library-page" element={<CurriculumLibraryPage />} />
                <Route path="/material-library" element={<MaterialLibraryPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </LanguageProvider>
        </ClassroomAuthProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
