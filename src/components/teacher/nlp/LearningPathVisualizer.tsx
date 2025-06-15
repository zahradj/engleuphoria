
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Brain, 
  Users, 
  Award, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface LearningPathVisualizerProps {
  activePhase: number;
}

export const LearningPathVisualizer = ({ activePhase }: LearningPathVisualizerProps) => {
  const phases = [
    {
      id: 1,
      name: "Foundation Building",
      progress: 85,
      status: activePhase === 1 ? 'active' : activePhase > 1 ? 'completed' : 'upcoming',
      techniques: ['Visual Anchoring', 'Confidence Building', 'Basic Patterns'],
      duration: '4 weeks',
      icon: Target
    },
    {
      id: 2,
      name: "Pattern Recognition",
      progress: 72,
      status: activePhase === 2 ? 'active' : activePhase > 2 ? 'completed' : 'upcoming',
      techniques: ['Pattern Anchoring', 'Systematic Thinking', 'Grammar Patterns'],
      duration: '4 weeks',
      icon: Brain
    },
    {
      id: 3,
      name: "Contextual Application",
      progress: 58,
      status: activePhase === 3 ? 'active' : activePhase > 3 ? 'completed' : 'upcoming',
      techniques: ['Context Anchoring', 'Real-world Connections', 'Communication Skills'],
      duration: '8 weeks',
      icon: Users
    },
    {
      id: 4,
      name: "Advanced Integration",
      progress: 25,
      status: activePhase === 4 ? 'active' : activePhase > 4 ? 'completed' : 'upcoming',
      techniques: ['Fluency Anchoring', 'Confident Expression', 'Complex Communication'],
      duration: '8 weeks',
      icon: Award
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'upcoming': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'active': return Clock;
      case 'upcoming': return Target;
      default: return Target;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-purple-500" />
          NLP Learning Path
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {phases.map((phase, index) => {
          const StatusIcon = getStatusIcon(phase.status);
          const PhaseIcon = phase.icon;
          
          return (
            <div key={phase.id} className="relative">
              {/* Connection Line */}
              {index < phases.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200 z-0"></div>
              )}
              
              <div className={`relative z-10 p-4 rounded-lg border-2 transition-all ${
                phase.status === 'active' 
                  ? 'border-blue-500 bg-blue-50' 
                  : phase.status === 'completed'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(phase.status)}`}>
                    <PhaseIcon className="text-white" size={20} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800">{phase.name}</h3>
                      <Badge 
                        variant={phase.status === 'active' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {phase.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{phase.duration}</p>
                    
                    {phase.status !== 'upcoming' && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{phase.progress}%</span>
                        </div>
                        <Progress value={phase.progress} className="h-2" />
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-700">NLP Techniques:</p>
                      {phase.techniques.map((technique, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="text-xs mr-1 mb-1">
                          {technique}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <StatusIcon 
                    className={`${
                      phase.status === 'completed' ? 'text-green-500' :
                      phase.status === 'active' ? 'text-blue-500' : 'text-gray-400'
                    }`} 
                    size={20} 
                  />
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Overall Progress */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} />
            <h4 className="font-semibold">Overall Progress</h4>
          </div>
          <div className="text-2xl font-bold mb-1">
            {Math.round(phases.reduce((acc, phase) => acc + phase.progress, 0) / phases.length)}%
          </div>
          <p className="text-sm opacity-90">Across all NLP learning phases</p>
        </div>
      </CardContent>
    </Card>
  );
};
