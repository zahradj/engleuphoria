import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ImprovedProtectedRoute } from "@/components/auth/ImprovedProtectedRoute";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherSignup from "./pages/TeacherSignup";
import StudentSignup from "./pages/StudentSignup";
import TeacherApplication from "./pages/TeacherApplication";
import StudentApplication from "./pages/StudentApplication";
import OneOnOneClassroom from "./pages/OneOnOneClassroom";
import OneOnOneClassroomNew from "./pages/OneOnOneClassroomNew";
import SpeakingPracticeDashboard from "./pages/SpeakingPracticeDashboard";
import AIConversationPractice from "./pages/AIConversationPractice";
import SpeakingGroups from "./pages/SpeakingGroups";
import SpeakingGroupSession from "./pages/SpeakingGroupSession";
import TeacherProfile from "./pages/TeacherProfile";
import BookingConfirmation from "./pages/BookingConfirmation";
import Communities from "./pages/Communities";
import CommunityDetails from "./pages/CommunityDetails";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/teacher-signup" element={<TeacherSignup />} />
              <Route path="/student-signup" element={<StudentSignup />} />
              <Route path="/teacher-application" element={<TeacherApplication />} />
              <Route path="/student-application" element={<StudentApplication />} />
              
              {/* Protected Routes */}
              <Route path="/student" element={
                <ImprovedProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ImprovedProtectedRoute>
              } />
              
              <Route path="/teacher" element={
                <ImprovedProtectedRoute requiredRole="teacher">
                  <TeacherDashboard />
                </ImprovedProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ImprovedProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ImprovedProtectedRoute>
              } />
              
              {/* Generic dashboard route that redirects based on role */}
              <Route path="/dashboard" element={
                <ImprovedProtectedRoute>
                  <div>Redirecting...</div>
                </ImprovedProtectedRoute>
              } />
              
              {/* Other protected routes */}
              <Route path="/oneonone-classroom" element={
                <ImprovedProtectedRoute>
                  <OneOnOneClassroom />
                </ImprovedProtectedRoute>
              } />
              
              <Route path="/oneonone-classroom-new" element={
                <ImprovedProtectedRoute>
                  <OneOnOneClassroomNew />
                </ImprovedProtectedRoute>
              } />
              
              <Route path="/speaking-practice" element={
                <ImprovedProtectedRoute>
                  <SpeakingPracticeDashboard />
                </ImprovedProtectedRoute>
              } />
              
              <Route path="/ai-conversation" element={
                <ImprovedProtectedRoute>
                  <AIConversationPractice />
                </ImprovedProtectedRoute>
              } />
              
              <Route path="/speaking-groups" element={
                <ImprovedProtectedRoute>
                  <SpeakingGroups />
                </ImprovedProtectedRoute>
              } />
              
              <Route path="/speaking-group/:id" element={
                <ImprovedProtectedRoute>
                  <SpeakingGroupSession />
                </ImprovedProtectedRoute>
              } />
              
              <Route path="/teacher/:id" element={
                <ImprovedProtectedRoute>
                  <TeacherProfile />
                </ImprovedProtectedRoute>
              } />
              
              <Route path="/booking-confirmation" element={
                <ImprovedProtectedRoute>
                  <BookingConfirmation />
                </ImprovedProtectedRoute>
              } />
              
              <Route path="/communities" element={
                <ImprovedProtectedRoute>
                  <Communities />
                </ImprovedProtectedRoute>
              } />
              
              <Route path="/community/:id" element={
                <ImprovedProtectedRoute>
                  <CommunityDetails />
                </ImprovedProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ImprovedProtectedRoute>
                  <Settings />
                </ImprovedProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
