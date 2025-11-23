import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Download, Eye, BookOpen, Library, Target, FileText, Trophy, FolderOpen, Maximize2, Trash2 } from 'lucide-react';
import { useECACurriculum } from '@/hooks/useECACurriculum';
import { ECAMode } from '@/types/curriculumExpert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MaterialPreview } from './MaterialPreview';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CurriculumDetailView } from './CurriculumDetailView';
import { UnitDetailView } from './UnitDetailView';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

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
  rawData?: any;
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
  const [expandedCurriculum, setExpandedCurriculum] = useState<any>(null);
  const [expandedUnit, setExpandedUnit] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    itemId: string;
    itemTitle: string;
    itemMode: ECAMode;
  } | null>(null);
  
  const { 
    getLessons, 
    getUnits, 
    getPrograms, 
    getAssessments, 
    getMissions, 
    getResources,
    deleteLesson,
    deleteUnit,
    deleteProgram,
    deleteAssessment,
    deleteMission,
    deleteResource,
    isLoading: hookLoading
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
        ...(lessons || []).map((l: any) => ({ ...l, mode: 'lesson' as const, rawData: l })),
        ...(units || []).map((u: any) => ({ ...u, mode: 'unit' as const, rawData: u })),
        ...(programs || []).map((p: any) => ({ ...p, mode: 'curriculum' as const, rawData: p })),
        ...(assessments || []).map((a: any) => ({ ...a, mode: 'assessment' as const, rawData: a })),
        ...(missions || []).map((m: any) => ({ ...m, mode: 'mission' as const, rawData: m })),
        ...(resources || []).map((r: any) => ({ ...r, mode: 'resource' as const, rawData: r }))
      ];

      setItems(allItems);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getItemContent = (item: ECALibraryItem) => {
    switch (item.mode) {
      case 'lesson': return item.lesson_data || item.content;
      case 'unit': return item.unit_data || item.content;
      case 'curriculum': return item.program_data || item.content;
      case 'assessment': return item.assessment_data || item.content;
      case 'mission': return item.mission_data || item.content;
      case 'resource': return item.resource_data || item.content;
      default: return item.content;
    }
  };

  const exportItem = (item: ECALibraryItem) => {
    const dataStr = JSON.stringify(getItemContent(item), null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.title.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;
    
    try {
      switch (deleteDialog.itemMode) {
        case 'lesson':
          await deleteLesson(deleteDialog.itemId);
          break;
        case 'unit':
          await deleteUnit(deleteDialog.itemId);
          break;
        case 'curriculum':
          await deleteProgram(deleteDialog.itemId);
          break;
        case 'assessment':
          await deleteAssessment(deleteDialog.itemId);
          break;
        case 'mission':
          await deleteMission(deleteDialog.itemId);
          break;
        case 'resource':
          await deleteResource(deleteDialog.itemId);
          break;
      }
      
      await loadAllContent();
      setDeleteDialog(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Tabs value={selectedMode} onValueChange={(v) => setSelectedMode(v as any)} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="lesson">Lessons</TabsTrigger>
            <TabsTrigger value="unit">Units</TabsTrigger>
            <TabsTrigger value="curriculum">Curricula</TabsTrigger>
            <TabsTrigger value="assessment">Assessments</TabsTrigger>
            <TabsTrigger value="mission">Missions</TabsTrigger>
            <TabsTrigger value="resource">Resources</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="All Ages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ages</SelectItem>
            <SelectItem value="5-7">5-7 years</SelectItem>
            <SelectItem value="8-11">8-11 years</SelectItem>
            <SelectItem value="12-14">12-14 years</SelectItem>
            <SelectItem value="15-17">15-17 years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading materials...</p>
        </div>
      )}

      {/* Items Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  {getModeIcon(item.mode)}
                  {getModeLabel(item.mode)}
                </Badge>
                <Badge variant="outline">{item.cefr_level}</Badge>
              </div>
              <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-xs">{item.age_group}</Badge>
                {item.duration_minutes && (
                  <Badge variant="outline" className="text-xs">{item.duration_minutes} min</Badge>
                )}
                {item.duration_weeks && (
                  <Badge variant="outline" className="text-xs">{item.duration_weeks} weeks</Badge>
                )}
                {item.duration_months && (
                  <Badge variant="outline" className="text-xs">{item.duration_months} months</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Created {new Date(item.created_at).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                {(item.mode === 'curriculum' || item.mode === 'unit') && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      if (item.mode === 'curriculum') {
                        setExpandedCurriculum({ id: item.id, ...item.rawData });
                      } else if (item.mode === 'unit') {
                        setExpandedUnit(item.rawData);
                      }
                    }}
                  >
                    <Maximize2 className="h-4 w-4 mr-2" />
                    Expand
                  </Button>
                )}
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
                        objectives: [],
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteDialog({
                    open: true,
                    itemId: item.id,
                    itemTitle: item.title,
                    itemMode: item.mode
                  })}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
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

      {expandedCurriculum && (
        <CurriculumDetailView
          open={!!expandedCurriculum}
          onOpenChange={(open) => !open && setExpandedCurriculum(null)}
          curriculumId={expandedCurriculum.id}
          curriculum={expandedCurriculum}
        />
      )}

      {expandedUnit && (
        <UnitDetailView
          open={!!expandedUnit}
          onOpenChange={(open) => !open && setExpandedUnit(null)}
          unit={expandedUnit}
          onLessonsGenerated={() => loadAllContent()}
        />
      )}

      {deleteDialog && (
        <DeleteConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => !open && setDeleteDialog(null)}
          onConfirm={handleDelete}
          itemTitle={deleteDialog.itemTitle}
          itemType={deleteDialog.itemMode}
          isDeleting={hookLoading}
        />
      )}
    </div>
  );
};
