
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CurriculumMaterial } from "@/services/enhancedESLCurriculumService";
import { BookOpen, Target, Award, Users } from "lucide-react";

// Define CurriculumLevel interface to match what this component expects
interface CurriculumLevel {
  id: string;
  name: string;
  cefrLevel: string;
  ageGroup: string;
  description: string;
  levelOrder: number;
  xpRequired: number;
  estimatedHours: number;
  skills: any[];
  createdAt: string;
  updatedAt: string;
}

interface LevelSkillsOverviewProps {
  level: CurriculumLevel;
  materials: CurriculumMaterial[];
}

export function LevelSkillsOverview({ level, materials }: LevelSkillsOverviewProps) {
  const getSkillProgress = (skillId: string) => {
    const skillMaterials = materials.filter(m => 
      m.skillFocus && m.skillFocus.includes(skillId)
    );
    if (skillMaterials.length === 0) return 0;
    
    const completedMaterials = skillMaterials.filter(m => m.views > 0).length;
    return Math.round((completedMaterials / skillMaterials.length) * 100);
  };

  const getMaterialCountForSkill = (skillId: string) => {
    return materials.filter(m => 
      m.skillFocus && m.skillFocus.includes(skillId)
    ).length;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target size={20} />
            Skills Overview for {level.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {level.skills && level.skills.length > 0 ? (
              level.skills.map((skill: any, index: number) => {
                const progress = getSkillProgress(skill.id || skill.name);
                const materialCount = getMaterialCountForSkill(skill.id || skill.name);
                
                return (
                  <Card key={skill.id || index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-sm">{skill.name}</h4>
                            <Badge variant="outline" className="text-xs mt-1 capitalize">
                              {skill.category}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">{progress}%</div>
                            <div className="text-xs text-gray-500">Complete</div>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {skill.description}
                        </p>
                        
                        <div className="space-y-2">
                          <Progress value={progress} className="h-2" />
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <BookOpen size={12} />
                              {materialCount} materials
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              {skill.ageAppropriate ? 'Age appropriate' : 'Check age'}
                            </span>
                          </div>
                        </div>
                        
                        {skill.grammarPoints && skill.grammarPoints.length > 0 && (
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-gray-700">Grammar Points:</div>
                            <div className="flex flex-wrap gap-1">
                              {skill.grammarPoints.slice(0, 2).map((point: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {point}
                                </Badge>
                              ))}
                              {skill.grammarPoints.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{skill.grammarPoints.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {skill.vocabularyThemes && skill.vocabularyThemes.length > 0 && (
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-gray-700">Vocabulary Themes:</div>
                            <div className="flex flex-wrap gap-1">
                              {skill.vocabularyThemes.slice(0, 2).map((theme: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {theme}
                                </Badge>
                              ))}
                              {skill.vocabularyThemes.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{skill.vocabularyThemes.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                <p>No skills defined for this level yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award size={20} />
            Skill Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {level.skills ? level.skills.length : 0}
              </div>
              <div className="text-sm text-blue-700">Total Skills</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {level.skills ? 
                  level.skills.filter((skill: any) => getSkillProgress(skill.id || skill.name) >= 80).length 
                  : 0
                }
              </div>
              <div className="text-sm text-green-700">Skills Mastered (80%+)</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {level.skills ? 
                  level.skills.filter((skill: any) => skill.ageAppropriate).length 
                  : 0
                }
              </div>
              <div className="text-sm text-orange-700">Age Appropriate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
