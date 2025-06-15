
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, GraduationCap, Users, Chrome, Mail, Lock, User, UserCheck } from 'lucide-react';
import { useClassroomAuth } from '@/hooks/useClassroomAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { signIn, signUp } = useClassroomAuth();
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: '' as 'teacher' | 'student' | ''
  });

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        toast({
          title: "Google Authentication Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to authenticate with Google. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await signIn(loginForm.email, loginForm.password);
      
      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } else {
        toast({
          title: "Login Failed",
          description: result.error || "Invalid email or password",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupForm.email || !signupForm.password || !signupForm.fullName || !signupForm.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (signupForm.password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(
        signupForm.email, 
        signupForm.password, 
        signupForm.fullName, 
        signupForm.role
      );
      
      if (result.success) {
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account",
        });
        setActiveTab('login');
      } else {
        toast({
          title: "Signup Failed",
          description: result.error || "Failed to create account",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -z-10 top-1/4 left-1/4 w-[60%] h-[60%] bg-purple/10 rounded-full blur-3xl animate-pulse-subtle"></div>
      <div className="absolute -z-10 bottom-1/3 right-1/4 w-[50%] h-[50%] bg-teal/10 rounded-full blur-3xl animate-pulse-subtle animation-delay-300"></div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple to-teal rounded-full flex items-center justify-center shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
              Engleuphoria
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Learn English the Fun Way</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple to-teal"></div>
          
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-2xl font-bold">Welcome Back</CardTitle>
          </CardHeader>
          
          <CardContent className="pt-0">
            {/* Google Auth Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full mb-6 h-12 text-lg font-medium border-2 hover:bg-gray-50 transition-all duration-200"
              onClick={handleGoogleAuth}
              disabled={googleLoading || loading}
            >
              <Chrome className="w-5 h-5 mr-3 text-blue-500" />
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </Button>

            <div className="relative mb-6">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-4 text-muted-foreground text-sm">or</span>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="text-lg">Login</TabsTrigger>
                <TabsTrigger value="signup" className="text-lg">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-lg font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        placeholder="Enter your email"
                        className="pl-12 h-12 text-lg border-2 focus:border-purple transition-colors"
                        required
                        disabled={loading || googleLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-lg font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        placeholder="Enter your password"
                        className="pl-12 pr-12 h-12 text-lg border-2 focus:border-purple transition-colors"
                        required
                        disabled={loading || googleLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading || googleLoading}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple to-teal hover:from-purple-600 hover:to-teal-600 transition-all duration-200 shadow-lg" 
                    disabled={loading || googleLoading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6">
                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-lg font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="fullName"
                        value={signupForm.fullName}
                        onChange={(e) => setSignupForm({...signupForm, fullName: e.target.value})}
                        placeholder="Enter your full name"
                        className="pl-12 h-12 text-lg border-2 focus:border-purple transition-colors"
                        required
                        disabled={loading || googleLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-lg font-medium flex items-center">
                      <UserCheck className="w-5 h-5 mr-2" />
                      I am a...
                    </Label>
                    <Select 
                      value={signupForm.role} 
                      onValueChange={(value: 'teacher' | 'student') => setSignupForm({...signupForm, role: value})}
                      disabled={loading || googleLoading}
                    >
                      <SelectTrigger className="h-12 text-lg border-2 focus:border-purple">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teacher">
                          <div className="flex items-center gap-3">
                            <Users className="h-5 w-5" />
                            <span className="text-lg">Teacher</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="student">
                          <div className="flex items-center gap-3">
                            <GraduationCap className="h-5 w-5" />
                            <span className="text-lg">Student</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupEmail" className="text-lg font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="signupEmail"
                        type="email"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                        placeholder="Enter your email"
                        className="pl-12 h-12 text-lg border-2 focus:border-purple transition-colors"
                        required
                        disabled={loading || googleLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupPassword" className="text-lg font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="signupPassword"
                        type="password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                        placeholder="Create a password (min. 6 characters)"
                        className="pl-12 h-12 text-lg border-2 focus:border-purple transition-colors"
                        required
                        disabled={loading || googleLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-lg font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                        placeholder="Confirm your password"
                        className="pl-12 h-12 text-lg border-2 focus:border-purple transition-colors"
                        required
                        disabled={loading || googleLoading}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple to-teal hover:from-purple-600 hover:to-teal-600 transition-all duration-200 shadow-lg" 
                    disabled={loading || googleLoading}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p className="flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            Secure • Private • Professional
          </p>
        </div>
      </div>
    </div>
  );
};
