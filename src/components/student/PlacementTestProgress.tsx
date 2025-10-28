import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Lock, Rocket, Target } from 'lucide-react';

interface TestProgress {
  test1Completed: boolean;
  test1Score?: number;
  test1Total?: number;
  test1Level?: string;
  test1Date?: string;
  test2Completed: boolean;
  test2Score?: number;
  test2Total?: number;
  test2Level?: string;
  test2Date?: string;
}

export const PlacementTestProgress = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<TestProgress>({
    test1Completed: false,
    test2Completed: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('student_profiles')
          .select(`
            placement_test_completed_at,
            placement_test_score,
            placement_test_total,
            cefr_level,
            placement_test_2_completed_at,
            placement_test_2_score,
            placement_test_2_total,
            final_cefr_level
          `)
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setProgress({
            test1Completed: !!data.placement_test_completed_at,
            test1Score: data.placement_test_score || undefined,
            test1Total: data.placement_test_total || undefined,
            test1Level: data.cefr_level || undefined,
            test1Date: data.placement_test_completed_at || undefined,
            test2Completed: !!data.placement_test_2_completed_at,
            test2Score: data.placement_test_2_score || undefined,
            test2Total: data.placement_test_2_total || undefined,
            test2Level: data.final_cefr_level || undefined,
            test2Date: data.placement_test_2_completed_at || undefined
          });
        }
      } catch (error) {
        console.error('Error fetching placement test progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  if (loading) {
    return null;
  }

  // Don't show if both tests are completed
  if (progress.test1Completed && progress.test2Completed) {
    return null;
  }

  return (
    <Card className="border border-border-light bg-white shadow-card">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-border-light p-6">
        <CardTitle className="text-xl font-semibold text-text flex items-center gap-3">
          <Target className="h-5 w-5 text-purple-600" />
          Placement Test Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Quick Test */}
        <div className={`p-5 rounded-xl border-2 transition-all ${
          progress.test1Completed 
            ? 'bg-green-50 border-green-200' 
            : 'bg-surface-soft border-border-light'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {progress.test1Completed ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
              )}
              <div>
                <h4 className="font-semibold text-text">Quick Placement Test</h4>
                <p className="text-sm text-text-muted">15-20 minutes • Basic assessment</p>
              </div>
            </div>
            {progress.test1Completed && progress.test1Level && (
              <Badge className="bg-green-600 text-white">
                {progress.test1Level}
              </Badge>
            )}
          </div>
          
          {progress.test1Completed && (
            <div className="ml-9 space-y-1">
              <p className="text-sm text-text-muted">
                Completed: {progress.test1Date ? new Date(progress.test1Date).toLocaleDateString() : 'N/A'}
              </p>
              {progress.test1Score && progress.test1Total && (
                <p className="text-sm text-text-muted">
                  Score: {progress.test1Score}/{progress.test1Total} ({Math.round((progress.test1Score / progress.test1Total) * 100)}%)
                </p>
              )}
            </div>
          )}
          
          {!progress.test1Completed && (
            <Button
              onClick={() => navigate('/placement-test')}
              className="ml-9 mt-2 bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
            >
              Start Quick Test
            </Button>
          )}
        </div>

        {/* Advanced Test */}
        <div className={`p-5 rounded-xl border-2 transition-all ${
          progress.test2Completed 
            ? 'bg-blue-50 border-blue-200' 
            : !progress.test1Completed
            ? 'bg-gray-50 border-gray-200 opacity-60'
            : 'bg-surface-soft border-border-light'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {progress.test2Completed ? (
                <CheckCircle className="h-6 w-6 text-blue-600" />
              ) : !progress.test1Completed ? (
                <Lock className="h-6 w-6 text-gray-400" />
              ) : (
                <Rocket className="h-6 w-6 text-blue-600" />
              )}
              <div>
                <h4 className="font-semibold text-text flex items-center gap-2">
                  Full Adventure Test (A1→C2)
                  {!progress.test1Completed && (
                    <Lock className="h-4 w-4 text-gray-400" />
                  )}
                </h4>
                <p className="text-sm text-text-muted">25-30 minutes • Comprehensive CEFR assessment</p>
              </div>
            </div>
            {progress.test2Completed && progress.test2Level && (
              <Badge className="bg-blue-600 text-white text-lg px-3 py-1">
                {progress.test2Level}
              </Badge>
            )}
          </div>
          
          {progress.test2Completed && (
            <div className="ml-9 space-y-1">
              <p className="text-sm text-text-muted">
                Completed: {progress.test2Date ? new Date(progress.test2Date).toLocaleDateString() : 'N/A'}
              </p>
              {progress.test2Score && progress.test2Total && (
                <p className="text-sm text-text-muted">
                  Score: {progress.test2Score}/{progress.test2Total} ({Math.round((progress.test2Score / progress.test2Total) * 100)}%)
                </p>
              )}
            </div>
          )}
          
          {!progress.test2Completed && progress.test1Completed && (
            <div className="ml-9 mt-3 space-y-2">
              <p className="text-sm text-green-600 font-medium">
                ✨ Unlocked! Take the advanced test for your precise CEFR level
              </p>
              <Button
                onClick={() => navigate('/placement-test-2')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                size="sm"
              >
                <Rocket className="mr-2 h-4 w-4" />
                Start Advanced Test
              </Button>
            </div>
          )}
          
          {!progress.test1Completed && (
            <div className="ml-9 mt-2 text-sm text-gray-500">
              Complete the Quick Test first to unlock
            </div>
          )}
        </div>

        {/* Progress Summary */}
        {!progress.test2Completed && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p className="text-sm text-blue-800">
              <strong>Why take both tests?</strong> The Quick Test gives you a starting point, 
              while the Advanced Test provides your precise CEFR level (A1-C2) for accurate course placement.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
