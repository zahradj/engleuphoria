
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Classroom from "./pages/Classroom";
import WhiteboardPage from "./pages/WhiteboardPage";
import NotFound from "./pages/NotFound";
import ForParents from "./pages/ForParents";
import ForTeachers from "./pages/ForTeachers";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ParentDashboard from "./pages/ParentDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/classroom/:classId" element={<Classroom />} />
            <Route path="/whiteboard" element={<WhiteboardPage />} />
            <Route path="/for-parents" element={<ForParents />} />
            <Route path="/for-teachers" element={<ForTeachers />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/parent-dashboard" element={<ParentDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
