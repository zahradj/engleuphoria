import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Exchange the code/token from the URL for a session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/login', { replace: true });
          return;
        }

        if (session) {
          // Session exists — redirect to the smart dashboard router
          navigate('/dashboard', { replace: true });
        } else {
          // No session yet — try exchanging code from URL params
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken && refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            navigate('/dashboard', { replace: true });
          } else {
            // Fallback: wait briefly for Supabase to process the URL
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
              if (event === 'SIGNED_IN') {
                subscription.unsubscribe();
                navigate('/dashboard', { replace: true });
              }
            });

            // Timeout fallback
            setTimeout(() => {
              subscription.unsubscribe();
              navigate('/dashboard', { replace: true });
            }, 3000);
          }
        }
      } catch (err) {
        console.error('Auth callback unexpected error:', err);
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground text-sm">Confirming your account...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
