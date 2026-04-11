import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Calendar, TrendingUp, BookOpen } from 'lucide-react';

interface TeacherEarningsProps {
  teacherId: string;
}

export const TeacherEarnings: React.FC<TeacherEarningsProps> = ({ teacherId }) => {
  const [weekLessons, setWeekLessons] = useState(0);
  const [monthEarnings, setMonthEarnings] = useState(0);
  const [nextPayDate, setNextPayDate] = useState('');
  const [hourlyRate, setHourlyRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, [teacherId]);

  const fetchEarnings = async () => {
    setLoading(true);

    // Get this week's lessons
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, duration')
      .eq('teacher_id', teacherId)
      .eq('status', 'completed')
      .gte('scheduled_at', weekStart.toISOString());

    setWeekLessons(lessons?.length || 0);

    // Get hourly rate
    const { data: profile } = await supabase
      .from('teacher_profiles')
      .select('hourly_rate_eur')
      .eq('user_id', teacherId)
      .maybeSingle();

    const rate = profile?.hourly_rate_eur || 15;
    setHourlyRate(rate);

    // Get this month's payroll
    const now = new Date();
    const { data: payroll } = await supabase
      .from('payroll_records')
      .select('total_earned, payment_status')
      .eq('teacher_id', teacherId)
      .eq('month', now.getMonth() + 1)
      .eq('year', now.getFullYear())
      .maybeSingle();

    setMonthEarnings(payroll?.total_earned || 0);

    // Next pay date: last day of current month
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setNextPayDate(lastDay.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">Loading earnings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1A237E] font-inter tracking-tight">
          My Earnings
        </h1>
        <p className="text-sm text-[#9E9E9E] mt-1">
          Track your teaching income in real-time
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#1A237E]">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#1A237E]/10 rounded-xl">
                <BookOpen className="h-5 w-5 text-[#1A237E]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">This Week</p>
                <p className="text-2xl font-bold text-[#1A237E]">{weekLessons}</p>
                <p className="text-xs text-muted-foreground">lessons taught</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#2E7D32]">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#2E7D32]/10 rounded-xl">
                <DollarSign className="h-5 w-5 text-[#2E7D32]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Balance</p>
                <p className="text-2xl font-bold text-[#2E7D32]">€{monthEarnings.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 rounded-xl">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Hourly Rate</p>
                <p className="text-2xl font-bold text-amber-600">€{hourlyRate}</p>
                <p className="text-xs text-muted-foreground">per hour</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-500/10 rounded-xl">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Next Pay Date</p>
                <p className="text-sm font-bold text-purple-600">{nextPayDate}</p>
                <p className="text-xs text-muted-foreground">end of month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly lesson chart placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-[#1A237E]">Lessons This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-32">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const height = Math.random() * 80 + 20;
              const isToday = i === new Date().getDay() - 1;
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t transition-all ${isToday ? 'bg-[#1A237E]' : 'bg-[#1A237E]/20'}`}
                    style={{ height: `${height}%` }}
                  />
                  <span className={`text-[10px] ${isToday ? 'font-bold text-[#1A237E]' : 'text-muted-foreground'}`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
