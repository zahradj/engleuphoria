import { useEffect } from "react";
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
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherSignUp from "./pages/TeacherSignUp";
import StudentSignUp from "./pages/StudentSignUp";
import TeacherApplication from "./pages/TeacherApplication";
import StudentApplication from "./pages/StudentApplication";
import OneOnOneClassroomNew from "./pages/OneOnOneClassroomNew";
import ClassroomEntryPage from "./pages/ClassroomEntryPage";
import MediaTestPage from "./pages/MediaTestPage";
import UnifiedClassroom from "./pages/UnifiedClassroom";
import { DiscoverTeachers } from "./pages/DiscoverTeachers";
import { TeacherProfile } from "./pages/TeacherProfile";
import { BookLesson } from "./pages/BookLesson";
import StudentSchedule from "./pages/student/StudentSchedule";
import TeacherSchedule from "./pages/teacher/TeacherSchedule";
import SpeakingPractice from "./pages/student/SpeakingPractice";
import ForParents from "./pages/ForParents";
import ForTeachers from "./pages/ForTeachers";  
import AboutUs from "./pages/AboutUs";
import CurriculumLibrary from "./pages/curriculum/CurriculumLibrary";
import NewPricingPage from "./pages/NewPricingPage";
import PlacementTest from "./pages/PlacementTest";
import PlacementTest2 from "./pages/PlacementTest2";
import LessonViewer from "./pages/LessonViewer";
import Lesson1GreetingsPage from "./pages/lessons/Lesson1GreetingsPage";

import ClassroomPrejoin from "./pages/ClassroomPrejoin";
import { SystematicSlidesAdmin } from "./pages/admin/SystematicSlidesAdmin";
import { AdventuresPage } from "./pages/AdventuresPage";

const queryClient = new QueryClient();

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
  // Clear insecure localStorage role data on app initialization
  useEffect(() => {
    clearInsecureRoleStorage();
  }, []);

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
              <Route path="/media-test" element={<MediaTestPage />} />
              <Route path="/classroom" element={<ClassroomEntryPage />} />
              <Route path="/classroom-direct" element={<UnifiedClassroom />} />
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
              <Route path="/curriculum-library" element={<CurriculumLibrary />} />
              
              <Route path="/pricing" element={<NewPricingPage />} />
              <Route path="/placement-test" element={<PlacementTest />} />
              <Route path="/placement-test-2" element={<PlacementTest2 />} />
              <Route path="/lesson-viewer" element={<LessonViewer />} />
              <Route path="/lessons/unit-0/lesson-1" element={<Lesson1GreetingsPage />} />
              <Route path="/admin/systematic-slides" element={<SystematicSlidesAdmin />} />
              <Route path="/adventures" element={<AdventuresPage />} />

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
                  <AdminDashboard />
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
                  <OneOnOneClassroomNew />
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
