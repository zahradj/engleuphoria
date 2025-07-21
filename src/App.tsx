
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

// Import pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import StudentDashboard from "./pages/StudentDashboard";
import ForParents from "./pages/ForParents";
import ForTeachers from "./pages/ForTeachers";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthRedirect } from "./components/auth/AuthRedirect";

// Classroom and Learning pages
import OneOnOneClassroomNew from "./pages/OneOnOneClassroomNew";
import WhiteboardPage from "./pages/WhiteboardPage";
import SpeakingPractice from "./pages/student/SpeakingPractice";

// Teacher pages
import TeacherDashboard from "./pages/TeacherDashboard";
import LessonPlanCreator from "./pages/LessonPlanCreator";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={
                <AuthRedirect>
                  <Login />
                </AuthRedirect>
              } />
              <Route path="/signup" element={
                <AuthRedirect>
                  <SignUp />
                </AuthRedirect>
              } />
              <Route path="/for-parents" element={<ForParents />} />
              <Route path="/for-teachers" element={<ForTeachers />} />
              <Route path="/about" element={<AboutUs />} />
              
              {/* Protected Routes - Require Authentication */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              
              {/* Classroom Routes - Protected */}
              <Route path="/oneonone-classroom-new" element={
                <ProtectedRoute>
                  <OneOnOneClassroomNew />
                </ProtectedRoute>
              } />
              <Route path="/classroom/:classId" element={
                <ProtectedRoute>
                  <OneOnOneClassroomNew />
                </ProtectedRoute>
              } />
              
              {/* Learning Routes - Protected */}
              <Route path="/whiteboard" element={
                <ProtectedRoute>
                  <WhiteboardPage />
                </ProtectedRoute>
              } />
              <Route path="/speaking-practice" element={
                <ProtectedRoute>
                  <SpeakingPractice />
                </ProtectedRoute>
              } />
              
              {/* Teacher Routes - Protected */}
              <Route path="/teacher-dashboard" element={
                <ProtectedRoute requiredRole="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              } />
              <Route path="/lesson-creator" element={
                <ProtectedRoute requiredRole="teacher">
                  <LessonPlanCreator />
                </ProtectedRoute>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </LanguageProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;
