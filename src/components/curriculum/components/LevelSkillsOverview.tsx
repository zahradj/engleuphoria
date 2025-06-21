
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ESLLevel } from "@/types/eslCurriculum";
import { CurriculumMaterial } from "@/services/enhancedESLCurriculumService";
import { Mic, Headphones, BookOpen, PenTool, MessageSquare, Volume2, Music, Gamepad2, GraduationCap, Sparkles } from "lucide-react";

interface LevelSkillsOverviewProps {
  level: ESLLevel;
  materials: CurriculumMaterial[];
}

export function LevelSkillsOverview({ level, materials }: LevelSkillsOverviewProps) {
  const skillCategories = [
    { id: 'listening', name: 'Listening', icon: Headphones, color: 'blue' },
    { id: 'speaking', name: 'Speaking', icon: Mic, color: 'green' },
    { id: 'reading', name: 'Reading', icon: BookOpen, color: 'purple' },
    { id: 'writing', name: 'Writing', icon: PenTool, color: 'orange' },
    { id: 'grammar', name: 'Grammar', icon: MessageSquare, color: 'red' },
    { id: 'vocabulary', name: 'Vocabulary', icon: Sparkles, color: 'pink' },
    { id: 'pronunciation', name: 'Pronunciation', icon: Volume2, color: 'indigo' },
    { id: 'songs', name: 'Songs', icon: Music, color: 'yellow' },
    { id: 'games', name: 'Games', icon: Gamepad2, color: 'emerald' },
    { id: 'exam_prep', name: 'Exam Prep', icon: GraduationCap, color: 'cyan' },
  ];

  const getSkillMaterials = (skillId: string) => {
    return materials.filter(material => 
      material.skillFocus.includes(skillId) || material.type === skillId
    );
  };

  const getSkillProgress = (skillId: string) => {
    const skillMaterials = getSkillMaterials(skillId);
    if (skillMaterials.length === 0) return 0;
    const completedMaterials = skillMaterials.filter(m => m.views > 0).length;
    return Math.round((completedMaterials / skillMaterials.length) * 100);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-600' },
      green: { bg: 'bg-green-100', text: 'text-green-700', icon: 'text-green-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'text-purple-600' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-700', icon: 'text-orange-600' },
      red: { bg: 'bg-red-100', text: 'text-red-700', icon: 'text-red-600' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-700', icon: 'text-pink-600' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: 'text-indigo-600' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: 'text-yellow-600' },
      emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: 'text-emerald-600' },
      cyan: { bg: 'bg-cyan-100', text: 'text-cyan-700', icon: 'text-cyan-600' },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  // Convert skills array to simple strings for rendering
  const levelSkills = level.skills || [];
  const skillNames = levelSkills.map(skill => 
    typeof skill === 'string' ? skill : skill.name || 'Unknown Skill'
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Skills Focus for {level.name}</CardTitle>
          <p className="text-gray-600">
            This level focuses on {skillNames.length} core skills appropriate for {level.ageGroup}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skillNames.map((skill, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="font-medium text-sm">{skill}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category) => {
          const skillMaterials = getSkillMaterials(category.id);
          const progress = getSkillProgress(category.id);
          const colorClasses = getColorClasses(category.color);
          const IconComponent = category.icon;

          return (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses.bg}`}>
                    <IconComponent size={20} className={colorClasses.icon} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {skillMaterials.length} materials
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="font-medium">{skillMaterials.length}</div>
                      <div className="text-gray-600">Materials</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="font-medium">
                        {skillMaterials.reduce((sum, m) => sum + m.xpReward, 0)}
                      </div>
                      <div className="text-gray-600">Total XP</div>
                    </div>
                  </div>
                  
                  {skillMaterials.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Material Types:</div>
                      <div className="flex gap-1 flex-wrap">
                        {Array.from(new Set(skillMaterials.map(m => m.type))).map((type) => (
                          <Badge 
                            key={type} 
                            variant="outline" 
                            className="text-xs"
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {skillMaterials.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No materials yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
