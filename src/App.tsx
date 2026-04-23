import { Toaster } from "@/components/ui/toaster";
import { ProfileDebugPanel } from "@/components/debug/ProfileDebugPanel";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LessonProvider } from "@/contexts/LessonContext";
import { ThemeModeProvider } from "@/hooks/useThemeMode";
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
const ForTeachersPage = lazy(() => import("./pages/ForTeachersPage"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const StudentSignUp = lazy(() => import("./pages/StudentSignUp"));
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
const UnifiedClassroomPage = lazy(() => import("./pages/UnifiedClassroomPage"));
const AssessmentTaker = lazy(() => import("./components/assessment/AssessmentTaker"));
const AssessmentResults = lazy(() => import("./components/assessment/AssessmentResults"));
const ContentCreatorDashboard = lazy(() => import("./pages/ContentCreatorDashboard"));
const LessonReaderPage = lazy(() => import("./pages/student/LessonReaderPage"));
const LessonLibraryPage = lazy(() => import("./pages/student/LessonLibraryPage"));
const UnsubscribePage = lazy(() => import("./pages/UnsubscribePage"));
const FindTeacher = lazy(() => import("./pages/student/FindTeacher"));
const InterviewRoom = lazy(() => import("./pages/InterviewRoom"));
const SetPassword = lazy(() => import("./pages/SetPassword"));
const TermsOfServicePage = lazy(() => import("./pages/legal/TermsOfServicePage"));
const PrivacyPolicyPage = lazy(() => import("./pages/legal/PrivacyPolicyPage"));
const RefundPolicyPage = lazy(() => import("./pages/legal/RefundPolicyPage"));
const InstallPage = lazy(() => import("./pages/InstallPage"));
const HubConfirmation = lazy(() => import("./pages/HubConfirmation"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));

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
      <ThemeModeProvider>
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
                      <Route path="/teach-with-us" element={<Navigate to="/for-teachers" replace />} />
                      <Route path="/for-teachers" element={<Suspense fallback={<LoadingFallback />}><ForTeachersPage /></Suspense>} />
                      <Route path="/login" element={<Suspense fallback={<LoadingFallback />}><Login /></Suspense>} />
                      <Route path="/signup" element={<Navigate to="/student-signup" replace />} />
                      <Route path="/teacher-signup" element={<Navigate to="/for-teachers" replace />} />
                      <Route path="/student-signup" element={<Suspense fallback={<LoadingFallback />}><StudentSignUp /></Suspense>} />
                      <Route path="/teacher-application" element={<Navigate to="/for-teachers" replace />} />
                      <Route path="/student-application" element={<Suspense fallback={<LoadingFallback />}><StudentApplication /></Suspense>} />
                      <Route path="/email-verification" element={<Suspense fallback={<LoadingFallback />}><EmailVerification /></Suspense>} />
                      <Route path="/reset-password" element={<Suspense fallback={<LoadingFallback />}><ResetPassword /></Suspense>} />
                      <Route path="/set-password" element={<Suspense fallback={<LoadingFallback />}><SetPassword /></Suspense>} />
                      <Route path="/unsubscribe" element={<Suspense fallback={<LoadingFallback />}><UnsubscribePage /></Suspense>} />

                      {/* Legal Pages — Required for Paddle Merchant of Record */}
                      <Route path="/terms-of-service" element={<Suspense fallback={<LoadingFallback />}><TermsOfServicePage /></Suspense>} />
                      <Route path="/privacy-policy" element={<Suspense fallback={<LoadingFallback />}><PrivacyPolicyPage /></Suspense>} />
                      <Route path="/refund-policy" element={<Suspense fallback={<LoadingFallback />}><RefundPolicyPage /></Suspense>} />

                      {/* PWA install instructions */}
                      <Route path="/install" element={<Suspense fallback={<LoadingFallback />}><InstallPage /></Suspense>} />

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

                      {/* Student Dashboard Routes - Protected with hub-level guards */}
                      <Route path="/playground/*" element={
                        <ImprovedProtectedRoute requiredRole="student" requiredStudentLevel="playground">
                          <Suspense fallback={<LoadingFallback />}><StudentDashboard /></Suspense>
                        </ImprovedProtectedRoute>
                      } />
                      <Route path="/academy/*" element={
                        <ImprovedProtectedRoute requiredRole="student" requiredStudentLevel="academy">
                          <Suspense fallback={<LoadingFallback />}><StudentDashboard /></Suspense>
                        </ImprovedProtectedRoute>
                      } />
                      <Route path="/hub/*" element={
                        <ImprovedProtectedRoute requiredRole="student" requiredStudentLevel="professional">
                          <Suspense fallback={<LoadingFallback />}><StudentDashboard /></Suspense>
                        </ImprovedProtectedRoute>
                      } />
                      
                      {/* Find Teacher - Student Protected */}
                      <Route path="/find-teacher" element={
                        <ImprovedProtectedRoute requiredRole="student">
                          <Suspense fallback={<LoadingFallback />}><FindTeacher /></Suspense>
                        </ImprovedProtectedRoute>
                      } />
                      
                      {/* Teacher Dashboard - Protected */}
                      <Route path="/teacher/*" element={
                        <ImprovedProtectedRoute requiredRole="teacher">
                          <Suspense fallback={<LoadingFallback />}><TeacherDashboard /></Suspense>
                        </ImprovedProtectedRoute>
                      } />
                      
                      {/* Unified Live Classroom - Any authenticated user, access validated inside */}
                      <Route path="/classroom/:id" element={
                        <ImprovedProtectedRoute>
                          <Suspense fallback={<LoadingFallback />}>
                            <UnifiedClassroomPage />
                          </Suspense>
                        </ImprovedProtectedRoute>
                      } />

                      {/* Legacy student-classroom route redirects to unified */}
                      <Route path="/student-classroom/:id" element={
                        <ImprovedProtectedRoute>
                          <Suspense fallback={<LoadingFallback />}>
                            <UnifiedClassroomPage />
                          </Suspense>
                        </ImprovedProtectedRoute>
                      } />

                      {/* Demo Classroom - No Auth Required */}
                      <Route path="/demo-classroom/:id" element={
                        <Suspense fallback={<LoadingFallback />}>
                          <TeacherClassroomPage />
                        </Suspense>
                      } />

                      {/* Interview Room - Auth Required */}
                      <Route path="/interview/:token" element={
                        <ImprovedProtectedRoute>
                          <Suspense fallback={<LoadingFallback />}>
                            <InterviewRoom />
                          </Suspense>
                        </ImprovedProtectedRoute>
                      } />

                      {/* Super Admin Dashboard - Protected */}
                      <Route path="/super-admin/*" element={
                        <ImprovedProtectedRoute requiredRole="admin">
                          <Suspense fallback={<LoadingFallback />}><AdminDashboard /></Suspense>
                        </ImprovedProtectedRoute>
                      } />

                      {/* Content Creator Dashboard - Protected */}
                      <Route path="/content-creator/*" element={
                        <ImprovedProtectedRoute requiredRole="content_creator">
                          <Suspense fallback={<LoadingFallback />}>
                            <ContentCreatorDashboard />
                          </Suspense>
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

                      {/* Hub Confirmation — post-signup step */}
                      <Route path="/hub-confirmation" element={
                        <ImprovedProtectedRoute requiredRole="student">
                          <Suspense fallback={<LoadingFallback />}><HubConfirmation /></Suspense>
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

                      {/* Lesson Library */}
                      <Route path="/library" element={
                        <Suspense fallback={<LoadingFallback />}>
                          <LessonLibraryPage />
                        </Suspense>
                      } />

                      {/* Immersive Lesson Reader / App-Shell Player */}
                      <Route path="/lesson/:id" element={
                        <Suspense fallback={<LoadingFallback />}>
                          <LessonReaderPage />
                        </Suspense>
                      } />

                      {/* Auth callback for email confirmation */}
                      <Route path="/auth/callback" element={<AuthCallback />} />

                      {/* Legacy routes - redirect to new paths */}
                      <Route path="/student/*" element={<Navigate to="/playground" replace />} />
                      <Route path="/admin/*" element={<Navigate to="/teacher" replace />} />
                      <Route path="/admin-dashboard" element={<Navigate to="/super-admin" replace />} />

                      {/* 404 - Redirect to Login */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <ProfileDebugPanel />
                  </AppErrorBoundary>
                </BrowserRouter>
              </TooltipProvider>
            </RoleThemeProvider>
          </LessonProvider>
        </AuthProvider>
      </LanguageProvider>
      </ThemeModeProvider>
    </QueryClientProvider>
  );
};

export default App;
