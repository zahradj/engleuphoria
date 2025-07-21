import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, CheckCircle, XCircle, Mail, Lock, User, GraduationCap, BookOpen, Sparkles, Shield, Zap } from 'lucide-react';
import { Logo } from '@/components/Logo';

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
}

const passwordRequirements = [
  { test: (pwd: string) => pwd.length >= 6, text: "At least 6 characters" },
  { test: (pwd: string) => /[A-Z]/.test(pwd), text: "One uppercase letter" },
  { test: (pwd: string) => /[0-9]/.test(pwd), text: "One number" },
  { test: (pwd: string) => /[!@#$%^&*]/.test(pwd), text: "One special character" }
];

export const SimpleAuthForm: React.FC<SimpleAuthFormProps> = ({ mode, onModeChange }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  const { signIn, signUp, user, isConfigured, error } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    if (user) {
      const dashboardMap: Record<string, string> = {
        student: '/student',
        teacher: '/teacher',
        admin: '/admin'
      };
      const targetPath = dashboardMap[user.role] || '/student';
      navigate(targetPath, { replace: true });
    }
  }, [user, navigate]);

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
          variant: "destructive",
        });
        return false;
      }

      if (getPasswordStrength() < 3) {
        toast({
          title: "Password Too Weak",
          description: "Password must meet at least 3 security requirements.",
          variant: "destructive",
        });
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Passwords Don't Match",
          description: "Please make sure both passwords are identical.",
          variant: "destructive",
        });
        return false;
      }
    } else {
      if (formData.password.length < 6) {
        toast({
          title: "Invalid Password",
          description: "Password must be at least 6 characters long.",
          variant: "destructive",
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
          variant: "destructive",
        });
        return;
      }

      if (mode === 'login') {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message || "Invalid email or password.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login Successful",
            description: "Welcome back!",
          });
          // Navigation will happen automatically via useEffect
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, {
          role: formData.role
        });

        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error.message || "Failed to create account.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account Created Successfully!",
            description: "Please check your email to verify your account.",
          });
          
          // Navigate based on role
          if (formData.role === 'teacher') {
            navigate('/teacher-application');
          } else if (formData.role === 'student') {
            navigate('/student-application');
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
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'email') {
      validateEmail(value);
    }
  };

  const gradientClass = mode === 'login' 
    ? 'from-indigo-600 via-purple-600 to-blue-600' 
    : formData.role === 'teacher' 
      ? 'from-emerald-500 via-teal-500 to-blue-500'
      : 'from-violet-500 via-purple-500 to-pink-500';

  const backgroundGradient = mode === 'login'
    ? 'from-slate-900 via-purple-900 to-slate-900'
    : formData.role === 'teacher'
      ? 'from-slate-900 via-emerald-900 to-slate-900'
      : 'from-slate-900 via-violet-900 to-slate-900';

  return (
    <div className={`min-h-screen relative overflow-hidden bg-gradient-to-br ${backgroundGradient}`}>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-pink-400/20 to-blue-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
        
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-bounce"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/40 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-white/25 rounded-full animate-bounce delay-700"></div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-20"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo size="xlarge" className="text-white" />
            </div>
            <p className="text-white/70 text-sm">Transform your English learning experience</p>
          </div>

          <Card className="relative backdrop-blur-xl bg-white/40 border-white/50 shadow-2xl overflow-hidden">
            <div className={`absolute -inset-1 bg-gradient-to-r ${gradientClass} rounded-lg blur opacity-20`}></div>
            
            <div className="relative bg-white/35 backdrop-blur-2xl border border-white/50 rounded-lg">
              <CardHeader className="text-center pb-6 pt-8">
                <div className="flex justify-center mb-6">
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-r ${gradientClass} flex items-center justify-center shadow-lg`}>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent"></div>
                    {mode === 'login' ? (
                      <Shield className="h-8 w-8 text-white relative z-10" />
                    ) : formData.role === 'teacher' ? (
                      <GraduationCap className="h-8 w-8 text-white relative z-10" />
                    ) : (
                      <Zap className="h-8 w-8 text-white relative z-10" />
                    )}
                  </div>
                </div>
                
                <CardTitle className="text-2xl font-bold text-slate-800 mb-2">
                  {mode === 'login' ? 'Welcome Back!' : 'Join the Revolution'}
                </CardTitle>
                <CardDescription className="text-slate-700 text-base">
                  {mode === 'login' 
                    ? 'Continue your learning journey with us'
                    : 'Start your personalized English learning adventure'
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                {error && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg backdrop-blur-sm">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {mode === 'signup' && (
                    <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium text-slate-800">
                      Full Name
                      </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-slate-800 transition-colors" />
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          placeholder="Enter your full name"
                          disabled={loading}
                          required
                          className="h-12 pl-12 bg-white/30 border-slate-400/50 text-slate-800 placeholder:text-slate-600 focus:bg-white/40 focus:border-slate-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-800">
                    Email Address
                    </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-slate-800 transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        disabled={loading}
                        required
                        className={`h-12 pl-12 bg-white/30 border-slate-400/50 text-slate-800 placeholder:text-slate-600 focus:bg-white/40 focus:border-slate-500 transition-all duration-200 ${emailError ? 'border-red-400/60' : ''}`}
                      />
                    </div>
                    {emailError && (
                      <p className="text-sm text-red-700 animate-fade-in">{emailError}</p>
                    )}
                  </div>

                  {mode === 'signup' && (
                    <div className="space-y-2">
                      <label htmlFor="role" className="text-sm font-medium text-slate-800">
                        I am a...
                      </label>
                      <select
                        id="role"
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value as 'student' | 'teacher' | 'admin')}
                        className="w-full h-12 px-4 bg-white/30 border border-slate-400/50 text-slate-800 rounded-md focus:bg-white/40 focus:border-slate-500 transition-all duration-200"
                        disabled={loading}
                      >
                        <option value="student" className="bg-white text-slate-800">Student - Learn & Grow</option>
                        <option value="teacher" className="bg-white text-slate-800">Teacher - Inspire & Educate</option>
                      </select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-slate-800">
                      Password
                    </label>
                    <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-slate-800 transition-colors" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder={mode === 'login' ? "Enter your password" : "Create a secure password"}
                        disabled={loading}
                        required
                      className="h-12 pl-12 pr-12 bg-white/30 border-slate-400/50 text-slate-800 placeholder:text-slate-600 focus:bg-white/40 focus:border-slate-500 transition-all duration-200"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-slate-600 hover:text-slate-800 hover:bg-white/20"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    {mode === 'signup' && formData.password && (
                      <div className="mt-3 p-3 bg-white/20 rounded-lg backdrop-blur-sm border border-slate-300/40">
                        <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-700">Password Strength</span>
                        <span className="text-xs text-slate-800 font-medium">{getPasswordStrength()}/4</span>
                        </div>
                        <div className="flex gap-1 mb-3">
                          {[1, 2, 3, 4].map((i) => (
                            <div 
                              key={i} 
                              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                                i <= getPasswordStrength() 
                                ? `bg-gradient-to-r ${gradientClass}` 
                                : 'bg-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="space-y-1">
                          {passwordRequirements.map((req, index) => {
                            const met = req.test(formData.password);
                            return (
                              <div key={index} className="flex items-center gap-2 text-xs">
                                {met ? (
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                ) : (
                                  <XCircle className="h-3 w-3 text-slate-400" />
                                )}
                                <span className={met ? 'text-green-700' : 'text-slate-600'}>
                                  {req.text}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {mode === 'signup' && (
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-800">
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-slate-800 transition-colors" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          placeholder="Confirm your password"
                          disabled={loading}
                          required
                          className="h-12 pl-12 pr-12 bg-white/30 border-slate-400/50 text-slate-800 placeholder:text-slate-600 focus:bg-white/40 focus:border-slate-500 transition-all duration-200"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-slate-600 hover:text-slate-800 hover:bg-white/20"
                          disabled={loading}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className={`w-full h-12 text-base font-semibold bg-gradient-to-r ${gradientClass} hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-200 text-white border-0 relative overflow-hidden group`}
                    disabled={loading}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {mode === 'login' ? 'Signing you in...' : 'Creating your account...'}
                      </>
                    ) : (
                      <>
                        {mode === 'login' ? (
                          <>
                            <Shield className="mr-2 h-5 w-5" />
                            Sign In Securely
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Start Your Journey
                          </>
                        )}
                      </>
                    )}
                  </Button>

                  <div className="text-center text-sm space-y-4">
                    <div>
                      <span className="text-slate-700">
                        {mode === 'login' ? "New to EnglEuphoria? " : "Already have an account? "}
                      </span>
                      {onModeChange ? (
                        <button
                          type="button"
                          onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
                          className={`font-semibold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent hover:underline transition-all duration-200`}
                        >
                          {mode === 'login' ? 'Create an account' : 'Sign in instead'}
                        </button>
                      ) : (
                        <Link 
                          to={mode === 'login' ? '/signup' : '/login'} 
                          className={`font-semibold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent hover:underline transition-all duration-200`}
                        >
                          {mode === 'login' ? 'Create an account' : 'Sign in instead'}
                        </Link>
                      )}
                    </div>

                    {mode === 'signup' && (
                      <div className="pt-4 border-t border-slate-300/40">
                        <p className="text-xs text-slate-600 mb-3">Looking for specialized signup?</p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/teacher-signup')}
                          className="flex-1 text-xs bg-white/20 border-slate-400/50 text-slate-700 hover:bg-white/30 hover:text-slate-800"
                          >
                            <GraduationCap className="mr-1 h-3 w-3" />
                            Teacher
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/student-signup')}
                            className="flex-1 text-xs bg-white/20 border-slate-400/50 text-slate-700 hover:bg-white/30 hover:text-slate-800"
                          >
                            <BookOpen className="mr-1 h-3 w-3" />
                            Student
                          </Button>
                        </div>
                      </div>
                    )}

                    <Link 
                      to="/" 
                      className="text-xs text-slate-600 hover:text-slate-800 inline-flex items-center gap-1 transition-colors duration-200"
                    >
                      ← Back to home
                    </Link>
                  </div>
                </form>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
