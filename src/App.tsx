
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UnifiedClassroom from "./pages/UnifiedClassroom";
import OneOnOneClassroomNew from "./pages/OneOnOneClassroomNew";
import SimpleClassroomSelector from "./pages/SimpleClassroomSelector";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import PricingSelection from "./pages/PricingSelection";
import TeacherDiscovery from "./pages/TeacherDiscovery";
import EnhancedIndex from "./pages/EnhancedIndex";
import AboutUs from "./pages/AboutUs";
import Teachers from "./pages/Teachers";
import ForParents from "./pages/ForParents";
import TeacherApplication from "./pages/TeacherApplication";
import LessonScheduler from "./pages/LessonScheduler";
import StudentLessonScheduler from "./pages/StudentLessonScheduler";
import LessonPlanCreator from "./pages/LessonPlanCreator";
import MaterialLibraryPage from "./pages/MaterialLibraryPage";
import CurriculumLibraryPage from "./pages/CurriculumLibraryPage";
import PaymentPage from "./pages/PaymentPage";
import MediaTestPage from "./pages/MediaTestPage";
import StudentManagement from "./pages/StudentManagement";
import WhiteboardPage from "./pages/WhiteboardPage";
import NotFound from "./pages/NotFound";
import BecomeTeacher from "./pages/BecomeTeacher";
import TeacherOnboarding from "./pages/TeacherOnboarding";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/enhanced" element={<EnhancedIndex />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/teachers" element={<Teachers />} />
                  <Route path="/for-teachers" element={<Teachers />} />
                  <Route path="/for-parents" element={<ForParents />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/pricing-selection" element={<PricingSelection />} />
                  <Route path="/teacher-discovery" element={<TeacherDiscovery />} />
                  <Route path="/student-dashboard" element={<StudentDashboard />} />
                  <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/unified-classroom" element={<UnifiedClassroom />} />
                  <Route path="/oneonone-classroom-new" element={<OneOnOneClassroomNew />} />
                  <Route path="/classroom-selector" element={<SimpleClassroomSelector />} />
                  <Route path="/teacher-application" element={<TeacherApplication />} />
                  <Route path="/lesson-scheduler" element={<LessonScheduler />} />
                  <Route path="/student-lesson-scheduler" element={<StudentLessonScheduler />} />
                  <Route path="/lesson-plan-creator" element={<LessonPlanCreator />} />
                  <Route path="/material-library" element={<MaterialLibraryPage />} />
                  <Route path="/curriculum-library" element={<CurriculumLibraryPage />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/media-test" element={<MediaTestPage />} />
                  <Route path="/student-management" element={<StudentManagement />} />
                  <Route path="/whiteboard" element={<WhiteboardPage />} />
                  <Route path="/become-teacher" element={<BecomeTeacher />} />
                  <Route path="/teacher-onboarding" element={<TeacherOnboarding />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
