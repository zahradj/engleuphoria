import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Video, Calendar, ExternalLink, Loader2, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Interview {
  id: string;
  application_id: string;
  admin_id: string;
  teacher_email: string;
  teacher_name: string;
  scheduled_at: string;
  duration_minutes: number;
  room_token: string;
  status: string;
  admin_notes: string | null;
  checklist: Record<string, boolean | null>;
  hub_type: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  scheduled: { label: 'Scheduled', variant: 'outline' },
  in_progress: { label: 'In Progress', variant: 'secondary' },
  completed: { label: 'Completed', variant: 'default' },
  passed: { label: 'Passed ✅', variant: 'default' },
  failed: { label: 'Failed', variant: 'destructive' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};

export const InterviewManagement: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .order('scheduled_at', { ascending: false });

      if (error) throw error;
      setInterviews(data || []);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const upcomingInterviews = interviews.filter(i => 
    i.status === 'scheduled' && new Date(i.scheduled_at) >= new Date()
  );
  const pastInterviews = interviews.filter(i => 
    i.status !== 'scheduled' || new Date(i.scheduled_at) < new Date()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Interview Management</h1>
        <p className="text-muted-foreground">Schedule, conduct, and review teacher interviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Interviews</p>
                <p className="text-2xl font-bold">{interviews.length}</p>
              </div>
              <Video className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold text-indigo-600">{upcomingInterviews.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-indigo-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Passed</p>
                <p className="text-2xl font-bold text-green-600">
                  {interviews.filter(i => i.status === 'passed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">
                  {interviews.filter(i => i.status === 'failed').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Interviews */}
      {upcomingInterviews.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">Upcoming Interviews</h2>
          <div className="grid gap-4">
            {upcomingInterviews.map((interview) => (
              <Card key={interview.id} className="border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-800">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                        <Video className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{interview.teacher_name}</h3>
                        <p className="text-sm text-muted-foreground">{interview.teacher_email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(interview.scheduled_at), 'MMM d, yyyy \'at\' h:mm a')}
                          </span>
                          {interview.hub_type && (
                            <Badge variant="secondary" className="text-xs">{interview.hub_type}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => window.open(`/interview/${interview.room_token}`, '_blank')}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join Interview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Interviews */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-3">Interview History</h2>
        {pastInterviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No interviews yet. Schedule one from the Applications tab.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {pastInterviews.map((interview) => {
              const config = statusConfig[interview.status] || statusConfig.scheduled;
              return (
                <Card key={interview.id}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-medium text-foreground">{interview.teacher_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(interview.scheduled_at), 'MMM d, yyyy \'at\' h:mm a')}
                            {interview.hub_type && ` · ${interview.hub_type} Hub`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={config.variant}>{config.label}</Badge>
                        {interview.status === 'scheduled' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`/interview/${interview.room_token}`, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Join
                          </Button>
                        )}
                      </div>
                    </div>
                    {interview.admin_notes && (
                      <p className="text-sm text-muted-foreground mt-2 border-t pt-2">
                        📝 {interview.admin_notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
