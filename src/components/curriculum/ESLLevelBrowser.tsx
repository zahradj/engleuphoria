
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { eslCurriculumService } from "@/services/eslCurriculumService";
import { ESLLevel, ESLSkill } from "@/types/eslCurriculum";
import { BookOpen, Users, Clock, Star, ChevronRight, Trophy, Baby, User, GraduationCap } from "lucide-react";

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
      'Pre-A1': 'bg-pink-100 text-pink-800 border-pink-200',
      'A1': 'bg-green-100 text-green-800 border-green-200',
      'A1+': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'A2': 'bg-blue-100 text-blue-800 border-blue-200',
      'A2+': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'B1': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'B1+': 'bg-amber-100 text-amber-800 border-amber-200',
      'B2': 'bg-orange-100 text-orange-800 border-orange-200',
      'B2+': 'bg-red-100 text-red-800 border-red-200',
      'C1': 'bg-purple-100 text-purple-800 border-purple-200',
      'C2': 'bg-violet-100 text-violet-800 border-violet-200'
    };
    return colors[cefrLevel] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getAgeIcon = (ageGroup: string) => {
    if (ageGroup.includes('4-7') || ageGroup.includes('True Beginners')) return Baby;
    if (ageGroup.includes('6-9') || ageGroup.includes('8-11') || ageGroup.includes('9-13')) return User;
    if (ageGroup.includes('12-15') || ageGroup.includes('13-16') || ageGroup.includes('Teens')) return Users;
    return GraduationCap;
  };

  const getSkillIcon = (category: string) => {
    const icons = {
      'listening': '🎧',
      'speaking': '💬',
      'reading': '📖',
      'writing': '✍️',
      'grammar': '📝',
      'vocabulary': '📚',
      'pronunciation': '🗣️',
      'songs': '🎵',
      'games': '🎮',
      'exam_prep': '📋'
    };
    return icons[category] || '📋';
  };

  const getDifficultyLevel = (levelOrder: number) => {
    if (levelOrder <= 2) return { label: 'Beginner', color: 'bg-green-500' };
    if (levelOrder <= 4) return { label: 'Elementary', color: 'bg-blue-500' };
    if (levelOrder <= 6) return { label: 'Intermediate', color: 'bg-yellow-500' };
    return { label: 'Advanced', color: 'bg-red-500' };
  };

  return (
    <div className="space-y-6">
      {/* Enhanced CEFR Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Enhanced 8-Level ESL Curriculum Framework
          </CardTitle>
          <p className="text-sm text-gray-600">
            Comprehensive age-appropriate curriculum from Pre-A1 (Starter) to C1 (Fluent/Proficient)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {levels.map((level) => {
              const AgeIcon = getAgeIcon(level.ageGroup);
              const difficulty = getDifficultyLevel(level.levelOrder);
              
              return (
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
                      <div className="flex items-center gap-1">
                        <AgeIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-xs text-gray-500">{level.levelOrder}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold mb-1 text-sm">{level.name}</h3>
                    <p className="text-xs text-blue-600 mb-2">{level.ageGroup}</p>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{level.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${difficulty.color}`}></div>
                        <span className="text-xs font-medium">{difficulty.label}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span>Skills: {level.skills.length}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {level.estimatedHours}h
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 mb-2">
                        {level.skills.slice(0, 4).map((skill) => (
                          <span key={skill.id} className="text-xs">
                            {getSkillIcon(skill.category)}
                          </span>
                        ))}
                        {level.skills.length > 4 && (
                          <span className="text-xs text-gray-500">+{level.skills.length - 4}</span>
                        )}
                      </div>
                      
                      <div className="text-xs text-purple-600 font-medium">
                        {level.xpRequired === 0 ? 'Starting Level' : `${level.xpRequired} XP Required`}
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
                      <ChevronRight className="h-3 w-3 ml-auto" />
                      Explore Level
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Selected Level Details */}
      {selectedLevel && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Badge className={getLevelColor(selectedLevel.cefrLevel)}>
                {selectedLevel.cefrLevel}
              </Badge>
              <div>
                <div>{selectedLevel.name} - Skills & Content</div>
                <div className="text-sm font-normal text-blue-600">{selectedLevel.ageGroup}</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Skills Section */}
              <div className="lg:col-span-2">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Core Skills ({selectedLevel.skills.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedLevel.skills.map((skill) => (
                    <Card key={skill.id} className="p-3">
                      <div className="flex items-start gap-3">
                        <span className="text-lg">{getSkillIcon(skill.category)}</span>
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{skill.name}</h5>
                          <p className="text-xs text-gray-600 mb-2">{skill.description}</p>
                          <div className="flex flex-wrap items-center gap-1 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {skill.category}
                            </Badge>
                            {skill.canStudentPractice && (
                              <Badge variant="secondary" className="text-xs">
                                Self-Practice
                              </Badge>
                            )}
                            {skill.ageAppropriate && (
                              <Badge variant="default" className="text-xs bg-green-500">
                                Age-Friendly
                              </Badge>
                            )}
                          </div>
                          {skill.grammarPoints && skill.grammarPoints.length > 0 && (
                            <div className="text-xs text-purple-600">
                              Grammar: {skill.grammarPoints.slice(0, 2).join(', ')}
                              {skill.grammarPoints.length > 2 && '...'}
                            </div>
                          )}
                          {skill.vocabularyThemes && skill.vocabularyThemes.length > 0 && (
                            <div className="text-xs text-blue-600">
                              Themes: {skill.vocabularyThemes.slice(0, 2).join(', ')}
                              {skill.vocabularyThemes.length > 2 && '...'}
                            </div>
                          )}
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
                  Level Information
                </h4>
                <div className="space-y-4">
                  <Card className="p-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedLevel.estimatedHours}</div>
                      <div className="text-xs text-gray-600">Study Hours</div>
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

                  <Card className="p-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{selectedLevel.levelOrder}</div>
                      <div className="text-xs text-gray-600">Level Order</div>
                    </div>
                  </Card>

                  <div className="pt-3">
                    <h5 className="font-medium mb-2">Skill Distribution</h5>
                    <div className="space-y-2">
                      {['vocabulary', 'grammar', 'speaking', 'listening', 'reading', 'writing'].map((category) => {
                        const categorySkills = selectedLevel.skills.filter(s => s.category === category);
                        const percentage = selectedLevel.skills.length > 0 ? (categorySkills.length / selectedLevel.skills.length) * 100 : 0;
                        return categorySkills.length > 0 ? (
                          <div key={category}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="capitalize">{category}</span>
                              <span>{categorySkills.length} skill{categorySkills.length !== 1 ? 's' : ''}</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div className="pt-3">
                    <h5 className="font-medium mb-2">Age Appropriateness</h5>
                    <div className="flex items-center gap-2">
                      {React.createElement(getAgeIcon(selectedLevel.ageGroup), { className: "h-5 w-5 text-blue-500" })}
                      <span className="text-sm">{selectedLevel.ageGroup}</span>
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
