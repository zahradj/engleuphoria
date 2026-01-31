import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, CheckCircle, XCircle, Mail, Lock, User, GraduationCap, BookOpen, Sparkles, Shield, Calendar } from 'lucide-react';
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

const getRedirectPath = (role: string, systemTag: string | null): string => {
  if (role === 'admin') return '/super-admin';
  if (role === 'teacher') return '/teacher';
  if (role === 'student') {
    switch (systemTag) {
      case 'KIDS':
      case 'TEENS':
      case 'ADULTS':
      default:
        return '/playground';
    }
  }
  return '/';
};

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

  const { user, signIn, signUp, resetPassword, isConfigured, error } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sign out any existing user when signup page loads to prevent session conflicts
  React.useEffect(() => {
    if (mode === 'signup' && user) {
      console.log('Existing user detected on signup page, signing out...');
      supabase.auth.signOut().then(() => {
        console.log('Previous session cleared for new signup');
      });
    }
  }, [mode, user]);

  React.useEffect(() => {
    if (error) console.warn('Auth error:', error);
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
        toast({ title: "Missing Information", description: "Please enter your full name.", variant: "destructive" });
        return false;
      }
      if (getPasswordStrength() < 3) {
        toast({ title: "Password Too Weak", description: "Password must meet at least 3 security requirements.", variant: "destructive" });
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast({ title: "Passwords Don't Match", description: "Please make sure both passwords are identical.", variant: "destructive" });
        return false;
      }
    } else {
      if (formData.password.length < 6) {
        toast({ title: "Invalid Password", description: "Password must be at least 6 characters long.", variant: "destructive" });
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
        toast({ title: "Authentication Error", description: "Supabase not configured.", variant: "destructive" });
        return;
      }

      if (mode === 'login') {
        const { data, error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({ title: "Login Failed", description: error.message || "Invalid email or password.", variant: "destructive" });
        } else {
          toast({ title: "Welcome back!", description: "Successfully signed in." });
          // Let Login.tsx useEffect handle the redirect to /dashboard
          // Dashboard component will then redirect based on role from AuthContext
        }
      } else {
        const systemTag = formData.role === 'student' && formData.dateOfBirth ? calculateSystemTag(formData.dateOfBirth) : null;
        const { data, error } = await signUp(formData.email, formData.password, {
          role: formData.role,
          full_name: formData.fullName,
          system_tag: systemTag
        } as any);

        if (error) {
          toast({ title: "Sign Up Failed", description: error.message || "Failed to create account.", variant: "destructive" });
        } else {
          // Verify profile was created, if not create it manually (fallback for trigger failures)
          if (data?.user) {
            const { data: existingProfile } = await supabase
              .from('users')
              .select('id')
              .eq('id', data.user.id)
              .maybeSingle();
            
            if (!existingProfile) {
              console.log('Trigger failed to create profile, creating manually...');
              await supabase.from('users').insert({
                id: data.user.id,
                email: formData.email,
                full_name: formData.fullName,
                role: formData.role,
                current_system: systemTag
              });
              
              await supabase.from('user_roles').insert({
                user_id: data.user.id,
                role: formData.role
              });
              console.log('Manually created profile for:', formData.email);
            }
          }

          toast({
            title: "Account Created!",
            description: systemTag ? `You've been assigned to the ${systemTag} program.` : "Please check your email to verify."
          });
          supabase.functions.invoke('notify-admin-new-registration', {
            body: { name: formData.fullName, email: formData.email, role: formData.role, systemTag, registeredAt: new Date().toISOString() }
          }).catch(err => console.error('Failed to notify admin:', err));

          if (formData.role === 'teacher') {
            navigate('/teacher-application');
          } else if (formData.role === 'student' && systemTag) {
            navigate(getRedirectPath('student', systemTag));
          } else {
            navigate('/login');
          }
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'email') validateEmail(value);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(resetEmail)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email.", variant: "destructive" });
      return;
    }
    setResetLoading(true);
    try {
      const { error } = await resetPassword(resetEmail);
      if (error) {
        toast({ title: "Reset Failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Email Sent", description: "Check your email for reset instructions." });
        setShowForgotPassword(false);
        setResetEmail('');
      }
    } catch {
      toast({ title: "Error", description: "An error occurred.", variant: "destructive" });
    } finally {
      setResetLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Reset Password</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Enter your email to receive reset instructions</p>
        </div>
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="email"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              disabled={resetLoading}
            />
          </div>
          <Button type="submit" className="w-full h-11" disabled={resetLoading}>
            {resetLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Send Reset Link
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={() => setShowForgotPassword(false)}>
            Back to Login
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {mode === 'signup' && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={formData.fullName}
              onChange={e => handleInputChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              disabled={loading}
              required
            />
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="email"
            value={formData.email}
            onChange={e => handleInputChange('email', e.target.value)}
            placeholder="your.email@example.com"
            className={`pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${emailError ? 'border-red-400' : ''}`}
            disabled={loading}
            required
          />
        </div>
        {emailError && <p className="text-xs text-red-500">{emailError}</p>}
      </div>

      {mode === 'signup' && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">I am a...</label>
          <select
            value={formData.role}
            onChange={e => handleInputChange('role', e.target.value as 'student' | 'teacher')}
            className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300"
            disabled={loading}
          >
            <option value="student">Student - Learn & Grow</option>
            <option value="teacher">Teacher - Inspire & Educate</option>
          </select>
        </div>
      )}

      {mode === 'signup' && formData.role === 'student' && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date of Birth</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={e => handleInputChange('dateOfBirth', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              disabled={loading}
              required
            />
          </div>
          {formData.dateOfBirth && (
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <span>Program:</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                calculateSystemTag(formData.dateOfBirth) === 'KIDS' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                calculateSystemTag(formData.dateOfBirth) === 'TEENS' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {calculateSystemTag(formData.dateOfBirth)}
              </span>
            </p>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={e => handleInputChange('password', e.target.value)}
            placeholder={mode === 'login' ? "Enter your password" : "Create a password"}
            className="pl-10 pr-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            disabled={loading}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
            disabled={loading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        {mode === 'signup' && formData.password && (
          <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Shield className="h-3 w-3" />
                Password Strength
              </span>
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                getPasswordStrength() >= 3 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                getPasswordStrength() >= 2 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {getPasswordStrength()}/4
              </span>
            </div>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${
                  i <= getPasswordStrength() ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                }`} />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {passwordRequirements.map((req, i) => (
                <div key={i} className="flex items-center gap-1 text-xs">
                  {req.test(formData.password) ? 
                    <CheckCircle className="h-3 w-3 text-green-500" /> : 
                    <XCircle className="h-3 w-3 text-slate-300 dark:text-slate-600" />
                  }
                  <span className={req.test(formData.password) ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}>
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {mode === 'signup' && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={e => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
              className="pl-10 pr-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              disabled={loading}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-11 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-medium shadow-lg shadow-primary/25"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {mode === 'login' ? 'Signing in...' : 'Creating account...'}
          </>
        ) : (
          <>
            {mode === 'login' ? (
              <><Shield className="mr-2 h-4 w-4" /> Sign In</>
            ) : (
              <><Sparkles className="mr-2 h-4 w-4" /> Create Account</>
            )}
          </>
        )}
      </Button>

      <div className="space-y-3 text-center text-sm">
        {mode === 'login' && (
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-slate-500 hover:text-primary transition-colors"
          >
            Forgot password?
          </button>
        )}

        <div className="pt-2">
          <span className="text-slate-500 dark:text-slate-400">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          </span>
          {onModeChange ? (
            <button
              type="button"
              onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
              className="font-medium text-primary hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          ) : (
            <Link
              to={mode === 'login' ? '/signup' : '/login'}
              className="font-medium text-primary hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </Link>
          )}
        </div>

        {mode === 'signup' && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 mb-2">Specialized signup</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate('/teacher-signup')}
                className="flex-1 text-xs"
              >
                <GraduationCap className="mr-1 h-3 w-3" />
                Teacher
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate('/student-signup')}
                className="flex-1 text-xs"
              >
                <BookOpen className="mr-1 h-3 w-3" />
                Student
              </Button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
