
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, CheckCircle, XCircle, Mail, Lock, User, GraduationCap, BookOpen } from 'lucide-react';

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

  // Redirect authenticated users to their dashboard
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
    ? 'from-blue-600 to-indigo-600' 
    : formData.role === 'teacher' 
      ? 'from-emerald-600 to-blue-600'
      : 'from-blue-600 to-purple-600';

  const backgroundGradient = mode === 'login'
    ? 'from-blue-50 via-indigo-50 to-purple-50'
    : formData.role === 'teacher'
      ? 'from-emerald-50 via-blue-50 to-purple-50'
      : 'from-blue-50 via-purple-50 to-pink-50';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundGradient}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="w-full max-w-md mx-auto">
          <Card className="w-full shadow-2xl relative overflow-hidden bg-white/95 backdrop-blur-sm animate-fade-in">
            {/* Card inner glow effects */}
            <div className="absolute -z-10 top-0 left-0 w-[80%] h-[80%] bg-primary/10 rounded-full blur-2xl"></div>
            <div className="absolute -z-10 bottom-0 right-0 w-[60%] h-[60%] bg-secondary/5 rounded-full blur-2xl"></div>
            
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${gradientClass} rounded-full flex items-center justify-center`}>
                  {mode === 'login' ? (
                    <User className="h-8 w-8 text-white" />
                  ) : formData.role === 'teacher' ? (
                    <GraduationCap className="h-8 w-8 text-white" />
                  ) : (
                    <BookOpen className="h-8 w-8 text-white" />
                  )}
                </div>
              </div>
              <CardTitle className={`text-2xl font-bold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}>
                {mode === 'login' ? 'Welcome Back!' : 'Join EnglEuphoria'}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {mode === 'login' 
                  ? 'Sign in to continue your learning journey'
                  : 'Start your English learning adventure today'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                        disabled={loading}
                        required
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      disabled={loading}
                      required
                      className={`pl-10 h-11 ${emailError ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {emailError && (
                    <p className="text-sm text-red-500">{emailError}</p>
                  )}
                </div>

                {mode === 'signup' && (
                  <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-medium">
                      I am a...
                    </label>
                    <select
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value as 'student' | 'teacher' | 'admin')}
                      className="w-full h-11 px-3 border border-input bg-background rounded-md text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:border-input"
                      disabled={loading}
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder={mode === 'login' ? "Enter your password" : "Create a password"}
                      disabled={loading}
                      required
                      className="pl-10 pr-10 h-11"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </Button>
                  </div>
                  
                  {mode === 'signup' && formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs text-gray-600 mb-1">
                        Password strength: {getPasswordStrength()}/4
                      </div>
                      {passwordRequirements.map((req, index) => {
                        const met = req.test(formData.password);
                        return (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            {met ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 text-gray-300" />
                            )}
                            <span className={met ? 'text-green-600' : 'text-gray-400'}>
                              {req.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {mode === 'signup' && (
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Confirm your password"
                        disabled={loading}
                        required
                        className="pl-10 pr-10 h-11"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                        disabled={loading}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                      </Button>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className={`w-full h-12 text-lg font-semibold bg-gradient-to-r ${gradientClass} hover:opacity-90 transition-all duration-200`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    mode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </Button>

                <div className="text-center text-sm space-y-3">
                  <div>
                    <span className="text-muted-foreground">
                      {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    </span>
                    {onModeChange ? (
                      <button
                        type="button"
                        onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
                        className={`font-semibold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent hover:underline`}
                      >
                        {mode === 'login' ? 'Sign up' : 'Sign in'}
                      </button>
                    ) : (
                      <Link 
                        to={mode === 'login' ? '/signup' : '/login'} 
                        className={`font-semibold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent hover:underline`}
                      >
                        {mode === 'login' ? 'Sign up' : 'Sign in'}
                      </Link>
                    )}
                  </div>

                  {mode === 'signup' && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Looking for more options?</p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/teacher-signup')}
                          className="flex-1 text-xs"
                        >
                          Teacher Signup
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/student-signup')}
                          className="flex-1 text-xs"
                        >
                          Student Signup
                        </Button>
                      </div>
                    </div>
                  )}

                  <Link to="/" className="text-xs text-muted-foreground hover:underline inline-block">
                    ← Back to home
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
