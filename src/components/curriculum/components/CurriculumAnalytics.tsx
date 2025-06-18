
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CurriculumLevel } from "@/services/enhancedESLCurriculumService";
import { BarChart3, TrendingUp, Users, Clock, Trophy, BookOpen } from "lucide-react";

interface CurriculumAnalyticsProps {
  levels: CurriculumLevel[];
  materialCounts: Record<string, number>;
}

export function CurriculumAnalytics({ levels, materialCounts }: CurriculumAnalyticsProps) {
  const totalMaterials = Object.values(materialCounts).reduce((a, b) => a + b, 0);
  const totalHours = levels.reduce((sum, level) => sum + level.estimatedHours, 0);
  const totalXP = levels.reduce((sum, level) => sum + level.xpRequired, 0);

  const getLevelProgress = (level: CurriculumLevel) => {
    const materialCount = materialCounts[level.id] || 0;
    const expectedMaterials = level.estimatedHours / 5; // Rough estimate
    return Math.min((materialCount / expectedMaterials) * 100, 100);
  };

  const getAgeGroupStats = () => {
    const ageGroups = [
      { name: 'Young Learners (4-7)', levels: levels.filter(l => l.ageGroup.includes('4-7')) },
      { name: 'Elementary (6-11)', levels: levels.filter(l => l.ageGroup.includes('6-9') || l.ageGroup.includes('8-11')) },
      { name: 'Pre-Teen & Teen (10-17)', levels: levels.filter(l => l.ageGroup.includes('10-13') || l.ageGroup.includes('12-15') || l.ageGroup.includes('14-17')) },
      { name: 'Young Adults (16+)', levels: levels.filter(l => l.ageGroup.includes('16+')) }
    ];

    return ageGroups.map(group => ({
      ...group,
      materialCount: group.levels.reduce((sum, level) => sum + (materialCounts[level.id] || 0), 0),
      totalHours: group.levels.reduce((sum, level) => sum + level.estimatedHours, 0)
    }));
  };

  const getMaterialTypeDistribution = () => {
    // This would need to be calculated from actual material data
    // For now, return mock data
    return [
      { type: 'Worksheets', count: Math.floor(totalMaterials * 0.3), color: 'bg-blue-500' },
      { type: 'Activities', count: Math.floor(totalMaterials * 0.25), color: 'bg-green-500' },
      { type: 'Videos', count: Math.floor(totalMaterials * 0.2), color: 'bg-purple-500' },
      { type: 'Games', count: Math.floor(totalMaterials * 0.15), color: 'bg-orange-500' },
      { type: 'Other', count: Math.floor(totalMaterials * 0.1), color: 'bg-gray-500' }
    ];
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Materials</p>
                <p className="text-2xl font-bold text-gray-900">{totalMaterials}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">{totalHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total XP Available</p>
                <p className="text-2xl font-bold text-gray-900">{totalXP.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">CEFR Levels</p>
                <p className="text-2xl font-bold text-gray-900">{levels.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Level Completion Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {levels.map((level) => (
              <div key={level.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{level.cefrLevel}</Badge>
                    <span className="font-medium">{level.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {materialCounts[level.id] || 0} materials • {Math.round(getLevelProgress(level))}%
                  </div>
                </div>
                <Progress value={getLevelProgress(level)} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Age Group Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Age Group Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getAgeGroupStats().map((group) => (
              <div key={group.name} className="space-y-3">
                <h3 className="font-medium">{group.name}</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Levels</p>
                    <p className="font-semibold">{group.levels.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Materials</p>
                    <p className="font-semibold">{group.materialCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Hours</p>
                    <p className="font-semibold">{group.totalHours}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Material Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Material Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getMaterialTypeDistribution().map((item) => (
              <div key={item.type} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium">{item.type}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={(item.count / totalMaterials) * 100} 
                      className="flex-1 h-2"
                    />
                    <span className="text-sm text-gray-600 w-12">{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
