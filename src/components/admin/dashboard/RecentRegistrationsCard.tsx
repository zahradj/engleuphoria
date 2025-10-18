import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Mail, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Student {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

export const RecentRegistrationsCard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [unviewedCount, setUnviewedCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentStudents();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('new_students')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'users',
          filter: 'role=eq.student'
        },
        (payload) => {
          setStudents(prev => [payload.new as Student, ...prev].slice(0, 10));
          setUnviewedCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRecentStudents = async () => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, created_at')
        .eq('role', 'student')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching recent students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (studentId: string) => {
    navigate(`/admin?tab=students&student_id=${studentId}`);
    setUnviewedCount(0);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Recent Student Registrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-start gap-3">
                <div className="w-10 h-10 bg-surface rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface rounded w-3/4"></div>
                  <div className="h-3 bg-surface rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-blue to-mint-green flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-white" />
          </div>
          Recent Registrations
          {unviewedCount > 0 && (
            <Badge className="bg-peach text-text">
              {unviewedCount} new
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {students.length === 0 ? (
          <p className="text-text-muted text-center py-8">No new student registrations in the last 7 days</p>
        ) : (
          <div className="space-y-3">
            {students.map((student) => {
              const registrationDate = new Date(student.created_at);
              const timeAgo = getTimeAgo(registrationDate);

              return (
                <div
                  key={student.id}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-lavender flex items-center justify-center flex-shrink-0">
                    <span className="text-text font-semibold">
                      {student.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-text truncate">{student.full_name}</p>
                      <Badge variant="secondary" className="text-xs bg-mint-green text-text">
                        New
                      </Badge>
                    </div>
                    <p className="text-sm text-text-muted truncate mb-2">{student.email}</p>
                    <p className="text-xs text-text-subtle">{timeAgo}</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewProfile(student.id)}
                      className="h-8"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full border-border hover:bg-sky-blue/10"
            size="sm"
            onClick={() => navigate('/admin?tab=students')}
          >
            View All Students
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString();
}
