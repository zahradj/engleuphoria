
import { useClassroomAuth } from "@/hooks/useClassroomAuth";
import { Navigate } from "react-router-dom";
import { SignUpHeader } from "@/components/signup/SignUpHeader";
import { SignUpFooter } from "@/components/signup/SignUpFooter";
import { SignUpBackground } from "@/components/signup/SignUpBackground";
import { EnhancedSignUpForm } from "@/components/signup/EnhancedSignUpForm";

const SignUp = () => {
  const { user, loading } = useClassroomAuth();
  
  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Redirect authenticated users to their dashboard
  if (user) {
    return <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <SignUpBackground />
      <SignUpHeader />
      
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <EnhancedSignUpForm />
      </main>
      
      <SignUpFooter />
    </div>
  );
};

export default SignUp;
