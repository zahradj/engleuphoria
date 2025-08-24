import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { GraduationCap, Star, DollarSign, Calendar, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Teacher {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  rating: number;
  total_reviews: number;
  hourly_rate_eur: number;
  specializations: string[];
  can_teach: boolean;
  created_at: string;
}

export const ActiveTeachersTable = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select(`
          id,
          user_id,
          rating,
          total_reviews,
          hourly_rate_eur,
          specializations,
          can_teach,
          created_at,
          users!inner(full_name, email)
        `)
        .eq('profile_complete', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTeachers = data?.map((teacher: any) => ({
        id: teacher.id,
        user_id: teacher.user_id,
        full_name: teacher.users?.full_name || 'Unknown',
        email: teacher.users?.email || 'Unknown',
        rating: teacher.rating || 0,
        total_reviews: teacher.total_reviews || 0,
        hourly_rate_eur: teacher.hourly_rate_eur || 0,
        specializations: teacher.specializations || [],
        can_teach: teacher.can_teach,
        created_at: teacher.created_at,
      })) || [];

      setTeachers(formattedTeachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const toggleTeacherStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('teacher_profiles')
        .update({ can_teach: !currentStatus })
        .eq('user_id', userId);

      if (error) throw error;
      
      toast.success(`Teacher ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchTeachers();
    } catch (error) {
      console.error('Error updating teacher status:', error);
      toast.error('Failed to update teacher status');
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading teachers...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Active Teachers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Rate (EUR)</TableHead>
                  <TableHead>Specializations</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No teachers found
                    </TableCell>
                  </TableRow>
                ) : (
                  teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{teacher.full_name}</div>
                          <div className="text-sm text-muted-foreground">{teacher.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{teacher.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">({teacher.total_reviews})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          €{teacher.hourly_rate_eur}/hr
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {teacher.specializations.slice(0, 2).map((spec, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                          {teacher.specializations.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{teacher.specializations.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={teacher.can_teach ? "default" : "secondary"}>
                          {teacher.can_teach ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(teacher.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={teacher.can_teach ? "destructive" : "default"}
                            size="sm"
                            onClick={() => toggleTeacherStatus(teacher.user_id, teacher.can_teach)}
                          >
                            {teacher.can_teach ? "Deactivate" : "Activate"}
                          </Button>
                        </div>
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
};