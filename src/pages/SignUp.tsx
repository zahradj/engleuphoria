
import { useAuth } from "@/hooks/useAuth";
import { SupabaseSetupPage } from "@/components/signup/SupabaseSetupPage";
import { SignUpHeader } from "@/components/signup/SignUpHeader";
import { SignUpFooter } from "@/components/signup/SignUpFooter";
import { SignUpBackground } from "@/components/signup/SignUpBackground";
import { SignUpForm } from "@/components/signup/SignUpForm";

const SignUp = () => {
  const { isConfigured } = useAuth();
  
  // Show Supabase setup if not configured
  if (!isConfigured) {
    return <SupabaseSetupPage />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <SignUpBackground />
      <SignUpHeader />
      
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <SignUpForm />
      </main>
      
      <SignUpFooter />
    </div>
  );
};

export default SignUp;
