
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { CurriculumMaterial } from "@/services/enhancedESLCurriculumService";

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

interface LevelInsightsProps {
  level: CurriculumLevel;
  materials: CurriculumMaterial[];
}

export function LevelInsights({ level, materials }: LevelInsightsProps) {
  const getMaterialsByType = (type: string) => {
    return materials.filter(m => m.type === type);
  };

  return (
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
  );
}
