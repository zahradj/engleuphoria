import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ImprovedProtectedRoute } from "@/components/auth/ImprovedProtectedRoute";
import { LanguageProvider } from "@/contexts/LanguageContext";
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
import MediaTestPage from "./pages/MediaTestPage";
import UnifiedClassroom from "./pages/UnifiedClassroom";
import { DiscoverTeachers } from "./pages/DiscoverTeachers";
import StudentSchedule from "./pages/student/StudentSchedule";
import BookLesson from "./pages/student/BookLesson";
import SpeakingPractice from "./pages/student/SpeakingPractice";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/teacher-signup" element={<TeacherSignUp />} />
              <Route path="/student-signup" element={<StudentSignUp />} />
              <Route path="/teacher-application" element={<TeacherApplication />} />
              <Route path="/student-application" element={<StudentApplication />} />
              <Route path="/media-test" element={<MediaTestPage />} />
              <Route path="/classroom" element={<UnifiedClassroom />} />
              <Route path="/discover-teachers" element={<DiscoverTeachers />} />
              <Route path="/student/schedule" element={<StudentSchedule />} />
              <Route path="/student/book-lesson" element={<BookLesson />} />
              <Route path="/student/speaking-practice" element={<SpeakingPractice />} />
              
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
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
