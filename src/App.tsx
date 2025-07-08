
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./hooks/useAuth";
import Index from "./pages/Index";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OneOnOneClassroomNew from "./pages/OneOnOneClassroomNew";
import UnifiedClassroom from "./pages/UnifiedClassroom";
import BecomeTeacher from "./pages/BecomeTeacher";
import ForParents from "./pages/ForParents";
import AboutUs from "./pages/AboutUs";
import MediaTestPage from "./pages/MediaTestPage";
import NotFound from "./pages/NotFound";
import { DiscoverTeachers } from "./pages/DiscoverTeachers";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import StudentLessonScheduler from "./pages/StudentLessonScheduler";
import MaterialLibraryPage from "./pages/MaterialLibraryPage";
import PaymentPage from "./pages/PaymentPage";
import WhiteboardPage from "./pages/WhiteboardPage";
import LessonPlanCreator from "./pages/LessonPlanCreator";
import StudentManagement from "./pages/StudentManagement";
import LessonScheduler from "./pages/LessonScheduler";
import TeacherApplication from "./pages/TeacherApplication";
import PricingSelection from "./pages/PricingSelection";
import Contact from "./pages/Contact";

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
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/oneonone-classroom" element={<OneOnOneClassroomNew />} />
              <Route path="/oneonone-classroom-new" element={<OneOnOneClassroomNew />} />
              <Route path="/classroom" element={<UnifiedClassroom />} />
              <Route path="/unified-classroom" element={<UnifiedClassroom />} />
              <Route path="/become-teacher" element={<BecomeTeacher />} />
              <Route path="/for-parents" element={<ForParents />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/discover-teachers" element={<DiscoverTeachers />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/student-lesson-scheduler" element={<StudentLessonScheduler />} />
              <Route path="/material-library" element={<MaterialLibraryPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/whiteboard" element={<WhiteboardPage />} />
              <Route path="/lesson-plan-creator" element={<LessonPlanCreator />} />
              <Route path="/student-management" element={<StudentManagement />} />
              <Route path="/lesson-scheduler" element={<LessonScheduler />} />
              <Route path="/teacher-application" element={<TeacherApplication />} />
              <Route path="/pricing-selection" element={<PricingSelection />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/media-test" element={<MediaTestPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
