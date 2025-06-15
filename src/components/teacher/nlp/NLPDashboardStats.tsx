
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Brain, 
  Clock,
  Award,
  Zap
} from 'lucide-react';

interface NLPDashboardStatsProps {
  activePhase: number;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic';
}

export const NLPDashboardStats = ({ activePhase, learningStyle }: NLPDashboardStatsProps) => {
  const phaseData = {
    1: { progress: 85, students: 12, completion: 78, confidence: 82 },
    2: { progress: 72, students: 15, completion: 68, confidence: 75 },
    3: { progress: 91, students: 8, completion: 89, confidence: 88 },
    4: { progress: 65, students: 5, completion: 72, confidence: 79 }
  };

  const currentData = phaseData[activePhase as keyof typeof phaseData];

  const statsCards = [
    {
      title: 'Active Students',
      value: currentData.students,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      change: '+2 this week'
    },
    {
      title: 'Phase Progress',
      value: `${currentData.progress}%`,
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      change: '+5% this week'
    },
    {
      title: 'Completion Rate',
      value: `${currentData.completion}%`,
      icon: Award,
      color: 'from-purple-500 to-pink-500',
      change: '+8% improvement'
    },
    {
      title: 'Confidence Level',
      value: `${currentData.confidence}%`,
      icon: Brain,
      color: 'from-orange-500 to-red-500',
      change: 'Based on NLP analysis'
    }
  ];

  const nlpTechniques = {
    visual: [
      { name: 'Color-coded Grammar', usage: 92, effectiveness: 88 },
      { name: 'Mind Maps', usage: 85, effectiveness: 91 },
      { name: 'Visual Anchors', usage: 78, effectiveness: 84 }
    ],
    auditory: [
      { name: 'Rhythm Patterns', usage: 89, effectiveness: 87 },
      { name: 'Musical Mnemonics', usage: 82, effectiveness: 89 },
      { name: 'Sound Anchors', usage: 76, effectiveness: 82 }
    ],
    kinesthetic: [
      { name: 'Gesture Learning', usage: 84, effectiveness: 90 },
      { name: 'Physical Anchors', usage: 79, effectiveness: 86 },
      { name: 'Movement Patterns', usage: 72, effectiveness: 83 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}>
                  <stat.icon className="text-white" size={20} />
                </div>
                <Badge variant="outline" className="text-xs">
                  Phase {activePhase}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-xs text-green-600">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* NLP Technique Effectiveness */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="text-yellow-500" />
            NLP Technique Effectiveness - {learningStyle.charAt(0).toUpperCase() + learningStyle.slice(1)} Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nlpTechniques[learningStyle].map((technique, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{technique.name}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-blue-600">Usage: {technique.usage}%</span>
                    <span className="text-green-600">Effectiveness: {technique.effectiveness}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Progress value={technique.usage} className="h-2" />
                  </div>
                  <div>
                    <Progress value={technique.effectiveness} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen />
            Quick Actions for Phase {activePhase}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-left hover:bg-white/30 transition-all">
              <Clock className="mb-2" size={20} />
              <p className="font-medium">Schedule NLP Session</p>
              <p className="text-sm opacity-90">Create focused learning session</p>
            </button>
            <button className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-left hover:bg-white/30 transition-all">
              <Target className="mb-2" size={20} />
              <p className="font-medium">Assess Progress</p>
              <p className="text-sm opacity-90">Run NLP-based evaluation</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
