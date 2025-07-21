import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Filter, MoreHorizontal, Star, DollarSign, Users, Clock, TrendingUp, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Teacher {
  id: string;
  name: string;
  email: string;
  avatar: string;
  rating: number;
  totalReviews: number;
  lessonsCompleted: number;
  monthlyEarnings: number;
  status: 'active' | 'inactive' | 'pending';
  specializations: string[];
  joinDate: string;
  lastActive: string;
  responseTime: string;
  completionRate: number;
  studentSatisfaction: number;
  languages: string[];
}

export const TeacherManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  // Total stats (computed from teachers data)
  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter(t => t.status === 'active').length;
  const totalEarnings = teachers.reduce((sum, t) => sum + t.monthlyEarnings, 0);
  const avgRating = teachers.length > 0 ? teachers.reduce((sum, t) => sum + t.rating, 0) / teachers.length : 0;

  // Fetch real data from Supabase
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // Get approved teachers from the database
        const { data: teachersData, error } = await supabase.rpc('get_approved_teachers');
        
        if (error) {
          console.error('Error fetching teachers:', error);
          setTeachers([]);
          return;
        }

        // Transform the data to match our interface
        const transformedTeachers: Teacher[] = (teachersData || []).map((teacher: any) => ({
          id: teacher.id,
          name: teacher.full_name,
          email: teacher.user_id, // This would need to be fetched from users table
          avatar: teacher.profile_image_url || '/api/placeholder/40/40',
          rating: teacher.rating || 0,
          totalReviews: teacher.total_reviews || 0,
          lessonsCompleted: 0, // This would need to be calculated
          monthlyEarnings: 0, // This would need to be calculated
          status: teacher.can_teach ? 'active' : 'inactive',
          specializations: teacher.specializations || [],
          joinDate: new Date().toISOString().split('T')[0],
          lastActive: 'N/A', // This would need to be tracked
          responseTime: 'N/A', // This would need to be calculated
          completionRate: 0, // This would need to be calculated
          studentSatisfaction: teacher.rating ? teacher.rating * 20 : 0,
          languages: teacher.languages_spoken || []
        }));

        setTeachers(transformedTeachers);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Filter teachers based on search and filters
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || teacher.status === selectedStatus;
    const matchesSpecialization = selectedSpecialization === 'all' || 
                                  teacher.specializations.includes(selectedSpecialization);
    return matchesSearch && matchesStatus && matchesSpecialization;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get unique specializations for filter
  const allSpecializations = Array.from(new Set(teachers.flatMap(t => t.specializations)));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading teachers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teacher Management</h1>
        <Button>Add Teacher</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Teachers</p>
                <p className="text-2xl font-bold">{totalTeachers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Teachers</p>
                <p className="text-2xl font-bold">{activeTeachers}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">€{totalEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Teachers</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Specializations</option>
                {allSpecializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={teacher.avatar} />
                    <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{teacher.name}</h3>
                    <p className="text-sm text-muted-foreground">{teacher.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(teacher.status)}>
                        {teacher.status}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{teacher.rating}</span>
                        <span className="text-xs text-muted-foreground">({teacher.totalReviews})</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium">€{teacher.monthlyEarnings}</p>
                    <p className="text-xs text-muted-foreground">Monthly</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{teacher.lessonsCompleted}</p>
                    <p className="text-xs text-muted-foreground">Lessons</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{teacher.studentSatisfaction}%</p>
                    <p className="text-xs text-muted-foreground">Satisfaction</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredTeachers.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No teachers found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};