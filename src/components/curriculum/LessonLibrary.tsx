import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Search, Filter, Plus, Play } from 'lucide-react';
import { curriculumLevels, CurriculumLevel } from '@/data/curriculum/levels';
import { LevelBrowser } from './LevelBrowser';
import { LessonViewer } from './LessonViewer';

interface LessonLibraryProps {}

export const LessonLibrary: React.FC<LessonLibraryProps> = () => {
  const [selectedLevel, setSelectedLevel] = useState<CurriculumLevel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cefrFilter, setCefrFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'overview' | 'level' | 'lesson'>('overview');
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  const filteredLevels = curriculumLevels.filter(level => {
    const matchesSearch = level.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         level.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCefr = cefrFilter === 'all' || level.cefrLevel === cefrFilter;
    return matchesSearch && matchesCefr;
  });

  const handleLevelSelect = (level: CurriculumLevel) => {
    setSelectedLevel(level);
    setViewMode('level');
  };

  const handleLessonSelect = (lesson: any) => {
    setSelectedLesson(lesson);
    setViewMode('lesson');
  };

  const handleBackToOverview = () => {
    setViewMode('overview');
    setSelectedLevel(null);
    setSelectedLesson(null);
  };

  const handleBackToLevel = () => {
    setViewMode('level');
    setSelectedLesson(null);
  };

  if (viewMode === 'lesson' && selectedLesson) {
    return (
      <LessonViewer
        lesson={selectedLesson}
        onBack={handleBackToLevel}
      />
    );
  }

  if (viewMode === 'level' && selectedLevel) {
    return (
      <LevelBrowser
        level={selectedLevel}
        onBack={handleBackToOverview}
        onLessonSelect={handleLessonSelect}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Systematic English Curriculum Library
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search levels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={cefrFilter} onValueChange={setCefrFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="CEFR Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Pre-A1">Pre-A1</SelectItem>
                  <SelectItem value="A1">A1</SelectItem>
                  <SelectItem value="A2">A2</SelectItem>
                  <SelectItem value="B1">B1</SelectItem>
                  <SelectItem value="B1+">B1+</SelectItem>
                  <SelectItem value="B2">B2</SelectItem>
                  <SelectItem value="C1">C1</SelectItem>
                  <SelectItem value="C2">C2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Curriculum Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredLevels.map((level) => (
          <Card key={level.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleLevelSelect(level)}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="text-2xl">{level.icon}</div>
                <Badge className={level.color}>{level.cefrLevel}</Badge>
              </div>
              <CardTitle className="text-lg">{level.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{level.ageGroup}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{level.description}</p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Modules:</span>
                  <span>{level.modules}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lessons per Module:</span>
                  <span>{level.lessonsPerModule}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Hours:</span>
                  <span>{level.estimatedHours}h</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline" size="sm">
                <Play className="h-4 w-4 mr-2" />
                Explore Level
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLevels.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No curriculum levels found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};