
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Upload, Download, Play, Award, Clock, Users, Target, Lightbulb } from "lucide-react";
import { ESLLevel } from "@/types/eslCurriculum";
import { CurriculumMaterial, enhancedESLCurriculumService } from "@/services/enhancedESLCurriculumService";
import { LevelUploadDialog } from "./LevelUploadDialog";
import { LevelMaterialsGrid } from "./LevelMaterialsGrid";
import { LevelSkillsOverview } from "./LevelSkillsOverview";
import { LevelProgressTracker } from "./LevelProgressTracker";

interface LevelDetailsProps {
  level: ESLLevel;
}

export function LevelDetails({ level }: LevelDetailsProps) {
  const [materials, setMaterials] = useState<CurriculumMaterial[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMaterials();
  }, [level.id]);

  const loadMaterials = async () => {
    setIsLoading(true);
    try {
      const levelMaterials = await enhancedESLCurriculumService.getMaterialsByLevel(level.id);
      setMaterials(levelMaterials);
    } catch (error) {
      toast({
        title: "Error loading materials",
        description: "Failed to load materials for this level.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadComplete = () => {
    setIsUploadOpen(false);
    loadMaterials();
  };

  const handleStartLearning = () => {
    toast({
      title: "Starting learning path",
      description: `Beginning systematic learning for ${level.name}`,
    });
  };

  const getMaterialsByType = (type: string) => {
    return materials.filter(m => m.type === type);
  };

  const calculateLevelProgress = () => {
    if (materials.length === 0) return 0;
    const completedMaterials = materials.filter(m => m.views > 0).length;
    return Math.round((completedMaterials / materials.length) * 100);
  };

  // Convert ESLLevel to CurriculumLevel format for components that need it
  const convertToCurriculumLevel = (eslLevel: ESLLevel) => ({
    id: eslLevel.id,
    name: eslLevel.name,
    cefrLevel: eslLevel.cefrLevel,
    ageGroup: eslLevel.ageGroup,
    description: eslLevel.description,
    levelOrder: eslLevel.levelOrder,
    xpRequired: eslLevel.xpRequired,
    estimatedHours: eslLevel.estimatedHours,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold mb-2">
                {level.name} - {level.cefrLevel}
              </CardTitle>
              <p className="text-gray-600 mb-4">{level.description}</p>
              <div className="flex gap-2">
                <Badge variant="outline">{level.ageGroup}</Badge>
                <Badge variant="secondary">{materials.length} Materials</Badge>
                <Badge variant="outline">{level.skills.length} Skills</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600 mb-1">{level.levelOrder}</div>
              <div className="text-sm text-gray-500">Level Order</div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <div className="font-semibold">{level.estimatedHours}h</div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Award className="h-8 w-8 text-green-600" />
              <div>
                <div className="font-semibold">{level.xpRequired}</div>
                <div className="text-sm text-gray-600">XP Required</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <div>
                <div className="font-semibold">{materials.length}</div>
                <div className="text-sm text-gray-600">Materials</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <Target className="h-8 w-8 text-orange-600" />
              <div>
                <div className="font-semibold">{calculateLevelProgress()}%</div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <Button onClick={handleStartLearning} className="flex items-center gap-2">
              <Play size={16} />
              Start Learning Path
            </Button>
            <Button variant="outline" onClick={() => setIsUploadOpen(true)} className="flex items-center gap-2">
              <Upload size={16} />
              Upload Material
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Download Resources
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target size={16} />
                Level Progress
              </h4>
              <Progress value={calculateLevelProgress()} className="h-3" />
              <p className="text-sm text-gray-600 mt-1">
                {materials.filter(m => m.views > 0).length} of {materials.length} materials accessed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="mt-6">
          <LevelMaterialsGrid 
            materials={materials} 
            isLoading={isLoading}
            onMaterialUpdate={loadMaterials}
          />
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <LevelSkillsOverview level={level} materials={materials} />
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <LevelProgressTracker level={convertToCurriculumLevel(level)} materials={materials} />
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb size={20} />
                Learning Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Material Distribution</h4>
                  <div className="space-y-2">
                    {['worksheet', 'video', 'audio', 'game', 'activity'].map(type => {
                      const count = getMaterialsByType(type).length;
                      const percentage = materials.length > 0 ? (count / materials.length) * 100 : 0;
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <span className="capitalize text-sm">{type}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-8">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Recommendations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="font-medium text-blue-800">Focus Areas</p>
                      <p className="text-blue-700">Add more interactive games for better engagement</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="font-medium text-green-800">Age Appropriateness</p>
                      <p className="text-green-700">All materials are suitable for {level.ageGroup}</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <p className="font-medium text-amber-800">Skill Balance</p>
                      <p className="text-amber-700">Consider adding more listening practice materials</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <LevelUploadDialog
        level={level}
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}
