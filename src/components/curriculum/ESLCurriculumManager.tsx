
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Upload, Search, BarChart3, FolderOpen } from "lucide-react";
import { enhancedESLCurriculumService, CurriculumLevel } from "@/services/enhancedESLCurriculumService";
import { EnhancedLevelCard } from "./components/EnhancedLevelCard";
import { LevelDetailsPanel } from "./components/LevelDetailsPanel";
import { CurriculumBrowser } from "./components/CurriculumBrowser";
import { CurriculumAnalytics } from "./components/CurriculumAnalytics";

export function ESLCurriculumManager() {
  const [levels, setLevels] = useState<CurriculumLevel[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<CurriculumLevel | null>(null);
  const [materialCounts, setMaterialCounts] = useState<Record<string, number>>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadLevels();
  }, [refreshTrigger]);

  const loadLevels = async () => {
    try {
      const levelsData = await enhancedESLCurriculumService.getAllLevels();
      setLevels(levelsData);
      
      // Load material counts for each level
      const counts: Record<string, number> = {};
      for (const level of levelsData) {
        const materials = await enhancedESLCurriculumService.getMaterialsByLevel(level.id);
        counts[level.id] = materials.length;
      }
      setMaterialCounts(counts);
    } catch (error) {
      console.error('Error loading curriculum levels:', error);
    }
  };

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLevelSelect = (level: CurriculumLevel) => {
    setSelectedLevel(selectedLevel?.id === level.id ? null : level);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Enhanced 8-Level ESL Curriculum Framework
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Comprehensive age-appropriate curriculum from Pre-A1 (Starter) to B2 (Upper-Intermediate) 
          with integrated upload system for each level.
        </p>
      </div>

      {/* Statistics Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Curriculum Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{levels.length}</div>
              <div className="text-sm text-gray-600">CEFR Levels</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(materialCounts).reduce((a, b) => a + b, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Materials</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {levels.reduce((sum, level) => sum + level.estimatedHours, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">4-18+</div>
              <div className="text-sm text-gray-600">Age Range</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="levels" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="levels" className="flex items-center gap-2">
            <BookOpen size={16} />
            Levels Overview
          </TabsTrigger>
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Search size={16} />
            Browse Materials
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload size={16} />
            Bulk Upload
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 size={16} />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="levels" className="mt-6 space-y-6">
          {/* Age Group Categories */}
          <div className="space-y-6">
            {/* Young Learners */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                  Young Learners (4-7 years)
                </Badge>
                <span className="text-sm text-gray-600">Pre-A1</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {levels.filter(level => level.cefrLevel === 'Pre-A1').map((level) => (
                  <EnhancedLevelCard
                    key={level.id}
                    level={level}
                    isSelected={selectedLevel?.id === level.id}
                    onSelect={handleLevelSelect}
                    materialCount={materialCounts[level.id] || 0}
                    onUploadComplete={handleUploadComplete}
                  />
                ))}
              </div>
            </div>

            {/* Elementary */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Elementary (6-11 years)
                </Badge>
                <span className="text-sm text-gray-600">A1 - A1+</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {levels.filter(level => ['A1', 'A1+'].includes(level.cefrLevel)).map((level) => (
                  <EnhancedLevelCard
                    key={level.id}
                    level={level}
                    isSelected={selectedLevel?.id === level.id}
                    onSelect={handleLevelSelect}
                    materialCount={materialCounts[level.id] || 0}
                    onUploadComplete={handleUploadComplete}
                  />
                ))}
              </div>
            </div>

            {/* Pre-Teen & Teen */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Pre-Teen & Teen (10-17 years)
                </Badge>
                <span className="text-sm text-gray-600">A2 - B1+</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {levels.filter(level => ['A2', 'A2+', 'B1', 'B1+'].includes(level.cefrLevel)).map((level) => (
                  <EnhancedLevelCard
                    key={level.id}
                    level={level}
                    isSelected={selectedLevel?.id === level.id}
                    onSelect={handleLevelSelect}
                    materialCount={materialCounts[level.id] || 0}
                    onUploadComplete={handleUploadComplete}
                  />
                ))}
              </div>
            </div>

            {/* Young Adults & Adults */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Young Adults & Adults (16+ years)
                </Badge>
                <span className="text-sm text-gray-600">B2+</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {levels.filter(level => ['B2'].includes(level.cefrLevel)).map((level) => (
                  <EnhancedLevelCard
                    key={level.id}
                    level={level}
                    isSelected={selectedLevel?.id === level.id}
                    onSelect={handleLevelSelect}
                    materialCount={materialCounts[level.id] || 0}
                    onUploadComplete={handleUploadComplete}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Level Details Panel */}
          {selectedLevel && (
            <LevelDetailsPanel 
              level={selectedLevel} 
              materialCount={materialCounts[selectedLevel.id] || 0}
              onClose={() => setSelectedLevel(null)}
            />
          )}
        </TabsContent>

        <TabsContent value="browse" className="mt-6">
          <CurriculumBrowser 
            levels={levels}
            refreshTrigger={refreshTrigger}
          />
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Bulk Upload Materials
              </CardTitle>
              <p className="text-sm text-gray-600">
                Upload multiple materials at once. Use individual level cards above for level-specific uploads.
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Upload className="h-12 w-12 mx-auto mb-4" />
                <p>Bulk upload functionality coming soon.</p>
                <p className="text-sm">Use individual level cards for now to upload materials.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <CurriculumAnalytics levels={levels} materialCounts={materialCounts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
