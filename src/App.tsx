
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OneOnOneClassroom from "./pages/OneOnOneClassroom";
import UnifiedClassroom from "./pages/UnifiedClassroom";
import BecomeTeacher from "./pages/BecomeTeacher";
import ForParents from "./pages/ForParents";
import About from "./pages/About";
import MediaTest from "./pages/MediaTest";
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/oneonone-classroom" element={<OneOnOneClassroom />} />
              <Route path="/oneonone-classroom-new" element={<OneOnOneClassroom />} />
              <Route path="/classroom" element={<UnifiedClassroom />} />
              <Route path="/unified-classroom" element={<UnifiedClassroom />} />
              <Route path="/become-teacher" element={<BecomeTeacher />} />
              <Route path="/for-parents" element={<ForParents />} />
              <Route path="/about" element={<About />} />
              <Route path="/media-test" element={<MediaTest />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
