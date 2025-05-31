
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Import pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import StudentDashboard from "@/pages/StudentDashboard";
import ClassroomPage from "@/pages/ClassroomPage";
import SimpleClassroomSelector from "@/pages/SimpleClassroomSelector";
import TeacherDashboard from "@/pages/TeacherDashboard";
import LessonPlanCreator from "@/pages/LessonPlanCreator";
import LessonScheduler from "@/pages/LessonScheduler";
import StudentLessonScheduler from "@/pages/StudentLessonScheduler";
import StudentManagement from "@/pages/StudentManagement";
import ForParents from "@/pages/ForParents";
import ForTeachers from "@/pages/ForTeachers";
import PaymentPage from "@/pages/PaymentPage";
import NotFound from "@/pages/NotFound";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/classroom" element={<ClassroomPage />} />
            <Route path="/classroom-selector" element={<SimpleClassroomSelector />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/lesson-plan-creator" element={<LessonPlanCreator />} />
            <Route path="/lesson-scheduler" element={<LessonScheduler />} />
            <Route path="/student-lesson-scheduler" element={<StudentLessonScheduler />} />
            <Route path="/student-management" element={<StudentManagement />} />
            <Route path="/for-parents" element={<ForParents />} />
            <Route path="/for-teachers" element={<ForTeachers />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
