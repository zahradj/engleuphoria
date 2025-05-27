
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ClassroomPage from "./pages/ClassroomPage";
import SimpleClassroomSelector from "./pages/SimpleClassroomSelector";
import PaymentPage from "./pages/PaymentPage";
import ForParents from "./pages/ForParents";
import ForTeachers from "./pages/ForTeachers";
import LessonPlanCreatorPage from "./pages/LessonPlanCreator";
import StudentManagement from "./pages/StudentManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/for-parents" element={<ForParents />} />
            <Route path="/for-teachers" element={<ForTeachers />} />
            
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/payment" element={<PaymentPage />} />
            
            {/* User Dashboards */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            
            {/* Teacher Features */}
            <Route path="/lesson-plan-creator" element={<LessonPlanCreatorPage />} />
            <Route path="/student-management" element={<StudentManagement />} />
            
            {/* Classroom Routes */}
            <Route path="/classroom-selector" element={<SimpleClassroomSelector />} />
            <Route path="/classroom" element={<ClassroomPage />} />
            
            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
