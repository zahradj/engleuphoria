
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Star, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Eye,
  MessageSquare,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle,
  MoreHorizontal
} from 'lucide-react';

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
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Mock data - in production this would come from APIs
  useEffect(() => {
    const mockTeachers: Teacher[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        avatar: '/api/placeholder/40/40',
        rating: 4.9,
        totalReviews: 127,
        lessonsCompleted: 284,
        monthlyEarnings: 15600,
        status: 'active',
        specializations: ['Grammar', 'Conversation', 'Business English'],
        joinDate: '2024-01-15',
        lastActive: '2 hours ago',
        responseTime: '< 1 hour',
        completionRate: 98.5,
        studentSatisfaction: 96.2,
        languages: ['English', 'French', 'Spanish']
      },
      {
        id: '2',
        name: 'Ahmed Hassan',
        email: 'ahmed.h@example.com',
        avatar: '/api/placeholder/40/40',
        rating: 4.7,
        totalReviews: 89,
        lessonsCompleted: 156,
        monthlyEarnings: 12400,
        status: 'active',
        specializations: ['IELTS Preparation', 'Academic Writing'],
        joinDate: '2024-02-20',
        lastActive: '1 day ago',
        responseTime: '2 hours',
        completionRate: 94.8,
        studentSatisfaction: 92.1,
        languages: ['English', 'Arabic']
      },
      {
        id: '3',
        name: 'Emma Wilson',
        email: 'emma.w@example.com',
        avatar: '/api/placeholder/40/40',
        rating: 4.8,
        totalReviews: 203,
        lessonsCompleted: 367,
        monthlyEarnings: 18900,
        status: 'active',
        specializations: ['Kids English', 'Phonics', 'Storytelling'],
        joinDate: '2023-11-10',
        lastActive: '30 minutes ago',
        responseTime: '< 30 minutes',
        completionRate: 99.1,
        studentSatisfaction: 98.7,
        languages: ['English']
      }
    ];
    setTeachers(mockTeachers);
  }, []);

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || teacher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalEarnings = teachers.reduce((sum, teacher) => sum + teacher.monthlyEarnings, 0);
  const avgRating = teachers.reduce((sum, teacher) => sum + teacher.rating, 0) / teachers.length;
  const activeTeachers = teachers.filter(t => t.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Management</h1>
          <p className="text-gray-600">Manage and monitor teacher performance</p>
        </div>
        <Button>
          <Users className="w-4 h-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Teachers</p>
                <p className="text-2xl font-bold">{activeTeachers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Earnings</p>
                <p className="text-2xl font-bold">{totalEarnings.toLocaleString()} DZD</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold">+15.3%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>
          
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {filteredTeachers.map((teacher) => (
              <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{teacher.name}</h3>
                          <Badge className={getStatusColor(teacher.status)}>
                            {teacher.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{teacher.email}</p>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{teacher.rating}</span>
                            <span className="text-sm text-gray-500">({teacher.totalReviews} reviews)</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {teacher.lessonsCompleted} lessons completed
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {teacher.specializations.map((spec, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Response Time:</span>
                            <p className="font-medium">{teacher.responseTime}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Completion Rate:</span>
                            <p className="font-medium">{teacher.completionRate}%</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Monthly Earnings:</span>
                            <p className="font-medium">{teacher.monthlyEarnings.toLocaleString()} DZD</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Last Active:</span>
                            <p className="font-medium">{teacher.lastActive}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTeacher(teacher)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredTeachers.map((teacher) => (
                  <div key={teacher.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">{teacher.name}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>{teacher.rating}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Completion Rate</span>
                          <span>{teacher.completionRate}%</span>
                        </div>
                        <Progress value={teacher.completionRate} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Student Satisfaction</span>
                          <span>{teacher.studentSatisfaction}%</span>
                        </div>
                        <Progress value={teacher.studentSatisfaction} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Response Speed</span>
                          <span>{teacher.responseTime}</span>
                        </div>
                        <Progress value={85} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTeachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold">{teacher.name}</h4>
                        <p className="text-sm text-gray-600">{teacher.lessonsCompleted} lessons completed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{teacher.monthlyEarnings.toLocaleString()} DZD</p>
                      <p className="text-sm text-gray-600">This month</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
