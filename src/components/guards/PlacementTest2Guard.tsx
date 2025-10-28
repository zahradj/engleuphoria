import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-states';

interface PlacementTest2GuardProps {
  children: React.ReactNode;
}

export function PlacementTest2Guard({ children }: PlacementTest2GuardProps) {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to take the advanced placement test",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('student_profiles')
          .select('placement_test_completed_at')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (!data?.placement_test_completed_at) {
          toast({
            title: "Complete Quick Test First",
            description: "You need to complete the Quick Placement Test before accessing the Advanced Test",
            variant: "destructive"
          });
          navigate('/placement-test');
          return;
        }

        setHasAccess(true);
      } catch (error) {
        console.error('Error checking test access:', error);
        toast({
          title: "Error",
          description: "There was an issue checking your test access. Please try again.",
          variant: "destructive"
        });
        navigate('/student');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Checking your access..." />
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
