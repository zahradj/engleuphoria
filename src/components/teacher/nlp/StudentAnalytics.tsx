
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Eye, 
  Ear, 
  Hand, 
  Target,
  Zap,
  Heart,
  Clock
} from 'lucide-react';

interface StudentAnalyticsProps {
  activePhase: number;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic';
}

export const StudentAnalytics = ({ activePhase, learningStyle }: StudentAnalyticsProps) => {
  const studentData = [
    {
      name: 'Emma Johnson',
      phase: 2,
      preferredStyle: 'visual',
      confidenceLevel: 88,
      engagementScore: 92,
      nlpProgress: 85,
      emotionalState: 'confident',
      recentActivity: '2 hours ago'
    },
    {
      name: 'Carlos Rodriguez',
      phase: 1,
      preferredStyle: 'kinesthetic',
      confidenceLevel: 76,
      engagementScore: 89,
      nlpProgress: 78,
      emotionalState: 'motivated',
      recentActivity: '4 hours ago'
    },
    {
      name: 'Li Wei',
      phase: 3,
      preferredStyle: 'auditory',
      confidenceLevel: 91,
      engagementScore: 95,
      nlpProgress: 93,
      emotionalState: 'excited',
      recentActivity: '1 hour ago'
    },
    {
      name: 'Sophie Martin',
      phase: 2,
      preferredStyle: 'visual',
      confidenceLevel: 82,
      engagementScore: 87,
      nlpProgress: 80,
      emotionalState: 'focused',
      recentActivity: '3 hours ago'
    }
  ];

  const nlpMetrics = {
    anchoringSuccess: 87,
    patternRecognition: 82,
    emotionalConnection: 91,
    metacognitionDevelopment: 79,
    confidenceBuilding: 85
  };

  const getStyleIcon = (style: string) => {
    switch (style) {
      case 'visual': return Eye;
      case 'auditory': return Ear;
      case 'kinesthetic': return Hand;
      default: return Brain;
    }
  };

  const getEmotionalColor = (state: string) => {
    switch (state) {
      case 'confident': return 'bg-green-100 text-green-700';
      case 'motivated': return 'bg-blue-100 text-blue-700';
      case 'excited': return 'bg-yellow-100 text-yellow-700';
      case 'focused': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* NLP Effectiveness Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
          <CardContent className="p-4 text-center">
            <Brain className="mx-auto mb-2" size={32} />
            <p className="text-2xl font-bold">{nlpMetrics.anchoringSuccess}%</p>
            <p className="text-sm opacity-90">Anchoring Success Rate</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
          <CardContent className="p-4 text-center">
            <Target className="mx-auto mb-2" size={32} />
            <p className="text-2xl font-bold">{nlpMetrics.patternRecognition}%</p>
            <p className="text-sm opacity-90">Pattern Recognition</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
          <CardContent className="p-4 text-center">
            <Heart className="mx-auto mb-2" size={32} />
            <p className="text-2xl font-bold">{nlpMetrics.emotionalConnection}%</p>
            <p className="text-sm opacity-90">Emotional Connection</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed NLP Metrics */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="text-yellow-500" />
            NLP Technique Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(nlpMetrics).map(([metric, value]) => (
              <div key={metric} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium capitalize">
                    {metric.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-sm font-semibold">{value}%</span>
                </div>
                <Progress value={value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Performance Details */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-blue-500" />
            Individual Student Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentData.map((student, index) => {
              const StyleIcon = getStyleIcon(student.preferredStyle);
              
              return (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{student.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Badge variant="outline" className="text-xs">
                            Phase {student.phase}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <StyleIcon size={12} />
                            <span className="capitalize">{student.preferredStyle}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getEmotionalColor(student.emotionalState)}>
                        {student.emotionalState}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Clock size={10} />
                        {student.recentActivity}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Confidence Level</p>
                      <div className="flex items-center gap-2">
                        <Progress value={student.confidenceLevel} className="h-2 flex-1" />
                        <span className="text-sm font-semibold">{student.confidenceLevel}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Engagement Score</p>
                      <div className="flex items-center gap-2">
                        <Progress value={student.engagementScore} className="h-2 flex-1" />
                        <span className="text-sm font-semibold">{student.engagementScore}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">NLP Progress</p>
                      <div className="flex items-center gap-2">
                        <Progress value={student.nlpProgress} className="h-2 flex-1" />
                        <span className="text-sm font-semibold">{student.nlpProgress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Learning Style Distribution */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-green-500" />
            Learning Style Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Eye className="mx-auto mb-2 text-blue-500" size={32} />
              <p className="text-2xl font-bold text-blue-700">45%</p>
              <p className="text-sm text-blue-600">Visual Learners</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Ear className="mx-auto mb-2 text-green-500" size={32} />
              <p className="text-2xl font-bold text-green-700">30%</p>
              <p className="text-sm text-green-600">Auditory Learners</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Hand className="mx-auto mb-2 text-purple-500" size={32} />
              <p className="text-2xl font-bold text-purple-700">25%</p>
              <p className="text-sm text-purple-600">Kinesthetic Learners</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
