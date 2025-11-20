import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Download, Eye } from 'lucide-react';
import { useCurriculumExpert } from '@/hooks/useCurriculumExpert';
import { CurriculumMaterial, AgeGroup } from '@/types/curriculumExpert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MaterialPreview } from './MaterialPreview';

export const MaterialLibrary = () => {
  const [materials, setMaterials] = useState<CurriculumMaterial[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | 'all'>('all');
  const { getMaterialsByAge } = useCurriculumExpert();

  useEffect(() => {
    loadMaterials();
  }, [selectedAgeGroup]);

  const loadMaterials = async () => {
    if (selectedAgeGroup === 'all') {
      // Load all materials
      const promises = ['5-7', '8-11', '12-14', '15-17'].map(age =>
        getMaterialsByAge(age as AgeGroup)
      );
      const results = await Promise.all(promises);
      setMaterials(results.flat());
    } else {
      const data = await getMaterialsByAge(selectedAgeGroup);
      setMaterials(data);
    }
  };

  const filteredMaterials = materials.filter(material =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.targetLanguage.grammar.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
    material.targetLanguage.vocabulary.some(v => v.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportMaterial = (material: CurriculumMaterial) => {
    const dataStr = JSON.stringify(material, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${material.title.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Curriculum Library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedAgeGroup} onValueChange={(v) => setSelectedAgeGroup(v as any)}>
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
            {filteredMaterials.length} material(s) found
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((material) => (
          <Card key={material.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold line-clamp-2">{material.title}</h3>
                  <Badge variant="outline">{material.cefrLevel}</Badge>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    Ages {material.ageGroup}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {material.durationMinutes} min
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground line-clamp-2">
                {material.learningObjectives[0]}
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
                      <DialogTitle>Material Preview</DialogTitle>
                    </DialogHeader>
                    <MaterialPreview material={material} mode="lesson" />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportMaterial(material)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No materials found. Generate your first curriculum material to get started.
          </CardContent>
        </Card>
      )}
    </div>
  );
};