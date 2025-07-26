import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Calendar, DollarSign, User, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface LessonWithPayment {
  id: string;
  title: string;
  scheduled_at: string;
  duration: number;
  status: string;
  teacher_name?: string;
  payment_amount?: number;
  teacher_share?: number;
  platform_share?: number;
  payment_status?: string;
  completed_at?: string;
}

export function LessonHistory() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<LessonWithPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLessonHistory = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select(`
          id,
          title,
          scheduled_at,
          duration,
          status,
          payment_status,
          completed_at,
          teacher:users!lessons_teacher_id_fkey(full_name),
          payments:lesson_payments(
            amount_charged,
            teacher_payout,
            platform_profit
          )
        `)
        .eq('student_id', user.id)
        .order('scheduled_at', { ascending: false });

      if (error) throw error;

      const formattedLessons = data?.map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        scheduled_at: lesson.scheduled_at,
        duration: lesson.duration,
        status: lesson.status,
        payment_status: lesson.payment_status,
        completed_at: lesson.completed_at,
        teacher_name: lesson.teacher?.full_name,
        payment_amount: lesson.payments?.[0]?.amount_charged,
        teacher_share: lesson.payments?.[0]?.teacher_payout,
        platform_share: lesson.payments?.[0]?.platform_profit
      })) || [];

      setLessons(formattedLessons);
    } catch (error) {
      console.error('Error fetching lesson history:', error);
      toast({
        title: "Error",
        description: "Failed to load lesson history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Real-time subscription for lesson updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('student-lesson-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'lessons',
          filter: `student_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new.status === 'completed' && payload.old.status !== 'completed') {
            console.log('✅ Lesson completed:', payload);
            toast({
              title: "Lesson Completed ✅",
              description: `Your lesson "${payload.new.title}" has been completed`,
              duration: 5000,
            });
            fetchLessonHistory();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'lesson_payments',
          filter: `student_id=eq.${user.id}`
        },
        (payload) => {
          console.log('💰 Payment processed:', payload);
          const amount = payload.new.amount_charged;
          const teacherShare = payload.new.teacher_payout;
          const platformShare = payload.new.platform_profit;
          
          toast({
            title: "Payment Processed 💰",
            description: `€${amount} paid: €${teacherShare} to teacher, €${platformShare} platform service`,
            duration: 6000,
          });
          fetchLessonHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, toast]);

  useEffect(() => {
    fetchLessonHistory();
  }, [user?.id]);

  const getStatusBadge = (status: string, paymentStatus?: string) => {
    if (status === 'completed') {
      return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
    } else if (status === 'cancelled') {
      return <Badge variant="destructive">Cancelled</Badge>;
    } else if (status === 'scheduled') {
      return <Badge variant="outline">Scheduled</Badge>;
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  const completedLessons = lessons.filter(l => l.status === 'completed');
  const totalSpent = completedLessons.reduce((sum, l) => sum + (l.payment_amount || 0), 0);
  const totalTeacherPayments = completedLessons.reduce((sum, l) => sum + (l.teacher_share || 0), 0);
  const totalPlatformFees = completedLessons.reduce((sum, l) => sum + (l.platform_share || 0), 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {completedLessons.length} completed lessons
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teacher Payments</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalTeacherPayments.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Paid directly to teachers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Service</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalPlatformFees.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Platform service fees
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lesson History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lesson History</CardTitle>
          <CardDescription>
            Your lesson history with real-time payment breakdowns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Lesson</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Breakdown</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(7)].map((_, j) => (
                        <TableCell key={j}>
                          <div className="h-4 bg-muted rounded animate-pulse"></div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : lessons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No lessons found
                    </TableCell>
                  </TableRow>
                ) : (
                  lessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell>
                        {format(new Date(lesson.scheduled_at), 'MMM dd, HH:mm')}
                      </TableCell>
                      <TableCell className="font-medium">
                        {lesson.title}
                      </TableCell>
                      <TableCell>
                        {lesson.teacher_name || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {lesson.duration} min
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(lesson.status, lesson.payment_status)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {lesson.payment_amount ? (
                          <span className="text-red-600">€{lesson.payment_amount.toFixed(2)}</span>
                        ) : (
                          <span className="text-muted-foreground">No charge</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {lesson.teacher_share && lesson.platform_share ? (
                          <div className="text-xs space-y-1">
                            <div className="text-green-600">Teacher: €{lesson.teacher_share.toFixed(2)}</div>
                            <div className="text-blue-600">Platform: €{lesson.platform_share.toFixed(2)}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}