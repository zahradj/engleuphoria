
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Users, 
  BookOpen, 
  Brain,
  Clock,
  MessageCircle,
  TrendingUp,
  Gamepad2,
  FileText,
  Star,
  Award,
  Play,
  Upload,
  CheckCircle,
  Bell,
  Sparkles,
  Target,
  Eye,
  Ear,
  Hand
} from 'lucide-react';
import { useClassroomAuth } from '@/hooks/useClassroomAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const UnifiedTeacherDashboard = () => {
  const { user, loading } = useClassroomAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedLevel, setSelectedLevel] = useState('A1');
  const [selectedSkill, setSelectedSkill] = useState('Grammar');
  const [selectedLearningStyle, setSelectedLearningStyle] = useState<'visual' | 'auditory' | 'kinesthetic'>('visual');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Access Required</h2>
          <p className="mb-4">Please sign in to access the teacher dashboard.</p>
          <Button onClick={() => navigate('/login')}>Sign In</Button>
        </Card>
      </div>
    );
  }

  const todaysClasses = [
    {
      id: 1,
      time: "9:00 AM",
      student: "Sara Ahmed",
      level: "A2",
      topic: "Past Tense Review",
      status: "upcoming",
      avatar: "SA"
    },
    {
      id: 2,
      time: "10:30 AM", 
      student: "Adam Chen",
      level: "B1",
      topic: "Conversation Practice",
      status: "ready",
      avatar: "AC"
    },
    {
      id: 3,
      time: "2:00 PM",
      student: "Lina Rossi",
      level: "A1",
      topic: "Vocabulary: Animals",
      status: "upcoming",
      avatar: "LR"
    }
  ];

  const recentStudents = [
    { name: "Sara Ahmed", avatar: "SA", lastClass: "Yesterday", progress: 85 },
    { name: "Adam Chen", avatar: "AC", lastClass: "2 days ago", progress: 92 },
    { name: "Lina Rossi", avatar: "LR", lastClass: "3 days ago", progress: 78 },
    { name: "Maria Santos", avatar: "MS", lastClass: "1 week ago", progress: 88 }
  ];

  const notifications = [
    { type: "message", text: "Parent of Sara: Will be 10 minutes late today", time: "5 min ago", urgent: true },
    { type: "progress", text: "Adam completed vocabulary quiz: 9/10 ✨", time: "1 hour ago", urgent: false },
    { type: "reminder", text: "Lina's homework feedback due today", time: "2 hours ago", urgent: true },
    { type: "achievement", text: "Sara unlocked 'Grammar Master' badge!", time: "Yesterday", urgent: false }
  ];

  const levels = ['A1', 'A2', 'B1', 'B2'];
  const skills = ['Grammar', 'Vocabulary', 'Speaking', 'Listening', 'Reading', 'Writing'];
  const learningStyles = [
    { type: 'visual' as const, icon: Eye, name: 'Visual', color: 'bg-blue-100 text-blue-800' },
    { type: 'auditory' as const, icon: Ear, name: 'Auditory', color: 'bg-green-100 text-green-800' },
    { type: 'kinesthetic' as const, icon: Hand, name: 'Kinesthetic', color: 'bg-purple-100 text-purple-800' }
  ];

  const handleStartClass = (classId: number, studentName: string) => {
    toast({
      title: "Starting Class",
      description: `Launching classroom for ${studentName}...`,
    });
    navigate("/classroom");
  };

  const handleQuickStudentAccess = (studentName: string) => {
    toast({
      title: "Student Profile",
      description: `Opening profile for ${studentName}`,
    });
  };

  const handleMaterialAccess = () => {
    toast({
      title: "Loading Materials",
      description: `Finding ${selectedSkill} materials for ${selectedLevel} level...`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <Card className="bg-white/20 backdrop-blur-xl border border-white/20 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {user.full_name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      Welcome back, {user.full_name}! 🌟
                    </h1>
                    <p className="text-gray-600 text-lg">Ready to inspire minds today?</p>
                    <div className="flex gap-2 mt-3">
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        <Sparkles size={12} className="mr-1" />
                        NLP Enhanced
                      </Badge>
                      <Badge variant="outline" className="border-green-300 text-green-700">
                        3 Classes Today
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => navigate('/classroom')}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Live Class
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Focus Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Classes */}
          <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="text-blue-500" />
                Today's Classes
              </CardTitle>
              <Badge variant="secondary">{todaysClasses.length} scheduled</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysClasses.map((class_) => (
                <div key={class_.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {class_.avatar}
                    </div>
                    <div>
                      <div className="font-medium">{class_.time} - {class_.student}</div>
                      <div className="text-sm text-gray-600">{class_.level} • {class_.topic}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={class_.status === 'ready' ? 'default' : 'secondary'}
                      className={class_.status === 'ready' ? 'bg-green-500' : ''}
                    >
                      {class_.status}
                    </Badge>
                    <Button 
                      size="sm" 
                      onClick={() => handleStartClass(class_.id, class_.student)}
                      disabled={class_.status !== 'ready'}
                    >
                      <Play size={14} className="mr-1" />
                      Start
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Student Access */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="text-green-500" />
                Quick Student Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentStudents.map((student) => (
                <div 
                  key={student.name}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleQuickStudentAccess(student.name)}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                    {student.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{student.name}</div>
                    <div className="text-xs text-gray-500">{student.lastClass}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-green-600">{student.progress}%</div>
                    <div className="w-12 h-1 bg-gray-200 rounded-full">
                      <div 
                        className="h-1 bg-green-500 rounded-full" 
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Smart Material Browser */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="text-purple-500" />
              Smart Material Browser
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Level</label>
                <select 
                  value={selectedLevel} 
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Skill</label>
                <select 
                  value={selectedSkill} 
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  {skills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Learning Style</label>
                <div className="flex gap-1">
                  {learningStyles.map((style) => (
                    <Button
                      key={style.type}
                      variant={selectedLearningStyle === style.type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedLearningStyle(style.type)}
                      className="flex-1 text-xs"
                    >
                      <style.icon size={12} className="mr-1" />
                      {style.name}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-end">
                <Button onClick={handleMaterialAccess} className="w-full">
                  <Target size={16} className="mr-2" />
                  Find Materials
                </Button>
              </div>
            </div>
            
            {/* Quick Material Actions */}
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm">
                <FileText size={14} className="mr-1" />
                View Lesson Plan
              </Button>
              <Button variant="outline" size="sm">
                <Eye size={14} className="mr-1" />
                Open Slides
              </Button>
              <Button variant="outline" size="sm">
                <Gamepad2 size={14} className="mr-1" />
                Launch Game
              </Button>
              <Button variant="outline" size="sm">
                <Upload size={14} className="mr-1" />
                Upload Custom
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Real-time Notifications */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="text-orange-500" />
                Notifications & Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-64 overflow-y-auto">
              {notifications.map((notification, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  notification.urgent ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                    {notification.urgent && (
                      <Badge variant="destructive" className="ml-2">Urgent</Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Post-Class Quick Actions */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="text-green-500" />
                Post-Class Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle size={16} className="mr-2" />
                Mark Attendance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText size={16} className="mr-2" />
                Submit Student Feedback
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload size={16} className="mr-2" />
                Upload Homework/Notes
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle size={16} className="mr-2" />
                Message Parent/Student
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Award size={16} className="mr-2" />
                Award Points/Badges
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* NLP Framework Integration */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="text-purple-500" />
              AI-Powered Teaching Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <Star className="mx-auto mb-2 text-yellow-500" size={24} />
                <h4 className="font-semibold">Smart Recommendations</h4>
                <p className="text-sm text-gray-600">AI suggests materials based on student progress</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <TrendingUp className="mx-auto mb-2 text-green-500" size={24} />
                <h4 className="font-semibold">Progress Analytics</h4>
                <p className="text-sm text-gray-600">Track learning patterns and improvement areas</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <Gamepad2 className="mx-auto mb-2 text-blue-500" size={24} />
                <h4 className="font-semibold">Adaptive Content</h4>
                <p className="text-sm text-gray-600">Materials adjust to learning styles automatically</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
