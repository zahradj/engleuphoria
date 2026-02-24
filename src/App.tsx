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

// Only the landing page is eagerly loaded (entry point)
import LandingPage from "./pages/LandingPage";

// All other pages are lazy-loaded for bundle optimization
const AboutPage = lazy(() => import("./pages/AboutPage"));
const TeachWithUsPage = lazy(() => import("./pages/TeachWithUsPage"));
const ForTeachersPage = lazy(() => import("./pages/ForTeachersPage"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const TeacherSignUp = lazy(() => import("./pages/TeacherSignUp"));
const StudentSignUp = lazy(() => import("./pages/StudentSignUp"));
const TeacherApplication = lazy(() => import("./pages/TeacherApplication"));
const StudentApplication = lazy(() => import("./pages/StudentApplication"));
const EmailVerification = lazy(() => import("./pages/EmailVerification"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const StudentOnboardingFlow = lazy(() => import("./components/onboarding/StudentOnboardingFlow"));
const ParentDashboard = lazy(() => import("./pages/ParentDashboard"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const TeacherClassroomPage = lazy(() => import("./pages/TeacherClassroomPage"));
const AIPlacementTest = lazy(() => import("./components/placement/AIPlacementTest"));
const StudentClassroomPage = lazy(() => import("./pages/StudentClassroomPage"));
const AssessmentTaker = lazy(() => import("./components/assessment/AssessmentTaker"));
const AssessmentResults = lazy(() => import("./components/assessment/AssessmentResults"));

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
                      <Route path="/about" element={<Suspense fallback={<LoadingFallback />}><AboutPage /></Suspense>} />
                      <Route path="/teach-with-us" element={<Suspense fallback={<LoadingFallback />}><TeachWithUsPage /></Suspense>} />
                      <Route path="/for-teachers" element={<Suspense fallback={<LoadingFallback />}><ForTeachersPage /></Suspense>} />
                      <Route path="/login" element={<Suspense fallback={<LoadingFallback />}><Login /></Suspense>} />
                      <Route path="/signup" element={<Suspense fallback={<LoadingFallback />}><SignUp /></Suspense>} />
                      <Route path="/teacher-signup" element={<Suspense fallback={<LoadingFallback />}><TeacherSignUp /></Suspense>} />
                      <Route path="/student-signup" element={<Suspense fallback={<LoadingFallback />}><StudentSignUp /></Suspense>} />
                      <Route path="/teacher-application" element={<Suspense fallback={<LoadingFallback />}><TeacherApplication /></Suspense>} />
                      <Route path="/student-application" element={<Suspense fallback={<LoadingFallback />}><StudentApplication /></Suspense>} />
                      <Route path="/email-verification" element={<Suspense fallback={<LoadingFallback />}><EmailVerification /></Suspense>} />
                      <Route path="/reset-password" element={<Suspense fallback={<LoadingFallback />}><ResetPassword /></Suspense>} />

                      {/* Assessment Routes */}
                      <Route path="/assessment/:assessmentId" element={
                        <ImprovedProtectedRoute>
                          <Suspense fallback={<LoadingFallback />}><AssessmentTaker /></Suspense>
                        </ImprovedProtectedRoute>
                      } />
                      <Route path="/assessment-results/:submissionId" element={
                        <ImprovedProtectedRoute>
                          <Suspense fallback={<LoadingFallback />}><AssessmentResults /></Suspense>
                        </ImprovedProtectedRoute>
                      } />

                      {/* Student Dashboard Routes - Protected */}
                      <Route path="/playground/*" element={
                        <ImprovedProtectedRoute requiredRole="student">
                          <Suspense fallback={<LoadingFallback />}><StudentDashboard /></Suspense>
                        </ImprovedProtectedRoute>
                      } />
                      <Route path="/academy/*" element={
                        <ImprovedProtectedRoute requiredRole="student">
                          <Suspense fallback={<LoadingFallback />}><StudentDashboard /></Suspense>
                        </ImprovedProtectedRoute>
                      } />
                      <Route path="/hub/*" element={
                        <ImprovedProtectedRoute requiredRole="student">
                          <Suspense fallback={<LoadingFallback />}><StudentDashboard /></Suspense>
                        </ImprovedProtectedRoute>
                      } />
                      
                      {/* Teacher Dashboard - Protected */}
                      <Route path="/admin/*" element={
                        <ImprovedProtectedRoute requiredRole="teacher">
                          <Suspense fallback={<LoadingFallback />}><TeacherDashboard /></Suspense>
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
                          <TeacherClassroomPage />
                        </Suspense>
                      } />

                      {/* Super Admin Dashboard - Protected */}
                      <Route path="/super-admin/*" element={
                        <ImprovedProtectedRoute requiredRole="admin">
                          <Suspense fallback={<LoadingFallback />}><AdminDashboard /></Suspense>
                        </ImprovedProtectedRoute>
                      } />

                      {/* Parent Dashboard - Protected */}
                      <Route path="/parent/*" element={
                        <ImprovedProtectedRoute requiredRole="parent">
                          <Suspense fallback={<LoadingFallback />}>
                            <ParentDashboard />
                          </Suspense>
                        </ImprovedProtectedRoute>
                      } />

                      {/* Community Page - Any Authenticated User */}
                      <Route path="/community/*" element={
                        <ImprovedProtectedRoute>
                          <Suspense fallback={<LoadingFallback />}>
                            <CommunityPage />
                          </Suspense>
                        </ImprovedProtectedRoute>
                      } />

                      {/* Smart Dashboard Router - redirects based on role */}
                      <Route path="/dashboard" element={
                        <ImprovedProtectedRoute>
                          <Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense>
                        </ImprovedProtectedRoute>
                      } />

                      {/* Student Onboarding Flow */}
                      <Route path="/onboarding" element={
                        <ImprovedProtectedRoute requiredRole="student">
                          <Suspense fallback={<LoadingFallback />}><StudentOnboardingFlow /></Suspense>
                        </ImprovedProtectedRoute>
                      } />

                      {/* AI Placement Test */}
                      <Route path="/ai-placement-test" element={
                        <ImprovedProtectedRoute requiredRole="student">
                          <Suspense fallback={<LoadingFallback />}>
                            <AIPlacementTest />
                          </Suspense>
                        </ImprovedProtectedRoute>
                      } />

                      {/* Legacy routes - redirect to new paths */}
                      <Route path="/student/*" element={<Navigate to="/playground" replace />} />
                      <Route path="/teacher" element={<Navigate to="/admin" replace />} />
                      <Route path="/admin-dashboard" element={<Navigate to="/super-admin" replace />} />

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
