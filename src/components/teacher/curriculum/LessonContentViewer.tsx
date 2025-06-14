
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Clock, 
  Users, 
  Target, 
  PlayCircle, 
  CheckCircle, 
  Home,
  Eye,
  Ear,
  Hand,
  Download,
  Share2,
  Edit
} from "lucide-react";
import { lessonContentService, LessonContent } from "@/services/lessonContentService";

interface LessonContentViewerProps {
  phase: number;
  week: number;
  onLessonSelect?: (lesson: LessonContent) => void;
}

export function LessonContentViewer({ phase, week, onLessonSelect }: LessonContentViewerProps) {
  const [selectedLesson, setSelectedLesson] = useState<LessonContent | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  const lessons = lessonContentService.getLessonsByWeek(phase, week);
  const totalDuration = lessons.reduce((sum, lesson) => sum + lesson.duration, 0);

  const handleLessonClick = (lesson: LessonContent) => {
    setSelectedLesson(lesson);
    onLessonSelect?.(lesson);
  };

  const getInteractionIcon = (interaction: string) => {
    switch (interaction) {
      case 'individual': return <Users className="h-3 w-3" />;
      case 'pair': return <Users className="h-3 w-3" />;
      case 'group': return <Users className="h-3 w-3" />;
      case 'whole-class': return <Users className="h-3 w-3" />;
      default: return <Users className="h-3 w-3" />;
    }
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'warm-up': return 'bg-green-100 text-green-800';
      case 'presentation': return 'bg-blue-100 text-blue-800';
      case 'practice': return 'bg-orange-100 text-orange-800';
      case 'production': return 'bg-purple-100 text-purple-800';
      case 'review': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Week Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Phase {phase}, Week {week} - Lesson Content
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {totalDuration} minutes total
            </span>
            <span>{lessons.length} lessons</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((lesson, index) => (
              <Card 
                key={lesson.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedLesson?.id === lesson.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleLessonClick(lesson)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Day {lesson.day}</Badge>
                      <span className="text-xs text-gray-500">{lesson.duration}min</span>
                    </div>
                    
                    <h4 className="font-medium text-sm">{lesson.title}</h4>
                    
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {lesson.objective}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <Badge className="text-xs bg-blue-100 text-blue-700">
                        {lesson.activities.length} activities
                      </Badge>
                      <Badge className="text-xs bg-green-100 text-green-700">
                        {lesson.materials.length} materials
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Lesson View */}
      {selectedLesson && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                {selectedLesson.title}
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  Customize
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button size="sm">
                  <PlayCircle className="h-4 w-4 mr-1" />
                  Start Lesson
                </Button>
              </div>
            </div>
            <p className="text-gray-600">{selectedLesson.objective}</p>
            <div className="flex items-center gap-4 text-sm">
              <Badge className="bg-purple-100 text-purple-800">
                Phase {selectedLesson.phase}
              </Badge>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {selectedLesson.duration} minutes
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                <TabsTrigger value="homework">Homework</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Lesson Objective</h4>
                    <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                      {selectedLesson.objective}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">NLP Anchor</h4>
                    <p className="text-purple-700 bg-purple-50 p-3 rounded-lg italic">
                      {selectedLesson.nlpAnchor}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Teacher Notes</h4>
                  <ul className="space-y-2">
                    {selectedLesson.teacherNotes.map((note, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-blue-600 mt-1">•</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Adaptations</h4>
                  <div className="space-y-3">
                    {selectedLesson.adaptations.map((adaptation, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={adaptation.level === 'support' ? 'secondary' : 'outline'}>
                            {adaptation.level}
                          </Badge>
                          <span className="font-medium text-sm">{adaptation.description}</span>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {adaptation.modifications.map((mod, modIndex) => (
                            <li key={modIndex} className="flex items-start gap-2">
                              <span className="text-gray-400">-</span>
                              {mod}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activities" className="space-y-4">
                <div className="space-y-4">
                  {selectedLesson.activities.map((activity, index) => (
                    <Card key={activity.id}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{activity.name}</h4>
                            <div className="flex items-center gap-2">
                              <Badge className={getActivityTypeColor(activity.type)}>
                                {activity.type}
                              </Badge>
                              <span className="text-sm text-gray-500">{activity.duration}min</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-700">{activity.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-sm mb-2">Instructions</h5>
                              <ol className="text-sm space-y-1">
                                {activity.instructions.map((instruction, instrIndex) => (
                                  <li key={instrIndex} className="flex items-start gap-2">
                                    <span className="text-blue-600 font-medium">{instrIndex + 1}.</span>
                                    {instruction}
                                  </li>
                                ))}
                              </ol>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm">
                                {getInteractionIcon(activity.interaction)}
                                <span className="capitalize">{activity.interaction}</span>
                                {activity.technology && (
                                  <Badge variant="outline" className="text-xs">Tech</Badge>
                                )}
                              </div>
                              
                              <div>
                                <h6 className="font-medium text-sm mb-2">VAK Elements</h6>
                                <div className="space-y-1 text-xs">
                                  <div className="flex items-center gap-2">
                                    <Eye className="h-3 w-3 text-blue-600" />
                                    <span>{activity.vakElements.visual}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Ear className="h-3 w-3 text-green-600" />
                                    <span>{activity.vakElements.auditory}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Hand className="h-3 w-3 text-orange-600" />
                                    <span>{activity.vakElements.kinesthetic}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="materials" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedLesson.materials.map((material, index) => (
                    <Card key={material.id}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{material.title}</h4>
                            <Badge variant="outline">{material.type}</Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600">{material.description}</p>
                          
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h5 className="font-medium text-sm mb-2">Instructions</h5>
                            <p className="text-sm">{material.instructions}</p>
                          </div>
                          
                          {material.duration && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              {material.duration} minutes
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              Preview
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="assessment" className="space-y-4">
                <div className="space-y-4">
                  {selectedLesson.assessment.map((assessment, index) => (
                    <Card key={assessment.id}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{assessment.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{assessment.type}</Badge>
                              <span className="text-sm text-gray-500">{assessment.points} pts</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-700">{assessment.description}</p>
                          
                          <div>
                            <h5 className="font-medium text-sm mb-2">Rubric</h5>
                            <div className="space-y-2">
                              {assessment.rubric.criteria.map((criterion, critIndex) => (
                                <div key={critIndex} className="border rounded-lg p-3">
                                  <h6 className="font-medium text-sm mb-2">{criterion.name}</h6>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    {criterion.levels.map((level, levelIndex) => (
                                      <div key={levelIndex} className="text-xs p-2 bg-gray-50 rounded">
                                        <div className="font-medium">Score: {level.score}</div>
                                        <div>{level.description}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {assessment.timeLimit && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              Time limit: {assessment.timeLimit} minutes
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="homework" className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{selectedLesson.homework.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{selectedLesson.homework.submissionType}</Badge>
                          <span className="text-sm text-gray-500">
                            {selectedLesson.homework.estimatedTime}min
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700">{selectedLesson.homework.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-sm mb-2">Materials Needed</h5>
                          <ul className="text-sm space-y-1">
                            {selectedLesson.homework.materials.map((material, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <span className="text-blue-600">•</span>
                                {material}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-sm mb-2">Due Date</h5>
                          <p className="text-sm">{selectedLesson.homework.dueDate}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-sm mb-2">Assessment Rubric</h5>
                        <div className="space-y-2">
                          {selectedLesson.homework.rubric.criteria.map((criterion, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <h6 className="font-medium text-sm mb-2">{criterion.name}</h6>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                {criterion.levels.map((level, levelIndex) => (
                                  <div key={levelIndex} className="text-xs p-2 bg-gray-50 rounded">
                                    <div className="font-medium">Score: {level.score}</div>
                                    <div>{level.description}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
