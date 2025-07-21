import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Eye, EyeOff, GraduationCap, Lock, Mail, User, X } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { ModernLanguageSwitcher } from '@/components/common/ModernLanguageSwitcher';

interface SimpleAuthFormProps {
  mode?: 'login' | 'signup';
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const SimpleAuthForm = ({ mode = 'login' }: SimpleAuthFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await signIn(values.email, values.password);
        toast({
          title: "Login Successful",
          description: "You have successfully logged in.",
        });
        navigate('/dashboard');
      } else {
        if (!selectedRole) {
          toast({
            title: "Error",
            description: "Please select a role (student or teacher).",
            variant: "destructive",
          });
          return;
        }

        await signUp(values.email, values.password, { role: selectedRole });
        toast({
          title: "Signup Successful",
          description: "Your account has been created.",
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to authenticate. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    if (mode === 'login') {
      navigate('/signup');
    } else {
      navigate('/login');
    }
  };

  const handleRoleSelect = (role: 'student' | 'teacher') => {
    setSelectedRole(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="absolute top-4 right-4 z-10">
        <ModernLanguageSwitcher size="sm" showText={false} />
      </div>
      
      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-6 pb-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex justify-center">
                <img 
                  src="/lovable-uploads/32e54089-999a-4546-b2ee-5dc9bc60f841.png" 
                  alt="Engleuphoria Logo" 
                  className="h-16 w-auto object-contain"
                />
              </div>
              
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {mode === 'login' ? t('welcomeBack') : t('createAccount')}
                </h1>
                <p className="text-muted-foreground">
                  {mode === 'login' 
                    ? t('loginSubtitle', 'Welcome back to your learning journey') 
                    : t('signupSubtitle', 'Start your English learning adventure')
                  }
                </p>
              </div>

              {mode !== 'login' && !selectedRole && (
                <div className="w-full space-y-3">
                  <p className="text-center text-sm text-muted-foreground">{t('iAmA')}</p>
                  <div className="grid gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-auto p-4 justify-start hover:bg-accent/50 transition-all duration-200"
                      onClick={() => handleRoleSelect('student')}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg`}>
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent"></div>
                          <img 
                            src="/lovable-uploads/dacdeeea-21e1-4790-9f98-a906291e63a3.png" 
                            alt="Logo" 
                            className="h-8 w-8 object-contain relative z-10"
                          />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">{t('student')}</div>
                          <div className="text-sm text-muted-foreground">{t('studentDescription', 'Learn English with fun activities')}</div>
                        </div>
                      </div>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="h-auto p-4 justify-start hover:bg-accent/50 transition-all duration-200"
                      onClick={() => handleRoleSelect('teacher')}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center shadow-lg`}>
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent"></div>
                          <GraduationCap className="h-8 w-8 text-white relative z-10" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">{t('teacher')}</div>
                          <div className="text-sm text-muted-foreground">{t('teacherDescription', 'Create engaging lessons for students')}</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>

          {(mode === 'login' || selectedRole) && (
            <CardContent className="space-y-6">
              {mode !== 'login' && selectedRole && (
                <div className="flex items-center justify-center space-x-3 p-4 bg-accent/30 rounded-lg">
                  <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-r ${selectedRole === 'student' ? 'from-blue-500 to-purple-500' : 'from-emerald-500 to-blue-500'} flex items-center justify-center shadow-md`}>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent"></div>
                    {selectedRole === 'student' ? (
                      <img 
                        src="/lovable-uploads/dacdeeea-21e1-4790-9f98-a906291e63a3.png" 
                        alt="Logo" 
                        className="h-6 w-6 object-contain relative z-10"
                      />
                    ) : (
                      <GraduationCap className="h-6 w-6 text-white relative z-10" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{selectedRole === 'student' ? t('student') : t('teacher')}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedRole === 'student' ? t('studentDescription', 'Learn English with fun activities') : t('teacherDescription', 'Create engaging lessons for students')}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRole(null)}
                    className="ml-auto"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  {mode !== 'login' && (
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('fullName')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input placeholder={t('enterFullName', 'Enter your full name')} className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('email')}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder={t('enterEmail', 'Enter your email')} className="pl-10" type="email" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('password')}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder={t('enterPassword', 'Enter your password')}
                              className="pl-10 pr-10"
                              type={showPassword ? "text" : "password"}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {mode !== 'login' && (
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('confirmPassword', 'Confirm Password')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                placeholder={t('confirmPasswordPlaceholder', 'Confirm your password')}
                                className="pl-10 pr-10"
                                type={showConfirmPassword ? "text" : "password"}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {mode === 'login' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <label
                          htmlFor="remember"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t('rememberMe')}
                        </label>
                      </div>
                      <Button variant="link" className="px-0 font-normal" type="button">
                        {t('forgotPassword')}
                      </Button>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>{mode === 'login' ? t('signingIn', 'Signing in...') : t('creatingAccount', 'Creating account...')}</span>
                      </div>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <span>{mode === 'login' ? t('signIn', 'Sign In') : t('createAccount')}</span>
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          )}

          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              {mode === 'login' ? t('dontHaveAccount') : t('alreadyHaveAccount')}{" "}
              <Button variant="link" className="p-0 h-auto font-semibold text-primary hover:text-primary/80" onClick={toggleMode}>
                {mode === 'login' ? t('signUp') : t('logIn')}
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
