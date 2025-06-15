
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Lock, 
  Unlock,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Target,
  MessageCircle,
  BookOpen,
  Award
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface KPIMetrics {
  feedback_completion_rate: number;
  lesson_quality_score: number;
  attendance_rate: number;
  student_progress_impact: number;
  response_time_score: number;
  curriculum_coverage: number;
  overall_kpi_score: number;
}

interface PaymentStatus {
  locked_sessions: number;
  pending_amount: number;
  next_unlock_requirement: string;
}

export function TeacherKPIOverview() {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    locked_sessions: 0,
    pending_amount: 0,
    next_unlock_requirement: 'Submit pending feedback'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKPIMetrics();
    loadPaymentStatus();
  }, []);

  const loadKPIMetrics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('teacher_performance_metrics')
        .select('*')
        .eq('teacher_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading metrics:', error);
        return;
      }

      if (data) {
        setMetrics(data);
      } else {
        // Initialize metrics if none exist
        setMetrics({
          feedback_completion_rate: 0,
          lesson_quality_score: 0,
          attendance_rate: 0,
          student_progress_impact: 0,
          response_time_score: 0,
          curriculum_coverage: 0,
          overall_kpi_score: 0
        });
      }
    } catch (error) {
      console.error('Error loading KPI metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get lessons without feedback
      const { data: pendingLessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('teacher_id', user.id)
        .eq('feedback_submitted', false)
        .eq('status', 'completed');

      setPaymentStatus({
        locked_sessions: pendingLessons?.length || 0,
        pending_amount: (pendingLessons?.length || 0) * 25, // Assuming $25 per lesson
        next_unlock_requirement: pendingLessons?.length ? 'Submit pending feedback' : 'All payments unlocked!'
      });
    } catch (error) {
      console.error('Error loading payment status:', error);
    }
  };

  const getKPIColor = (value: number, threshold: number = 80) => {
    if (value >= threshold) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getKPIIcon = (value: number, threshold: number = 80) => {
    if (value >= threshold) return CheckCircle;
    if (value >= 60) return AlertTriangle;
    return TrendingDown;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const kpiItems = [
    {
      label: 'Feedback Rate',
      value: metrics?.feedback_completion_rate || 0,
      icon: MessageCircle,
      threshold: 95
    },
    {
      label: 'Lesson Quality',
      value: (metrics?.lesson_quality_score || 0) * 20, // Convert to percentage
      icon: Star,
      threshold: 80
    },
    {
      label: 'Attendance',
      value: metrics?.attendance_rate || 0,
      icon: Clock,
      threshold: 95
    },
    {
      label: 'Student Progress',
      value: metrics?.student_progress_impact || 0,
      icon: TrendingUp,
      threshold: 75
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overall KPI Score */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-purple-500" />
            Overall Performance Score
            <Badge className={`ml-auto ${(metrics?.overall_kpi_score || 0) >= 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {Math.round(metrics?.overall_kpi_score || 0)}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress 
            value={metrics?.overall_kpi_score || 0} 
            className="h-3 mb-2"
          />
          <p className="text-sm text-gray-600">
            {(metrics?.overall_kpi_score || 0) >= 80 ? 'Excellent performance! Keep it up!' : 'Room for improvement - focus on feedback submission'}
          </p>
        </CardContent>
      </Card>

      {/* Payment Status */}
      <Card className={paymentStatus.locked_sessions > 0 ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {paymentStatus.locked_sessions > 0 ? (
              <Lock className="text-red-500" />
            ) : (
              <Unlock className="text-green-500" />
            )}
            Payment Status
            <Badge className={paymentStatus.locked_sessions > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
              {paymentStatus.locked_sessions} sessions locked
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Pending Amount:</span>
            <span className="font-bold text-lg">${paymentStatus.pending_amount}</span>
          </div>
          <p className="text-sm text-gray-700 mb-3">{paymentStatus.next_unlock_requirement}</p>
          {paymentStatus.locked_sessions > 0 && (
            <Button className="w-full bg-red-500 hover:bg-red-600">
              Submit {paymentStatus.locked_sessions} Pending Feedback(s)
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Individual KPIs */}
      <div className="grid grid-cols-2 gap-4">
        {kpiItems.map((kpi, index) => {
          const IconComponent = getKPIIcon(kpi.value, kpi.threshold);
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon size={20} className="text-purple-500" />
                  <IconComponent size={16} className={getKPIColor(kpi.value, kpi.threshold)} />
                </div>
                <div className="mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{kpi.label}</span>
                    <span className={`text-lg font-bold ${getKPIColor(kpi.value, kpi.threshold)}`}>
                      {Math.round(kpi.value)}%
                    </span>
                  </div>
                  <Progress value={kpi.value} className="h-2 mt-1" />
                </div>
                <p className="text-xs text-gray-500">
                  Target: {kpi.threshold}%
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="text-yellow-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <MessageCircle size={16} />
              Submit Feedback
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <BookOpen size={16} />
              View Curriculum
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
