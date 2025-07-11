import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, User, GraduationCap, Shield, BookOpen, Calendar, MessageSquare, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const SiteMap = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const publicRoutes = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About Us', icon: BookOpen },
    { path: '/contact', label: 'Contact', icon: MessageSquare },
    { path: '/become-teacher', label: 'Become a Teacher', icon: GraduationCap },
    { path: '/for-parents', label: 'For Parents', icon: User },
    { path: '/payment', label: 'Pricing', icon: Settings },
  ];

  const authRoutes = [
    { path: '/login', label: 'Login', icon: User },
    { path: '/signup', label: 'Sign Up', icon: User },
  ];

  const studentRoutes = [
    { path: '/student', label: 'Student Dashboard', icon: Home },
    { path: '/student/schedule', label: 'My Schedule', icon: Calendar },
    { path: '/student/book-lesson', label: 'Book Lesson', icon: BookOpen },
    { path: '/student/speaking-practice', label: 'Speaking Practice', icon: MessageSquare },
    { path: '/student/lesson-scheduler', label: 'Lesson Scheduler', icon: Calendar },
  ];

  const teacherRoutes = [
    { path: '/teacher', label: 'Teacher Dashboard', icon: Home },
    { path: '/teacher/materials', label: 'Materials Library', icon: BookOpen },
    { path: '/teacher/lesson-scheduler', label: 'Lesson Scheduler', icon: Calendar },
    { path: '/teacher/lesson-plan-creator', label: 'Lesson Plan Creator', icon: BookOpen },
    { path: '/teacher/student-management', label: 'Student Management', icon: User },
  ];

  const adminRoutes = [
    { path: '/admin', label: 'Admin Dashboard', icon: Shield },
  ];

  const sharedRoutes = [
    { path: '/classroom', label: 'Virtual Classroom', icon: BookOpen },
    { path: '/whiteboard', label: 'Whiteboard', icon: BookOpen },
    { path: '/curriculum-library', label: 'Curriculum Library', icon: BookOpen },
  ];

  const RouteSection = ({ title, routes, show = true }: {
    title: string;
    routes: { path: string; label: string; icon: React.ComponentType<any> }[];
    show?: boolean;
  }) => {
    if (!show) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {routes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
              >
                <route.icon className="h-4 w-4" />
                <span className="text-sm">{route.label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Site Map</h1>
          <p className="text-muted-foreground mt-2">
            Complete overview of all available pages and features
          </p>
        </div>

        <div className="space-y-6">
          <RouteSection title="Public Pages" routes={publicRoutes} />
          <RouteSection title="Authentication" routes={authRoutes} show={!user} />
          <RouteSection title="Student Area" routes={studentRoutes} show={user?.role === 'student' || user?.role === 'admin'} />
          <RouteSection title="Teacher Area" routes={teacherRoutes} show={user?.role === 'teacher' || user?.role === 'admin'} />
          <RouteSection title="Admin Area" routes={adminRoutes} show={user?.role === 'admin'} />
          <RouteSection title="Shared Features" routes={sharedRoutes} show={!!user} />
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Can't find what you're looking for? Check out these resources:
            </p>
            <div className="space-y-2">
              <Link to="/contact" className="text-primary hover:underline block">
                Contact Support
              </Link>
              <Link to="/about" className="text-primary hover:underline block">
                About Our Platform
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteMap;