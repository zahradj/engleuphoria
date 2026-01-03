import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LessonProvider } from "@/contexts/LessonContext";
import { ImprovedProtectedRoute } from "@/components/auth/ImprovedProtectedRoute";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { RoleThemeProvider } from "@/contexts/RoleThemeContext";
import { AppErrorBoundary } from "@/components/common/AppErrorBoundary";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Core Pages
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import TeachWithUsPage from "./pages/TeachWithUsPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherSignUp from "./pages/TeacherSignUp";
import StudentSignUp from "./pages/StudentSignUp";
import TeacherApplication from "./pages/TeacherApplication";
import StudentApplication from "./pages/StudentApplication";
import EmailVerification from "./pages/EmailVerification";
import ResetPassword from "./pages/ResetPassword";

// Lazy load classroom pages
const TeacherClassroomPage = lazy(() => import("./pages/TeacherClassroomPage"));
const StudentClassroomPage = lazy(() => import("./pages/StudentClassroomPage"));
const TeacherClassroomDemo = lazy(() => import("./pages/TeacherClassroomPage"));

import { AssessmentTaker } from "./components/assessment/AssessmentTaker";
import { AssessmentResults } from "./components/assessment/AssessmentResults";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
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

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <LessonProvider>
            <RoleThemeProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppErrorBoundary>
                    <Routes>
                      {/* Public Entry Point - Landing Page */}
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/teach-with-us" element={<TeachWithUsPage />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/teacher-signup" element={<TeacherSignUp />} />
                      <Route path="/student-signup" element={<StudentSignUp />} />
                      <Route path="/teacher-application" element={<TeacherApplication />} />
                      <Route path="/student-application" element={<StudentApplication />} />
                      <Route path="/email-verification" element={<EmailVerification />} />
                      <Route path="/reset-password" element={<ResetPassword />} />

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

                      {/* Student Dashboard Routes - Protected */}
                      <Route path="/playground/*" element={
                        <ImprovedProtectedRoute requiredRole="student">
                          <StudentDashboard />
                        </ImprovedProtectedRoute>
                      } />
                      <Route path="/academy/*" element={
                        <ImprovedProtectedRoute requiredRole="student">
                          <StudentDashboard />
                        </ImprovedProtectedRoute>
                      } />
                      <Route path="/hub/*" element={
                        <ImprovedProtectedRoute requiredRole="student">
                          <StudentDashboard />
                        </ImprovedProtectedRoute>
                      } />
                      
                      {/* Teacher Dashboard - Protected */}
                      <Route path="/admin/*" element={
                        <ImprovedProtectedRoute requiredRole="teacher">
                          <TeacherDashboard />
                        </ImprovedProtectedRoute>
                      } />
                      
                      {/* Teacher Live Classroom - Protected */}
                      <Route path="/classroom/:id" element={
                        <ImprovedProtectedRoute requiredRole="teacher">
                          <Suspense fallback={<LoadingFallback />}>
                            <TeacherClassroomPage />
                          </Suspense>
                        </ImprovedProtectedRoute>
                      } />

                      {/* Student Live Classroom - Protected */}
                      <Route path="/student-classroom/:id" element={
                        <ImprovedProtectedRoute requiredRole="student">
                          <Suspense fallback={<LoadingFallback />}>
                            <StudentClassroomPage />
                          </Suspense>
                        </ImprovedProtectedRoute>
                      } />

                      {/* Demo Classroom - No Auth Required */}
                      <Route path="/demo-classroom/:id" element={
                        <Suspense fallback={<LoadingFallback />}>
                          <TeacherClassroomDemo />
                        </Suspense>
                      } />

                      {/* Super Admin Dashboard - Protected */}
                      <Route path="/super-admin/*" element={
                        <ImprovedProtectedRoute requiredRole="admin">
                          <AdminDashboard />
                        </ImprovedProtectedRoute>
                      } />

                      {/* Legacy routes - redirect to new paths */}
                      <Route path="/student/*" element={<Navigate to="/playground" replace />} />
                      <Route path="/teacher" element={<Navigate to="/admin" replace />} />
                      <Route path="/admin-dashboard" element={<Navigate to="/super-admin" replace />} />
                      <Route path="/dashboard" element={<Navigate to="/playground" replace />} />

                      {/* 404 - Redirect to Login */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </AppErrorBoundary>
                </BrowserRouter>
              </TooltipProvider>
            </RoleThemeProvider>
          </LessonProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
