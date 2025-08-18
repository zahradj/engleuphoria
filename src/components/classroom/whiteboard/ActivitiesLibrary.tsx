import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Gamepad2, 
  MousePointer, 
  Link2, 
  CheckSquare, 
  ArrowUpDown, 
  MapPin,
  Trophy,
  Star,
  Clock,
  Users,
  X,
  Plus,
  Play,
  Settings,
  BarChart3
} from 'lucide-react';
import { DragDropActivity } from './activities/DragDropActivity';
import { MatchPairsActivity } from './activities/MatchPairsActivity';
import { MultipleChoiceActivity } from './activities/MultipleChoiceActivity';
import { OrderingActivity } from './activities/OrderingActivity';
import { HotspotActivity } from './activities/HotspotActivity';

interface ActivityTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  type: 'drag_drop' | 'match_pairs' | 'multiple_choice' | 'ordering' | 'hotspot';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  skills: string[];
  maxPoints: number;
  supportsGrading: boolean;
  supportsAdaptive: boolean;
}

const activityTemplates: ActivityTemplate[] = [
  {
    id: 'drag_drop',
    name: 'Drag & Drop',
    description: 'Drag items to correct targets (categorization, labeling, sorting)',
    icon: MousePointer,
    type: 'drag_drop',
    difficulty: 'beginner',
    estimatedTime: '3-5 min',
    skills: ['Vocabulary', 'Classification', 'Reading'],
    maxPoints: 100,
    supportsGrading: true,
    supportsAdaptive: true
  },
  {
    id: 'match_pairs',
    name: 'Match Pairs',
    description: 'Connect related items (words-definitions, synonyms, images-labels)',
    icon: Link2,
    type: 'match_pairs',
    difficulty: 'beginner',
    estimatedTime: '2-4 min',
    skills: ['Vocabulary', 'Comprehension', 'Association'],
    maxPoints: 100,
    supportsGrading: true,
    supportsAdaptive: true
  },
  {
    id: 'multiple_choice',
    name: 'Multiple Choice',
    description: 'Select correct answers from multiple options',
    icon: CheckSquare,
    type: 'multiple_choice',
    difficulty: 'beginner',
    estimatedTime: '1-3 min',
    skills: ['Reading', 'Grammar', 'Comprehension'],
    maxPoints: 100,
    supportsGrading: true,
    supportsAdaptive: true
  },
  {
    id: 'ordering',
    name: 'Ordering',
    description: 'Arrange items in correct sequence (story steps, grammar rules)',
    icon: ArrowUpDown,
    type: 'ordering',
    difficulty: 'intermediate',
    estimatedTime: '3-6 min',
    skills: ['Sequencing', 'Logic', 'Comprehension'],
    maxPoints: 100,
    supportsGrading: true,
    supportsAdaptive: true
  },
  {
    id: 'hotspot',
    name: 'Hotspot',
    description: 'Click or label specific areas on images or maps',
    icon: MapPin,
    type: 'hotspot',
    difficulty: 'intermediate',
    estimatedTime: '2-5 min',
    skills: ['Visual Recognition', 'Vocabulary', 'Geography'],
    maxPoints: 100,
    supportsGrading: true,
    supportsAdaptive: false
  }
];

interface ActivitiesLibraryProps {
  isVisible: boolean;
  onClose: () => void;
  onAddActivity: (activity: any) => void;
  isTeacher: boolean;
}

export function ActivitiesLibrary({
  isVisible,
  onClose,
  onAddActivity,
  isTeacher
}: ActivitiesLibraryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ActivityTemplate | null>(null);
  const [showCreator, setShowCreator] = useState(false);
  const [createdActivities, setCreatedActivities] = useState<any[]>([]);

  const handleCreateActivity = (template: ActivityTemplate) => {
    setSelectedTemplate(template);
    setShowCreator(true);
  };

  const handleSaveActivity = (activityData: any) => {
    if (!selectedTemplate) return;

    const activity = {
      id: `activity-${Date.now()}`,
      templateId: selectedTemplate.id,
      type: selectedTemplate.type,
      name: activityData.title || selectedTemplate.name,
      description: activityData.description || selectedTemplate.description,
      data: activityData,
      createdAt: new Date(),
      maxPoints: selectedTemplate.maxPoints,
      skills: selectedTemplate.skills,
      estimatedTime: selectedTemplate.estimatedTime,
      x: Math.random() * 200 + 100,
      y: Math.random() * 200 + 100,
      width: 600,
      height: 400
    };

    setCreatedActivities(prev => [...prev, activity]);
    onAddActivity(activity);
    setShowCreator(false);
    setSelectedTemplate(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderActivityCreator = () => {
    if (!selectedTemplate) return null;

    const creatorComponents = {
      drag_drop: DragDropActivity,
      match_pairs: MatchPairsActivity,
      multiple_choice: MultipleChoiceActivity,
      ordering: OrderingActivity,
      hotspot: HotspotActivity
    };

    const CreatorComponent = creatorComponents[selectedTemplate.type];
    
    return (
      <CreatorComponent
        onSave={handleSaveActivity}
        onCancel={() => {
          setShowCreator(false);
          setSelectedTemplate(null);
        }}
        isTeacher={isTeacher}
      />
    );
  };

  if (!isVisible) return null;

  return (
    <>
      <Dialog open={isVisible} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5" />
              Activities Library
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            {/* Templates */}
            <div className="lg:col-span-2">
              <h3 className="font-semibold mb-4">Activity Templates</h3>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {activityTemplates.map((template) => (
                    <Card 
                      key={template.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => isTeacher ? handleCreateActivity(template) : null}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <template.icon className="h-5 w-5 text-blue-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{template.name}</h4>
                              <Badge className={getDifficultyColor(template.difficulty)}>
                                {template.difficulty}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              {template.description}
                            </p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {template.estimatedTime}
                              </div>
                              <div className="flex items-center gap-1">
                                <Trophy className="h-3 w-3" />
                                {template.maxPoints} pts
                              </div>
                              {template.supportsAdaptive && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  Adaptive
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mt-2">
                              {template.skills.map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {isTeacher && (
                            <Button size="sm" variant="outline">
                              <Plus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Created Activities */}
            <div>
              <h3 className="font-semibold mb-4">Your Activities</h3>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {createdActivities.map((activity) => (
                    <Card key={activity.id} className="cursor-pointer hover:shadow-sm">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <div className="p-1 bg-green-100 rounded">
                            <CheckSquare className="h-4 w-4 text-green-600" />
                          </div>
                          
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{activity.name}</h5>
                            <p className="text-xs text-gray-600 mb-1">
                              {activity.type.replace('_', ' ')}
                            </p>
                            
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{activity.maxPoints} pts</span>
                              <span>•</span>
                              <span>{activity.estimatedTime}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => onAddActivity(activity)}
                              title="Add to Board"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              title="View Stats"
                            >
                              <BarChart3 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {createdActivities.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Gamepad2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No activities created yet</p>
                      {isTeacher && (
                        <p className="text-xs">Click a template to get started</p>
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Footer Info */}
          <div className="border-t pt-4 text-xs text-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  <span>Auto-grading with xAPI/SCORM</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  <span>LevelableAI adaptive difficulty</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>Real-time collaboration</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Activity Creator Dialog */}
      {showCreator && (
        <Dialog open={showCreator} onOpenChange={() => setShowCreator(false)}>
          <DialogContent className="max-w-5xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                Create {selectedTemplate?.name} Activity
              </DialogTitle>
            </DialogHeader>
            {renderActivityCreator()}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}