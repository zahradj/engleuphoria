
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
import StudentApplication from "./pages/StudentApplication";
import EmailConfirmation from "./pages/EmailConfirmation";
import ForTeachers from "./pages/ForTeachers";
import CurriculumLibrary from "./pages/CurriculumLibrary";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import StudentSchedule from "./pages/student/StudentSchedule";
import BookLesson from "./pages/student/BookLesson";
import SpeakingPractice from "./pages/student/SpeakingPractice";

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
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/for-parents" element={<ForParents />} />
              <Route path="/for-teachers" element={<ForTeachers />} />
              <Route path="/become-teacher" element={<BecomeTeacher />} />
              <Route path="/discover-teachers" element={<DiscoverTeachers />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/email-confirmation" element={<EmailConfirmation />} />
              <Route path="/teacher-application" element={<TeacherApplication />} />
              <Route path="/student-application" element={<StudentApplication />} />
              <Route path="/pricing-selection" element={<PricingSelection />} />
              
              {/* Student Routes */}
              <Route path="/student" element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>} />
              <Route path="/student/schedule" element={<ProtectedRoute requiredRole="student"><StudentSchedule /></ProtectedRoute>} />
              <Route path="/student/book-lesson" element={<ProtectedRoute requiredRole="student"><BookLesson /></ProtectedRoute>} />
              <Route path="/student/speaking-practice" element={<ProtectedRoute requiredRole="student"><SpeakingPractice /></ProtectedRoute>} />
              <Route path="/student/lesson-scheduler" element={<ProtectedRoute requiredRole="student"><StudentLessonScheduler /></ProtectedRoute>} />
              
              {/* Teacher Routes */}
              <Route path="/teacher" element={<ProtectedRoute requiredRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
              <Route path="/teacher/materials" element={<ProtectedRoute requiredRole="teacher"><MaterialLibraryPage /></ProtectedRoute>} />
              <Route path="/teacher/lesson-scheduler" element={<ProtectedRoute requiredRole="teacher"><LessonScheduler /></ProtectedRoute>} />
              <Route path="/teacher/lesson-plan-creator" element={<ProtectedRoute requiredRole="teacher"><LessonPlanCreator /></ProtectedRoute>} />
              <Route path="/teacher/student-management" element={<ProtectedRoute requiredRole="teacher"><StudentManagement /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
              
              {/* Shared Protected Routes */}
              <Route path="/classroom" element={<ProtectedRoute><UnifiedClassroom /></ProtectedRoute>} />
              <Route path="/whiteboard" element={<ProtectedRoute><WhiteboardPage /></ProtectedRoute>} />
              <Route path="/curriculum-library" element={<ProtectedRoute><CurriculumLibrary /></ProtectedRoute>} />
              <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path="/media-test" element={<MediaTestPage />} />
              
              {/* Legacy Redirects */}
              <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
              <Route path="/teacher-dashboard" element={<ProtectedRoute requiredRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
              <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/student-registration" element={<SignUp />} />
              <Route path="/material-library" element={<ProtectedRoute><MaterialLibraryPage /></ProtectedRoute>} />
              
              {/* 404 */}
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
