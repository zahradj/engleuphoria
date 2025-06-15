
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { eslCurriculumService } from "@/services/eslCurriculumService";
import { ESLLevel, ESLSkill } from "@/types/eslCurriculum";
import { BookOpen, Users, Clock, Star, ChevronRight, Trophy } from "lucide-react";

interface ESLLevelBrowserProps {
  refreshTrigger: number;
}

export function ESLLevelBrowser({ refreshTrigger }: ESLLevelBrowserProps) {
  const [levels, setLevels] = useState<ESLLevel[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<ESLLevel | null>(null);

  useEffect(() => {
    setLevels(eslCurriculumService.getAllLevels());
  }, [refreshTrigger]);

  const getLevelColor = (cefrLevel: string) => {
    const colors = {
      'A1': 'bg-green-100 text-green-800 border-green-200',
      'A2': 'bg-blue-100 text-blue-800 border-blue-200',
      'B1': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'B2': 'bg-orange-100 text-orange-800 border-orange-200',
      'C1': 'bg-red-100 text-red-800 border-red-200',
      'C2': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[cefrLevel] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getSkillIcon = (category: string) => {
    const icons = {
      'listening': '🎧',
      'speaking': '💬',
      'reading': '📖',
      'writing': '✍️',
      'grammar': '📝',
      'vocabulary': '📚',
      'pronunciation': '🗣️'
    };
    return icons[category] || '📋';
  };

  return (
    <div className="space-y-6">
      {/* CEFR Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Common European Framework of Reference (CEFR) Levels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {levels.map((level) => (
              <Card 
                key={level.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedLevel?.id === level.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedLevel(level)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={getLevelColor(level.cefrLevel)}>
                      {level.cefrLevel}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {level.estimatedHours}h
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mb-2">{level.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{level.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Skills: {level.skills.length}</span>
                      <span>XP Required: {level.xpRequired}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {level.skills.slice(0, 3).map((skill) => (
                        <span key={skill.id} className="text-xs">
                          {getSkillIcon(skill.category)}
                        </span>
                      ))}
                      {level.skills.length > 3 && (
                        <span className="text-xs text-gray-500">+{level.skills.length - 3}</span>
                      )}
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    <ChevronRight className="h-3 w-3 ml-auto" />
                    Explore Level
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Level Details */}
      {selectedLevel && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Badge className={getLevelColor(selectedLevel.cefrLevel)}>
                {selectedLevel.cefrLevel}
              </Badge>
              {selectedLevel.name} - Skills & Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills Section */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Core Skills ({selectedLevel.skills.length})
                </h4>
                <div className="space-y-3">
                  {selectedLevel.skills.map((skill) => (
                    <Card key={skill.id} className="p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getSkillIcon(skill.category)}</span>
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{skill.name}</h5>
                          <p className="text-xs text-gray-600">{skill.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {skill.category}
                            </Badge>
                            {skill.canStudentPractice && (
                              <Badge variant="secondary" className="text-xs">
                                Self-Practice
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Progress & Statistics */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Level Statistics
                </h4>
                <div className="space-y-4">
                  <Card className="p-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedLevel.estimatedHours}</div>
                      <div className="text-xs text-gray-600">Estimated Hours</div>
                    </div>
                  </Card>
                  
                  <Card className="p-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedLevel.xpRequired}</div>
                      <div className="text-xs text-gray-600">XP Required</div>
                    </div>
                  </Card>
                  
                  <Card className="p-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{selectedLevel.skills.length}</div>
                      <div className="text-xs text-gray-600">Core Skills</div>
                    </div>
                  </Card>

                  <div className="pt-3">
                    <h5 className="font-medium mb-2">Skill Categories</h5>
                    <div className="space-y-2">
                      {['vocabulary', 'grammar', 'speaking', 'listening'].map((category) => {
                        const categorySkills = selectedLevel.skills.filter(s => s.category === category);
                        const percentage = (categorySkills.length / selectedLevel.skills.length) * 100;
                        return (
                          <div key={category}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="capitalize">{category}</span>
                              <span>{categorySkills.length} skills</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
