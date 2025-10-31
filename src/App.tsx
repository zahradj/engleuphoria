
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthProvider } from "@/contexts/AuthContext";
import { clearInsecureRoleStorage } from "@/utils/roleValidation";
import { ImprovedProtectedRoute } from "@/components/auth/ImprovedProtectedRoute";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { RoleThemeProvider } from "@/contexts/RoleThemeContext";
import { AppErrorBoundary } from "@/components/common/AppErrorBoundary";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherSignUp from "./pages/TeacherSignUp";
import StudentSignUp from "./pages/StudentSignUp";
import TeacherApplication from "./pages/TeacherApplication";
import StudentApplication from "./pages/StudentApplication";
import EmailVerification from "./pages/EmailVerification";
import ResetPassword from "./pages/ResetPassword";

// Lazy load heavy classroom components for better initial load performance
const OneOnOneClassroomNew = lazy(() => import("./pages/OneOnOneClassroomNew"));
const ClassroomEntryPage = lazy(() => import("./pages/ClassroomEntryPage"));
const AdventuresPage = lazy(() => import("./pages/AdventuresPage"));

import MediaTestPage from "./pages/MediaTestPage";
import VideoTestPage from "./pages/VideoTestPage";
import { DiscoverTeachers } from "./pages/DiscoverTeachers";
import { TeacherProfile } from "./pages/TeacherProfile";
import { BookLesson } from "./pages/BookLesson";
import StudentSchedule from "./pages/student/StudentSchedule";
import TeacherSchedule from "./pages/teacher/TeacherSchedule";
import SpeakingPractice from "./pages/student/SpeakingPractice";
import ForParents from "./pages/ForParents";
import ForTeachers from "./pages/ForTeachers";  
import AboutUs from "./pages/AboutUs";
import NewPricingPage from "./pages/NewPricingPage";
import PlacementTest from "./pages/PlacementTest";
import PlacementTest2 from "./pages/PlacementTest2";
import { PlacementTest2Guard } from "./components/guards/PlacementTest2Guard";
import Lesson1GreetingsPage from "./pages/lessons/Lesson1GreetingsPage";
import LessonSlideViewerPage from "./pages/LessonSlideViewerPage";

import ClassroomPrejoin from "./pages/ClassroomPrejoin";
import { SystematicSlidesAdmin } from "./pages/admin/SystematicSlidesAdmin";
import { AssessmentTaker } from "./components/assessment/AssessmentTaker";
import { AssessmentResults } from "./components/assessment/AssessmentResults";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes  
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="text-center space-y-4">
      <Skeleton className="h-12 w-48 mx-auto" />
      <Skeleton className="h-4 w-64 mx-auto" />
      <Skeleton className="h-32 w-full max-w-md mx-auto" />
    </div>
  </div>
);

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
        <p className="text-muted-foreground mb-6">Page not found</p>
        <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-primary to-secondary">
          Go Home
        </Button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <RoleThemeProvider>
            <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <AppErrorBoundary>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/teacher-signup" element={<TeacherSignUp />} />
              <Route path="/student-signup" element={<StudentSignUp />} />
              <Route path="/teacher-application" element={<TeacherApplication />} />
              <Route path="/student-application" element={<StudentApplication />} />
              <Route path="/email-verification" element={<EmailVerification />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/media-test" element={<MediaTestPage />} />
              <Route path="/video-test" element={<VideoTestPage />} />
              <Route path="/classroom" element={
                <ImprovedProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <OneOnOneClassroomNew />
                  </Suspense>
                </ImprovedProtectedRoute>
              } />
              <Route path="/classroom-prejoin" element={<ClassroomPrejoin />} />
              <Route path="/discover-teachers" element={<DiscoverTeachers />} />
              <Route path="/teacher/:teacherId" element={<TeacherProfile />} />
              <Route path="/student/schedule" element={<StudentSchedule />} />
              <Route path="/teacher/schedule" element={<TeacherSchedule />} />
              <Route path="/student/book-lesson" element={<BookLesson />} />
              <Route path="/student/speaking-practice" element={<SpeakingPractice />} />
              <Route path="/for-parents" element={<ForParents />} />
              <Route path="/for-teachers" element={<ForTeachers />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/pricing" element={<NewPricingPage />} />
              <Route path="/placement-test" element={<PlacementTest />} />
              <Route path="/placement-test-2" element={
                <PlacementTest2Guard>
                  <PlacementTest2 />
                </PlacementTest2Guard>
              } />
              <Route path="/lessons/unit-0/lesson-1" element={<Lesson1GreetingsPage />} />
              <Route path="/lesson-viewer" element={<LessonSlideViewerPage />} />
              <Route path="/admin/systematic-slides" element={<SystematicSlidesAdmin />} />
              <Route path="/adventures" element={
                <Suspense fallback={<LoadingFallback />}>
                  <AdventuresPage />
                </Suspense>
              } />
              
              {/* Assessment Routes */}
              <Route path="/assessment/:assessmentId" element={
                <ImprovedProtectedRoute>
                  <AssessmentTaker />
                </ImprovedProtectedRoute>
              } />
              <Route path="/assessment-results/:submissionId" element={
                <ImprovedProtectedRoute>
                  <AssessmentResults />
                </ImprovedProtectedRoute>
              } />

              {/* Protected Routes */}
              <Route path="/student" element={
                <ImprovedProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ImprovedProtectedRoute>
              } />
              
              <Route path="/teacher" element={
                <ImprovedProtectedRoute requiredRole="teacher">
                  <TeacherDashboard />
                </ImprovedProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ImprovedProtectedRoute requiredRole="admin">
                  <div className="min-h-screen flex items-center justify-center">
                    <p className="text-muted-foreground">Admin dashboard coming soon</p>
                  </div>
                </ImprovedProtectedRoute>
              } />
              
              {/* Generic dashboard route that redirects based on role */}
              <Route path="/dashboard" element={
                <ImprovedProtectedRoute>
                  <div>Redirecting...</div>
                </ImprovedProtectedRoute>
              } />
              
              <Route path="/oneonone-classroom-new" element={
                <ImprovedProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <OneOnOneClassroomNew />
                  </Suspense>
                </ImprovedProtectedRoute>
              } />
              
              {/* 404 Not Found Route */}
              <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AppErrorBoundary>
          </BrowserRouter>
            </TooltipProvider>
          </RoleThemeProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
