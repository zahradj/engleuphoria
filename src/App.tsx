
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ClassroomAuthProvider, useClassroomAuth } from "@/hooks/useClassroomAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Pages
import { Login } from "@/pages/Login";
import { TeacherDashboard } from "@/pages/TeacherDashboard";
import { StudentDashboard } from "@/pages/StudentDashboard";
import { ProtectedClassroom } from "@/components/classroom/ProtectedClassroom";
import UnifiedClassroom from "@/pages/UnifiedClassroom";

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'teacher' | 'student' }) => {
  const { user, loading } = useClassroomAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace />;
  }

  return <>{children}</>;
};

// App Routes Component
const AppRoutes = () => {
  const { user, loading } = useClassroomAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace /> : <Login />} 
      />

      {/* Dashboard Routes */}
      <Route 
        path="/teacher" 
        element={
          <ProtectedRoute requiredRole="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/student" 
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Classroom Routes - Protected */}
      <Route 
        path="/classroom/teacher/:roomId" 
        element={
          <ProtectedRoute requiredRole="teacher">
            <ProtectedClassroom userRole="teacher" />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/classroom/student/:roomId" 
        element={
          <ProtectedRoute requiredRole="student">
            <ProtectedClassroom userRole="student" />
          </ProtectedRoute>
        } 
      />

      {/* Legacy/Test Routes */}
      <Route 
        path="/classroom" 
        element={
          <ProtectedRoute>
            <UnifiedClassroom />
          </ProtectedRoute>
        } 
      />

      {/* Root Route - Redirect based on auth status */}
      <Route 
        path="/" 
        element={
          user ? (
            <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* Catch-all Route */}
      <Route 
        path="*" 
        element={<Navigate to="/" replace />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <LanguageProvider>
      <ClassroomAuthProvider>
        <Router>
          <div className="min-h-screen">
            <AppRoutes />
            <Toaster />
          </div>
        </Router>
      </ClassroomAuthProvider>
    </LanguageProvider>
  );
}

export default App;
