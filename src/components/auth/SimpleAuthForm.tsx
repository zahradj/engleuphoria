import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, CheckCircle, XCircle, Mail, Lock, User, GraduationCap, BookOpen, Sparkles, Shield, Zap, Calendar } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';
interface SimpleAuthFormProps {
  mode: 'login' | 'signup';
  onModeChange?: (mode: 'login' | 'signup') => void;
}
interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'teacher' | 'admin';
  dateOfBirth: string;
}

// Calculate age from date of birth and return system tag
const calculateSystemTag = (dateOfBirth: string): 'KIDS' | 'TEENS' | 'ADULTS' => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  if (age >= 4 && age <= 10) return 'KIDS';
  if (age >= 11 && age <= 17) return 'TEENS';
  return 'ADULTS';
};

// Redirect user based on role and system tag
const getRedirectPath = (role: string, systemTag: string | null): string => {
  // Admin goes to super-admin dashboard
  if (role === 'admin') {
    return '/super-admin';
  }
  
  // Teacher goes to admin (teacher workspace)
  if (role === 'teacher') {
    return '/admin';
  }
  
  // Students go to playground (DashboardRouter handles system selection internally)
  if (role === 'student') {
    return '/playground';
  }
  
  return '/';
};
const passwordRequirements = [{
  test: (pwd: string) => pwd.length >= 6,
  text: "At least 6 characters"
}, {
  test: (pwd: string) => /[A-Z]/.test(pwd),
  text: "One uppercase letter"
}, {
  test: (pwd: string) => /[0-9]/.test(pwd),
  text: "One number"
}, {
  test: (pwd: string) => /[!@#$%^&*]/.test(pwd),
  text: "One special character"
}];
export const SimpleAuthForm: React.FC<SimpleAuthFormProps> = ({
  mode,
  onModeChange
}) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    dateOfBirth: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const {
    signIn,
    signUp,
    resetPassword,
    user,
    isConfigured,
    error
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();

  // Do not auto-redirect away from auth pages; post-login navigation is handled on submit
  React.useEffect(() => {
    if (error) {
      console.warn('Auth error:', error);
    }
  }, [error]);
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };
  const getPasswordStrength = (): number => {
    return passwordRequirements.filter(req => req.test(formData.password)).length;
  };
  const validateForm = (): boolean => {
    if (!validateEmail(formData.email)) return false;
    if (mode === 'signup') {
      if (!formData.fullName.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter your full name.",
          variant: "destructive"
        });
        return false;
      }
      if (getPasswordStrength() < 3) {
        toast({
          title: "Password Too Weak",
          description: "Password must meet at least 3 security requirements.",
          variant: "destructive"
        });
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Passwords Don't Match",
          description: "Please make sure both passwords are identical.",
          variant: "destructive"
        });
        return false;
      }
    } else {
      if (formData.password.length < 6) {
        toast({
          title: "Invalid Password",
          description: "Password must be at least 6 characters long.",
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (!isConfigured) {
        toast({
          title: "Authentication Error",
          description: "Supabase not configured. Please check your environment setup.",
          variant: "destructive"
        });
        return;
      }
      if (mode === 'login') {
        const {
          data,
          error
        } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message || "Invalid email or password.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Login Successful",
            description: "Welcome back!"
          });

          // Fetch user role and system tag for role-based redirection
          setTimeout(async () => {
            try {
              const userId = data.user?.id;
              if (!userId) {
                navigate('/dashboard', { replace: true });
                return;
              }

              // Fetch role from user_roles table
              const { data: roleData } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', userId)
                .single();

              // Fetch system tag from users table
              const { data: userData } = await supabase
                .from('users')
                .select('current_system')
                .eq('id', userId)
                .single();

              const userRole = roleData?.role || 'student';
              const systemTag = userData?.current_system || null;
              
              const redirectPath = getRedirectPath(userRole, systemTag);
              navigate(redirectPath, { replace: true });
            } catch (err) {
              console.error('Error fetching user data for redirect:', err);
              navigate('/dashboard', { replace: true });
            }
          }, 100);
        }
      } else {
        // Calculate system tag based on DOB for students
        const systemTag = formData.role === 'student' && formData.dateOfBirth 
          ? calculateSystemTag(formData.dateOfBirth)
          : null;

        const {
          data: signUpData,
          error
        } = await signUp(formData.email, formData.password, {
          role: formData.role,
          full_name: formData.fullName,
          system_tag: systemTag
        } as any);
        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error.message || "Failed to create account.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Account Created Successfully!",
            description: systemTag 
              ? `You've been assigned to the ${systemTag} program based on your age.`
              : "Please check your email to verify your account."
          });

          // Send admin notification email (fire and forget)
          supabase.functions.invoke('notify-admin-new-registration', {
            body: {
              name: formData.fullName,
              email: formData.email,
              role: formData.role,
              systemTag: systemTag,
              registeredAt: new Date().toISOString()
            }
          }).catch(err => console.error('Failed to send admin notification:', err));

          // Navigate based on role
          if (formData.role === 'teacher') {
            navigate('/teacher-application');
          } else if (formData.role === 'student') {
            // If student with system tag, redirect to appropriate system
            if (systemTag) {
              const redirectPath = getRedirectPath('student', systemTag);
              toast({
                title: "Redirecting...",
                description: `Taking you to your ${systemTag} learning environment!`
              });
              navigate(redirectPath);
            } else {
              navigate('/student-application');
            }
          } else {
            navigate('/login');
          }
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (field === 'email') {
      validateEmail(value);
    }
  };
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(resetEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    setResetLoading(true);
    try {
      const {
        error
      } = await resetPassword(resetEmail);
      if (error) {
        toast({
          title: "Reset Failed",
          description: error.message || "Failed to send reset email.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Reset Email Sent",
          description: "Check your email for password reset instructions."
        });
        setShowForgotPassword(false);
        setResetEmail('');
      }
    } catch (error) {
      toast({
        title: "Reset Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setResetLoading(false);
    }
  };
  const gradientClass = 'from-[#dfc7cc]/40 via-[#d4b5bd]/30 to-[#c7a8b3]/40';
  const backgroundGradient = 'from-primary/10 via-primary/5 to-accent/10';
  return <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50/8 via-[#f0e4e8]/10 to-rose-100/8">
      {/* Playful background decorations */}
      <div className="absolute inset-0">
        {/* Large floating orbs - MORE VIBRANT */}
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-rose-300/25 to-pink-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-cyan-400/25 rounded-full mix-blend-multiply filter blur-2xl animate-float-delayed"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-teal-400/18 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-yellow-300/20 to-amber-400/15 rounded-full mix-blend-multiply filter blur-2xl animate-float-delayed"></div>
        
        {/* Evenly Distributed Balloons - Grid System - MORE VISIBLE */}
        {/* Row 1 - Top 10% */}
        <div className="absolute top-[10%] left-[5%] w-14 h-18 bg-gradient-to-b from-red-400/50 to-red-500/45 rounded-full animate-float-slow shadow-lg">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-400/40"></div>
        </div>
        <div className="absolute top-[10%] left-[20%] w-12 h-15 bg-gradient-to-b from-blue-400/50 to-blue-500/45 rounded-full animate-bounce shadow-lg">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-5 bg-gray-400/40"></div>
        </div>
        <div className="absolute top-[10%] left-[35%] w-16 h-20 bg-gradient-to-b from-yellow-400/55 to-yellow-500/50 rounded-full animate-float-delayed shadow-lg">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-7 bg-gray-400/40"></div>
        </div>
        <div className="absolute top-[10%] right-[35%] w-10 h-13 bg-gradient-to-b from-green-400/50 to-green-500/45 rounded-full animate-bounce delay-300 shadow-lg">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-400/40"></div>
        </div>
        <div className="absolute top-[10%] right-[20%] w-13 h-16 bg-gradient-to-b from-[#d4b5bd]/40 to-[#c7a8b3]/35 rounded-full animate-float-slow shadow-lg">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-5 bg-gray-400/40"></div>
        </div>
        <div className="absolute top-[10%] right-[5%] w-11 h-14 bg-gradient-to-b from-pink-400/55 to-pink-500/50 rounded-full animate-bounce delay-700 shadow-lg">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-400/40"></div>
        </div>

        {/* Row 2 - Middle 50% */}
        <div className="absolute top-[50%] left-[5%] w-18 h-22 bg-gradient-to-b from-orange-400/50 to-orange-500/45 rounded-full animate-float-delayed shadow-lg">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gray-400/40"></div>
        </div>
        <div className="absolute top-[50%] left-[20%] w-9 h-12 bg-gradient-to-b from-teal-400/50 to-teal-500/45 rounded-full animate-bounce delay-500 shadow-lg">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-gray-400/40"></div>
        </div>
        <div className="absolute top-[50%] left-[35%] w-15 h-19 bg-gradient-to-b from-[#dfc7cc]/40 to-[#d4b5bd]/35 rounded-full animate-float-slow shadow-lg">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-400/40"></div>
        </div>
        <div className="absolute top-[50%] right-[35%] w-12 h-15 bg-gradient-to-b from-cyan-400/50 to-cyan-500/45 rounded-full animate-bounce delay-200 shadow-lg">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-5 bg-gray-400/40"></div>
        </div>
        <div className="absolute top-[50%] right-[20%] w-17 h-21 bg-gradient-to-b from-[#ead9de]/45 to-[#dfc7cc]/40 rounded-full animate-float-delayed shadow-lg">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-7 bg-gray-400/40"></div>
        </div>
        <div className="absolute top-[50%] right-[5%] w-8 h-11 bg-gradient-to-b from-rose-400/50 to-rose-500/45 rounded-full animate-bounce delay-800 shadow-lg">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-gray-400/40"></div>
        </div>

        {/* Row 3 - Bottom 90% */}
        <div className="absolute bottom-[10%] left-[5%] w-20 h-24 bg-gradient-to-b from-lime-400/50 to-lime-500/45 rounded-full animate-float-slow shadow-lg">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-9 bg-gray-400/40"></div>
        </div>
        <div className="absolute bottom-[10%] left-[20%] w-14 h-17 bg-gradient-to-b from-amber-400/55 to-amber-500/50 rounded-full animate-bounce delay-400 shadow-lg">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-5 bg-gray-400/40"></div>
        </div>
        <div className="absolute bottom-[10%] left-[35%] w-10 h-13 bg-gradient-to-b from-emerald-400/50 to-emerald-500/45 rounded-full animate-float-delayed shadow-lg">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-400/40"></div>
        </div>
        <div className="absolute bottom-[10%] right-[35%] w-16 h-19 bg-gradient-to-b from-rose-400/55 to-rose-500/50 rounded-full animate-bounce delay-600 shadow-lg">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-400/40"></div>
        </div>
        <div className="absolute bottom-[10%] right-[20%] w-13 h-16 bg-gradient-to-b from-sky-400/50 to-sky-500/45 rounded-full animate-float-slow shadow-lg">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-5 bg-gray-400/40"></div>
        </div>
        <div className="absolute bottom-[10%] right-[5%] w-11 h-14 bg-gradient-to-b from-violet-400/50 to-violet-500/45 rounded-full animate-bounce delay-900 shadow-lg">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-400/40"></div>
        </div>
        
        {/* Sparkling dots - MORE VISIBLE */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-400/50 rounded-full animate-bounce shadow-md"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-pink-400/55 rounded-full animate-bounce delay-300 shadow-md"></div>
        <div className="absolute top-1/2 left-3/4 w-2.5 h-2.5 bg-blue-400/50 rounded-full animate-bounce delay-700 shadow-md"></div>
        <div className="absolute top-1/6 right-1/3 w-1.5 h-1.5 bg-[#dfc7cc]/40 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-emerald-400/50 rounded-full animate-bounce delay-500 shadow-md"></div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/10"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        {/* Return Home Tab */}
        <div className="absolute top-6 left-6">
          <Button variant="outline" onClick={() => navigate('/')} className="bg-surface/90 backdrop-blur-sm border-2 border-[#dfc7cc]/15 text-[#b5919e]/80 hover:bg-[#f0e4e8]/30 hover:border-[#dfc7cc]/30 hover:text-[#b5919e] shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl px-8 py-3 font-semibold text-base">
            <span className="mr-2 text-2xl">🏠</span>
            Return Home
          </Button>
        </div>

        <div className="w-full max-w-md">
          

          <Card className="relative bg-white/80 backdrop-blur-xl border-2 border-[#ead9de]/30 overflow-hidden rounded-3xl shadow-[0_0_40px_rgba(223,199,204,0.3),0_0_80px_rgba(147,197,253,0.2),0_0_120px_rgba(167,243,208,0.15),0_20px_60px_rgba(0,0,0,0.1)]">
            {/* Multi-color glowing border effect */}
            <div className="absolute -inset-3 bg-gradient-to-r from-rose-400/30 via-blue-400/25 to-emerald-400/30 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-300/20 via-pink-400/25 to-cyan-400/20 rounded-3xl blur-lg opacity-50 animate-pulse delay-500"></div>
            
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-inner">
              <CardHeader className="text-center pb-8 pt-10 bg-gradient-to-b from-[#f0e4e8]/5 to-surface/50">
                {/* Fun floating icon */}
                <div className="flex justify-center mb-8">
                  <div className={`relative w-24 h-24 rounded-full bg-gradient-to-r ${gradientClass} flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 animate-bounce`}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent"></div>
                    <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-rose-200/10 to-[#ead9de]/10 blur-xl animate-pulse"></div>
                    {mode === 'login' ? <img src="/lovable-uploads/349cfbe2-60a4-4dcc-a3b6-c410c4da02f3.png" alt="Logo" className="h-16 w-16 relative z-10 object-contain" /> : formData.role === 'teacher' ? <GraduationCap className="h-12 w-12 text-white relative z-10 drop-shadow-lg" /> : <img src="/lovable-uploads/349cfbe2-60a4-4dcc-a3b6-c410c4da02f3.png" alt="Logo" className="h-16 w-16 relative z-10 object-contain" />}
                  </div>
                </div>
                
                <CardTitle className="text-4xl font-black bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4 drop-shadow-sm">
                  {mode === 'login' ? 'Welcome Back! 🎊' : 'Join the Magic! ✨'}
                </CardTitle>
                <CardDescription className="text-primary text-lg font-semibold">
                  {mode === 'login' ? 'Ready to continue your amazing journey? 🚀' : 'Start your extraordinary English adventure today! 🌟'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg backdrop-blur-sm">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {mode === 'signup' && <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium text-slate-800">
                      Full Name
                      </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-slate-800 transition-colors" />
                        <Input id="fullName" value={formData.fullName} onChange={e => handleInputChange('fullName', e.target.value)} placeholder="Enter your full name" disabled={loading} required className="h-14 pl-12 bg-white/50 border-[#ead9de]/25 text-slate-700 placeholder:text-slate-500 focus:bg-white/70 focus:border-[#dfc7cc]/50 focus:ring-2 focus:ring-[#f0e4e8]/30 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md" />
                      </div>
                    </div>}

                  <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-800">
                    Email Address
                    </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-slate-800 transition-colors" />
                      <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} placeholder="your.email@example.com" disabled={loading} required className={`h-14 pl-12 bg-white/50 border-[#ead9de]/25 text-slate-700 placeholder:text-slate-500 focus:bg-white/70 focus:border-[#dfc7cc]/50 focus:ring-2 focus:ring-[#f0e4e8]/30 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md ${emailError ? 'border-red-400/80 focus:border-red-400' : ''}`} />
                    </div>
                    {emailError && <p className="text-sm text-red-700 animate-fade-in">{emailError}</p>}
                  </div>

                  {mode === 'signup' && <div className="space-y-2">
                      <label htmlFor="role" className="text-sm font-medium text-slate-800">
                        I am a...
                      </label>
                      <select id="role" value={formData.role} onChange={e => handleInputChange('role', e.target.value as 'student' | 'teacher' | 'admin')} className="w-full h-14 px-4 bg-white/50 border border-[#ead9de]/25 text-slate-700 rounded-xl focus:bg-white/70 focus:border-[#dfc7cc]/50 focus:ring-2 focus:ring-[#f0e4e8]/30 transition-all duration-300 shadow-sm hover:shadow-md" disabled={loading}>
                        <option value="student" className="bg-white text-slate-800">Student - Learn & Grow</option>
                        <option value="teacher" className="bg-white text-slate-800">Teacher - Inspire & Educate</option>
                      </select>
                    </div>}

                  {mode === 'signup' && formData.role === 'student' && <div className="space-y-2">
                      <label htmlFor="dateOfBirth" className="text-sm font-medium text-slate-800">
                        Date of Birth
                      </label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-slate-800 transition-colors" />
                        <Input 
                          id="dateOfBirth" 
                          type="date" 
                          value={formData.dateOfBirth} 
                          onChange={e => handleInputChange('dateOfBirth', e.target.value)} 
                          disabled={loading} 
                          required
                          max={new Date().toISOString().split('T')[0]}
                          className="h-14 pl-12 bg-white/50 border-[#ead9de]/25 text-slate-700 focus:bg-white/70 focus:border-[#dfc7cc]/50 focus:ring-2 focus:ring-[#f0e4e8]/30 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md" 
                        />
                      </div>
                      {formData.dateOfBirth && (
                        <p className="text-xs text-slate-600 flex items-center gap-1">
                          <span className="font-medium">System assignment:</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            calculateSystemTag(formData.dateOfBirth) === 'KIDS' ? 'bg-green-100 text-green-700' :
                            calculateSystemTag(formData.dateOfBirth) === 'TEENS' ? 'bg-purple-100 text-purple-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {calculateSystemTag(formData.dateOfBirth)} Program
                          </span>
                        </p>
                      )}
                    </div>}

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-slate-800">
                      Password
                    </label>
                    <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-slate-800 transition-colors" />
                      <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={e => handleInputChange('password', e.target.value)} placeholder={mode === 'login' ? "Enter your password" : "Create a secure password"} disabled={loading} required className="h-14 pl-12 pr-12 bg-white/50 border-[#ead9de]/25 text-slate-700 placeholder:text-slate-500 focus:bg-white/70 focus:border-[#dfc7cc]/50 focus:ring-2 focus:ring-[#f0e4e8]/30 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md" />
                      <Button type="button" variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 text-slate-500 hover:text-[#b5919e]/60 hover:bg-[#f0e4e8]/20 rounded-lg transition-all duration-200" disabled={loading}>
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </Button>
                    </div>
                    
                    {mode === 'signup' && formData.password && <div className="mt-4 p-4 bg-gradient-to-r from-[#f0e4e8]/30 to-rose-50/30 rounded-xl backdrop-blur-sm border border-[#ead9de]/15 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-[#b5919e]/60" />
                            Password Strength
                          </span>
                          <span className={`text-sm font-bold px-2 py-1 rounded-full ${getPasswordStrength() >= 3 ? 'bg-green-100 text-green-700' : getPasswordStrength() >= 2 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {getPasswordStrength()}/4
                          </span>
                        </div>
                        <div className="flex gap-1 mb-3">
                          {[1, 2, 3, 4].map(i => <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= getPasswordStrength() ? `bg-gradient-to-r ${gradientClass}` : 'bg-slate-300'}`} />)}
                        </div>
                        <div className="space-y-1">
                          {passwordRequirements.map((req, index) => {
                        const met = req.test(formData.password);
                        return <div key={index} className="flex items-center gap-2 text-xs">
                                {met ? <CheckCircle className="h-3 w-3 text-green-600" /> : <XCircle className="h-3 w-3 text-slate-400" />}
                                <span className={met ? 'text-green-700' : 'text-slate-600'}>
                                  {req.text}
                                </span>
                              </div>;
                      })}
                        </div>
                      </div>}
                  </div>

                  {mode === 'signup' && <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-800">
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-slate-800 transition-colors" />
                        <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={e => handleInputChange('confirmPassword', e.target.value)} placeholder="Confirm your password" disabled={loading} required className="h-12 pl-12 pr-12 bg-white/30 border-slate-400/50 text-slate-800 placeholder:text-slate-600 focus:bg-white/40 focus:border-slate-500 transition-all duration-200" />
                        <Button type="button" variant="ghost" size="sm" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-slate-600 hover:text-slate-800 hover:bg-white/20" disabled={loading}>
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>}

                  <Button type="submit" className={`w-full h-12 text-base font-semibold bg-gradient-to-r ${gradientClass} hover:shadow-lg hover:shadow-[#dfc7cc]/10 transform hover:scale-105 transition-all duration-200 text-white border-0 relative overflow-hidden group`} disabled={loading}>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    {loading ? <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {mode === 'login' ? 'Signing you in...' : 'Creating your account...'}
                      </> : <>
                        {mode === 'login' ? <>
                            <Shield className="mr-2 h-5 w-5" />
                            Sign In Securely
                          </> : <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Start Your Journey
                          </>}
                      </>}
                  </Button>

                  <div className="text-center text-sm space-y-4">
                    {mode === 'login' && <div>
                        <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-slate-600 hover:text-slate-800 transition-colors duration-200">
                          Forgot password?
                        </button>
                      </div>}

                    <div>
                      <span className="text-slate-700">
                        {mode === 'login' ? "New to EnglEuphoria? " : "Already have an account? "}
                      </span>
                      {onModeChange ? <button type="button" onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')} className={`font-semibold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent hover:underline transition-all duration-200`}>
                          {mode === 'login' ? 'Create an account' : 'Sign in instead'}
                        </button> : <Link to={mode === 'login' ? '/signup' : '/login'} className={`font-semibold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent hover:underline transition-all duration-200`}>
                          {mode === 'login' ? 'Create an account' : 'Sign in instead'}
                        </Link>}
                    </div>

                    {mode === 'signup' && <div className="pt-4 border-t border-slate-300/40">
                        <p className="text-xs text-slate-600 mb-3">Looking for specialized signup?</p>
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" size="sm" onClick={() => navigate('/teacher-signup')} className="flex-1 text-xs bg-white/20 border-slate-400/50 text-slate-700 hover:bg-white/30 hover:text-slate-800">
                            <GraduationCap className="mr-1 h-3 w-3" />
                            Teacher
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => navigate('/student-signup')} className="flex-1 text-xs bg-white/20 border-slate-400/50 text-slate-700 hover:bg-white/30 hover:text-slate-800">
                            <BookOpen className="mr-1 h-3 w-3" />
                            Student
                          </Button>
                        </div>
                      </div>}

                    <Link to="/" className="text-xs text-slate-600 hover:text-slate-800 inline-flex items-center gap-1 transition-colors duration-200">
                      ← Back to home
                    </Link>
                  </div>
                </form>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#c7a8b3]/60 to-[#d4b5bd]/60 bg-clip-text text-transparent">
                Reset Password
              </CardTitle>
              <CardDescription className="text-slate-600">
                Enter your email address and we'll send you a link to reset your password.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-6 pb-6">
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="resetEmail" className="text-sm font-medium text-slate-800">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-slate-800 transition-colors" />
                    <Input id="resetEmail" type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="Enter your email address" disabled={resetLoading} required className="h-12 pl-12 bg-white/30 border-slate-400/50 text-slate-800 placeholder:text-slate-600 focus:bg-white/40 focus:border-slate-500 transition-all duration-200" />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => {
                setShowForgotPassword(false);
                setResetEmail('');
              }} disabled={resetLoading} className="flex-1 bg-white/20 border-slate-400/50 text-slate-700 hover:bg-white/30">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={resetLoading} className="flex-1 bg-gradient-to-r from-[#c7a8b3]/60 to-[#d4b5bd]/60 hover:shadow-lg hover:shadow-[#dfc7cc]/10 text-white border-0">
                    {resetLoading ? <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </> : 'Send Reset Link'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>}
    </div>;
};