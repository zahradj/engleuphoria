
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./hooks/useAuth";
import { lazy } from 'react';
import { LazyRoute } from './components/common/LazyRoute';
import { ErrorBoundary } from './components/analytics/ErrorBoundary';
import { Analytics } from './components/common/Analytics';

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const UnifiedClassroom = lazy(() => import("./pages/UnifiedClassroom"));
const BecomeTeacher = lazy(() => import("./pages/BecomeTeacher"));
const ForParents = lazy(() => import("./pages/ForParents"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const MediaTestPage = lazy(() => import("./pages/MediaTestPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DiscoverTeachers = lazy(() => import("./pages/DiscoverTeachers").then(module => ({ default: module.DiscoverTeachers })));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const StudentLessonScheduler = lazy(() => import("./pages/StudentLessonScheduler"));
const MaterialLibraryPage = lazy(() => import("./pages/MaterialLibraryPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const WhiteboardPage = lazy(() => import("./pages/WhiteboardPage"));
const LessonPlanCreator = lazy(() => import("./pages/LessonPlanCreator"));
const StudentManagement = lazy(() => import("./pages/StudentManagement"));
const LessonScheduler = lazy(() => import("./pages/LessonScheduler"));
const TeacherApplication = lazy(() => import("./pages/TeacherApplication"));
const PricingSelection = lazy(() => import("./pages/PricingSelection"));
const Contact = lazy(() => import("./pages/Contact"));
const StudentApplication = lazy(() => import("./pages/StudentApplication"));
const EmailConfirmation = lazy(() => import("./pages/EmailConfirmation"));
const ForTeachers = lazy(() => import("./pages/ForTeachers"));
const CurriculumLibrary = lazy(() => import("./pages/CurriculumLibrary"));
const StudentSchedule = lazy(() => import("./pages/student/StudentSchedule"));
const BookLesson = lazy(() => import("./pages/student/BookLesson"));
const SpeakingPractice = lazy(() => import("./pages/student/SpeakingPractice"));
const SiteMap = lazy(() => import("./pages/SiteMap"));
const TeacherOnboarding = lazy(() => import("./pages/TeacherOnboarding"));

import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Analytics />
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <LazyRoute>
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
              <Route path="/teacher-onboarding" element={<TeacherOnboarding />} />
              
              {/* Site Navigation */}
              <Route path="/sitemap" element={<SiteMap />} />
              
              {/* Legacy Redirects */}
              <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
              <Route path="/teacher-dashboard" element={<ProtectedRoute requiredRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
              <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/student-registration" element={<SignUp />} />
              <Route path="/material-library" element={<ProtectedRoute><MaterialLibraryPage /></ProtectedRoute>} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
                </LazyRoute>
              </BrowserRouter>
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
