import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Download, Eye, BookOpen, Library, Target, FileText, Trophy, FolderOpen } from 'lucide-react';
import { useECACurriculum } from '@/hooks/useECACurriculum';
import { ECAMode } from '@/types/curriculumExpert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MaterialPreview } from './MaterialPreview';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ECALibraryItem {
  id: string;
  title: string;
  mode: ECAMode;
  age_group: string;
  cefr_level: string;
  created_at: string;
  content?: any;
  program_data?: any;
  unit_data?: any;
  assessment_data?: any;
  mission_data?: any;
  resource_data?: any;
  lesson_data?: any;
  duration_minutes?: number;
  duration_weeks?: number;
  duration_months?: number;
}

const getModeIcon = (mode: ECAMode) => {
  switch (mode) {
    case 'lesson': return <BookOpen className="h-4 w-4" />;
    case 'unit': return <Library className="h-4 w-4" />;
    case 'curriculum': return <FolderOpen className="h-4 w-4" />;
    case 'assessment': return <Target className="h-4 w-4" />;
    case 'mission': return <Trophy className="h-4 w-4" />;
    case 'resource': return <FileText className="h-4 w-4" />;
  }
};

const getModeLabel = (mode: ECAMode) => {
  return mode.charAt(0).toUpperCase() + mode.slice(1);
};

export const ECALibrary = () => {
  const [items, setItems] = useState<ECALibraryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMode, setSelectedMode] = useState<ECAMode | 'all'>('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    getLessons, 
    getUnits, 
    getPrograms, 
    getAssessments, 
    getMissions, 
    getResources 
  } = useECACurriculum();

  useEffect(() => {
    loadAllContent();
  }, [selectedMode, selectedAgeGroup]);

  const loadAllContent = async () => {
    try {
      setIsLoading(true);
      const filters = selectedAgeGroup !== 'all' ? { ageGroup: selectedAgeGroup } : undefined;
      
      const results = await Promise.all([
        selectedMode === 'all' || selectedMode === 'lesson' ? getLessons(filters).catch(() => []) : Promise.resolve([]),
        selectedMode === 'all' || selectedMode === 'unit' ? getUnits(undefined, filters).catch(() => []) : Promise.resolve([]),
        selectedMode === 'all' || selectedMode === 'curriculum' ? getPrograms(filters).catch(() => []) : Promise.resolve([]),
        selectedMode === 'all' || selectedMode === 'assessment' ? getAssessments(filters).catch(() => []) : Promise.resolve([]),
        selectedMode === 'all' || selectedMode === 'mission' ? getMissions(filters).catch(() => []) : Promise.resolve([]),
        selectedMode === 'all' || selectedMode === 'resource' ? getResources(filters).catch(() => []) : Promise.resolve([])
      ]);

      const [lessons, units, programs, assessments, missions, resources] = results;

      const allItems: ECALibraryItem[] = [
        ...(lessons || []).map((l: any) => ({ ...l, mode: 'lesson' as const })),
        ...(units || []).map((u: any) => ({ ...u, mode: 'unit' as const })),
        ...(programs || []).map((p: any) => ({ ...p, mode: 'curriculum' as const })),
        ...(assessments || []).map((a: any) => ({ ...a, mode: 'assessment' as const })),
        ...(missions || []).map((m: any) => ({ ...m, mode: 'mission' as const })),
        ...(resources || []).map((r: any) => ({ ...r, mode: 'resource' as const }))
      ];

      setItems(allItems);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportItem = (item: ECALibraryItem) => {
    const dataStr = JSON.stringify(item, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.title.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getItemContent = (item: ECALibraryItem) => {
    return item.program_data || item.unit_data || item.assessment_data || 
           item.mission_data || item.resource_data || item.lesson_data || item.content || {};
  };

  const getDuration = (item: ECALibraryItem) => {
    if (item.duration_minutes) return `${item.duration_minutes} min`;
    if (item.duration_weeks) return `${item.duration_weeks} weeks`;
    if (item.duration_months) return `${item.duration_months} months`;
    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ECA Library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={selectedMode} onValueChange={(v) => setSelectedMode(v as any)} className="w-full">
            <TabsList className="grid grid-cols-7 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="lesson">Lessons</TabsTrigger>
              <TabsTrigger value="unit">Units</TabsTrigger>
              <TabsTrigger value="curriculum">Curricula</TabsTrigger>
              <TabsTrigger value="assessment">Assessments</TabsTrigger>
              <TabsTrigger value="mission">Missions</TabsTrigger>
              <TabsTrigger value="resource">Resources</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search library..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All age groups" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All age groups</SelectItem>
                <SelectItem value="5-7">Ages 5-7</SelectItem>
                <SelectItem value="8-11">Ages 8-11</SelectItem>
                <SelectItem value="12-14">Ages 12-14</SelectItem>
                <SelectItem value="15-17">Ages 15-17</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            {isLoading ? 'Loading...' : `${filteredItems.length} item(s) found`}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold line-clamp-2 flex-1">{item.title}</h3>
                  <Badge variant="outline">{item.cefr_level}</Badge>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="default" className="text-xs flex items-center gap-1">
                    {getModeIcon(item.mode)}
                    {getModeLabel(item.mode)}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Ages {item.age_group}
                  </Badge>
                  {getDuration(item) && (
                    <Badge variant="secondary" className="text-xs">
                      {getDuration(item)}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Created {new Date(item.created_at).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{item.title}</DialogTitle>
                    </DialogHeader>
                    <MaterialPreview 
                      material={{
                        id: item.id,
                        title: item.title,
                        ageGroup: item.age_group as any,
                        cefrLevel: item.cefr_level as any,
                        materialType: 'lesson',
                        durationMinutes: item.duration_minutes || 30,
                        learningObjectives: [],
                        targetLanguage: { grammar: [], vocabulary: [] },
                        content: getItemContent(item),
                        createdAt: new Date(item.created_at),
                        updatedAt: new Date(item.created_at)
                      }} 
                      mode={item.mode} 
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportItem(item)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No items found. Generate your first ECA content to get started.
          </CardContent>
        </Card>
      )}
    </div>
  );
};
