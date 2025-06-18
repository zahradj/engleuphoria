
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CurriculumLevel } from "@/services/enhancedESLCurriculumService";
import { Upload, BookOpen, Clock, Trophy, Users } from "lucide-react";
import { LevelUploadDialog } from "./LevelUploadDialog";

interface EnhancedLevelCardProps {
  level: CurriculumLevel;
  isSelected: boolean;
  onSelect: (level: CurriculumLevel) => void;
  materialCount?: number;
  onUploadComplete: () => void;
}

export function EnhancedLevelCard({ 
  level, 
  isSelected, 
  onSelect, 
  materialCount = 0,
  onUploadComplete 
}: EnhancedLevelCardProps) {
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const getLevelColor = (cefrLevel: string) => {
    const colors = {
      'Pre-A1': 'bg-pink-100 text-pink-800 border-pink-200',
      'A1': 'bg-green-100 text-green-800 border-green-200',
      'A1+': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'A2': 'bg-blue-100 text-blue-800 border-blue-200',
      'A2+': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'B1': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'B1+': 'bg-orange-100 text-orange-800 border-orange-200',
      'B2': 'bg-red-100 text-red-800 border-red-200',
      'B2+': 'bg-rose-100 text-rose-800 border-rose-200',
      'C1': 'bg-purple-100 text-purple-800 border-purple-200',
      'C1+': 'bg-violet-100 text-violet-800 border-violet-200',
      'C2': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[cefrLevel as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getProgressPercentage = () => {
    // Calculate progress based on material count vs expected materials (simulate)
    const expectedMaterials = level.estimatedHours / 5; // Rough estimate: 5 hours per material
    return Math.min((materialCount / expectedMaterials) * 100, 100);
  };

  return (
    <>
      <Card 
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
        }`}
        onClick={() => onSelect(level)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-2">{level.name}</CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${getLevelColor(level.cefrLevel)} border`}>
                  {level.cefrLevel}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Order {level.levelOrder}
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowUploadDialog(true);
              }}
              className="shrink-0"
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 line-clamp-2">
            {level.description}
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{level.ageGroup}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>{level.estimatedHours}h</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>{level.xpRequired} XP</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-green-500" />
                <span>Materials</span>
              </div>
              <span className="font-medium">{materialCount}</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
            <p className="text-xs text-gray-500">
              {Math.round(getProgressPercentage())}% materials available
            </p>
          </div>
        </CardContent>
      </Card>

      <LevelUploadDialog
        level={level}
        isOpen={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onUploadComplete={() => {
          onUploadComplete();
          setShowUploadDialog(false);
        }}
      />
    </>
  );
}
