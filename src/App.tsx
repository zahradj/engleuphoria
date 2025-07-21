
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
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/for-parents" element={<ForParents />} />
              <Route path="/for-teachers" element={<ForTeachers />} />
              <Route path="/about" element={<AboutUs />} />
              
              {/* Classroom Routes */}
              <Route path="/oneonone-classroom-new" element={<OneOnOneClassroomNew />} />
              <Route path="/classroom/:classId" element={<OneOnOneClassroomNew />} />
              
              {/* Learning Routes */}
              <Route path="/whiteboard" element={<WhiteboardPage />} />
              <Route path="/speaking-practice" element={<SpeakingPractice />} />
              
              {/* Teacher Routes */}
              <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
              <Route path="/lesson-creator" element={<LessonPlanCreator />} />
              
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
