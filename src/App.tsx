
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";

// Lazy load pages for better performance
const EnhancedIndex = lazy(() => import("./pages/EnhancedIndex"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForParents = lazy(() => import("./pages/ForParents"));
const ForTeachers = lazy(() => import("./pages/ForTeachers"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const OneOnOneClassroomNew = lazy(() => import("./pages/OneOnOneClassroomNew"));
const SimpleClassroomSelector = lazy(() => import("./pages/SimpleClassroomSelector"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/enhanced" element={<EnhancedIndex />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/for-parents" element={<ForParents />} />
                  <Route path="/for-teachers" element={<ForTeachers />} />
                  <Route path="/student-dashboard" element={<StudentDashboard />} />
                  <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
                  <Route path="/oneonone-classroom-new" element={<OneOnOneClassroomNew />} />
                  <Route path="/classroom-selector" element={<SimpleClassroomSelector />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
