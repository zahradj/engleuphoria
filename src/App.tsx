
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
import ESLClassroom from "./pages/ESLClassroom";
import OneOnOneClassroom from "./pages/OneOnOneClassroom";
import Classroom from "./pages/Classroom";
import WhiteboardPage from "./pages/WhiteboardPage";
import ForParents from "./pages/ForParents";
import ForTeachers from "./pages/ForTeachers";
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
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/esl-classroom" element={<ESLClassroom />} />
            <Route path="/one-on-one-classroom" element={<OneOnOneClassroom />} />
            <Route path="/classroom" element={<Classroom />} />
            <Route path="/whiteboard" element={<WhiteboardPage />} />
            <Route path="/for-parents" element={<ForParents />} />
            <Route path="/for-teachers" element={<ForTeachers />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
