
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OneOnOneClassroomNew from "./pages/OneOnOneClassroomNew";
import UnifiedClassroom from "./pages/UnifiedClassroom";
import BecomeTeacher from "./pages/BecomeTeacher";
import ForParents from "./pages/ForParents";
import AboutUs from "./pages/AboutUs";
import MediaTestPage from "./pages/MediaTestPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/oneonone-classroom" element={<OneOnOneClassroomNew />} />
              <Route path="/oneonone-classroom-new" element={<OneOnOneClassroomNew />} />
              <Route path="/classroom" element={<UnifiedClassroom />} />
              <Route path="/unified-classroom" element={<UnifiedClassroom />} />
              <Route path="/become-teacher" element={<BecomeTeacher />} />
              <Route path="/for-parents" element={<ForParents />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/media-test" element={<MediaTestPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
