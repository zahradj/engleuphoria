
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

// Import pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import ForParents from "./pages/ForParents";
import ForTeachers from "./pages/ForTeachers";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

// Classroom and Learning pages
import OneononeClassroomNew from "./pages/OneononeClassroomNew";
import StudyCalendar from "./pages/StudyCalendar";
import VocabularyPractice from "./pages/VocabularyPractice";
import ResourceLibrary from "./pages/ResourceLibrary";
import Whiteboard from "./pages/Whiteboard";
import InteractiveStories from "./pages/InteractiveStories";
import Achievements from "./pages/Achievements";
import ProgressTracker from "./pages/ProgressTracker";

// Teacher pages
import TeacherDashboard from "./pages/TeacherDashboard";
import LessonPlanCreator from "./pages/LessonPlanCreator";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/for-parents" element={<ForParents />} />
              <Route path="/for-teachers" element={<ForTeachers />} />
              <Route path="/about" element={<About />} />
              
              {/* Classroom Routes */}
              <Route path="/oneonone-classroom-new" element={<OneononeClassroomNew />} />
              <Route path="/classroom/:classId" element={<OneononeClassroomNew />} />
              
              {/* Learning Routes */}
              <Route path="/calendar" element={<StudyCalendar />} />
              <Route path="/vocabulary" element={<VocabularyPractice />} />
              <Route path="/resources" element={<ResourceLibrary />} />
              <Route path="/whiteboard" element={<Whiteboard />} />
              <Route path="/stories" element={<InteractiveStories />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/progress" element={<ProgressTracker />} />
              
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
    </I18nextProvider>
  );
}

export default App;
