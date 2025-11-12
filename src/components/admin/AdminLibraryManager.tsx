import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, Download, Eye, Trash2, Star, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Material } from '@/types/materialLibrary';

interface MaterialWithCreator extends Material {
  creator_name?: string;
  creator_email?: string;
}

export const AdminLibraryManager = () => {
  const [materials, setMaterials] = useState<MaterialWithCreator[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<MaterialWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [creatorFilter, setCreatorFilter] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialWithCreator | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalDownloads: 0,
    avgRating: 0,
    publicMaterials: 0,
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    filterMaterials();
  }, [searchTerm, typeFilter, levelFilter, creatorFilter, materials]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      
      // Fetch materials from adaptive_content table with user information
      const { data, error } = await supabase
        .from('adaptive_content')
        .select(`
          *,
          creator:users!adaptive_content_user_id_fkey(
            full_name,
            email
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match Material interface
      const transformedMaterials: MaterialWithCreator[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title || 'Untitled',
        description: item.description || '',
        type: item.content_type || 'worksheet',
        level: item.proficiency_level || 'beginner',
        subject: item.subject || 'English',
        topic: item.topic || '',
        duration: item.estimated_duration || 30,
        content: item.content_data,
        url: item.content_url,
        thumbnailUrl: item.thumbnail_url,
        createdBy: item.created_by_role || 'teacher',
        createdAt: new Date(item.created_at),
        lastModified: new Date(item.updated_at || item.created_at),
        tags: item.tags || [],
        downloads: item.download_count || 0,
        rating: item.average_rating || 0,
        isPublic: item.is_public || false,
        isAIGenerated: item.is_ai_generated || false,
        creator_name: item.creator?.full_name || 'Unknown',
        creator_email: item.creator?.email || '',
      }));

      setMaterials(transformedMaterials);
      calculateStats(transformedMaterials);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast.error('Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (materialsData: MaterialWithCreator[]) => {
    const totalDownloads = materialsData.reduce((sum, m) => sum + m.downloads, 0);
    const totalRating = materialsData.reduce((sum, m) => sum + m.rating, 0);
    const avgRating = materialsData.length > 0 ? totalRating / materialsData.length : 0;
    const publicMaterials = materialsData.filter(m => m.isPublic).length;

    setStats({
      totalMaterials: materialsData.length,
      totalDownloads,
      avgRating: Math.round(avgRating * 10) / 10,
      publicMaterials,
    });
  };

  const filterMaterials = () => {
    let filtered = [...materials];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        m =>
          m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(m => m.type === typeFilter);
    }

    // Level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter(m => m.level === levelFilter);
    }

    // Creator filter
    if (creatorFilter !== 'all') {
      filtered = filtered.filter(m => m.createdBy === creatorFilter);
    }

    setFilteredMaterials(filtered);
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('adaptive_content')
        .update({ is_active: false })
        .eq('id', materialId);

      if (error) throw error;

      toast.success('Material deleted successfully');
      fetchMaterials();
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error deleting material:', error);
      toast.error('Failed to delete material');
    }
  };

  const handleFeatureMaterial = async (materialId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('adaptive_content')
        .update({ is_featured: !currentStatus })
        .eq('id', materialId);

      if (error) throw error;

      toast.success(currentStatus ? 'Material unfeatured' : 'Material featured');
      fetchMaterials();
    } catch (error) {
      console.error('Error featuring material:', error);
      toast.error('Failed to update material');
    }
  };

  const handleViewDetails = (material: MaterialWithCreator) => {
    setSelectedMaterial(material);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Platform Library Manager</h2>
        <p className="text-muted-foreground">
          Manage all educational materials across the platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalMaterials}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalDownloads.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.avgRating} ⭐</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Public Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.publicMaterials}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="worksheet">Worksheet</SelectItem>
                <SelectItem value="activity">Activity</SelectItem>
                <SelectItem value="reading">Reading</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="game">Game</SelectItem>
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={creatorFilter} onValueChange={setCreatorFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Creators" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Creators</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="ai">AI Generated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Materials List */}
      <Card>
        <CardHeader>
          <CardTitle>Materials ({filteredMaterials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No materials found matching your filters
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMaterials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{material.title}</h3>
                      <Badge variant="outline">{material.type}</Badge>
                      <Badge variant="outline">{material.level}</Badge>
                      {material.isAIGenerated && (
                        <Badge variant="secondary">AI Generated</Badge>
                      )}
                      {material.isPublic && (
                        <Badge variant="default">Public</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{material.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>By: {material.creator_name}</span>
                      <span>•</span>
                      <span>{material.downloads} downloads</span>
                      <span>•</span>
                      <span>{material.rating} ⭐</span>
                      <span>•</span>
                      <span>{material.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(material)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeatureMaterial(material.id, material.isPublic)}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMaterial(material.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMaterial?.title}</DialogTitle>
            <DialogDescription>Material Details</DialogDescription>
          </DialogHeader>
          {selectedMaterial && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedMaterial.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Type</h4>
                  <Badge>{selectedMaterial.type}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Level</h4>
                  <Badge>{selectedMaterial.level}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Subject</h4>
                  <p className="text-sm text-muted-foreground">{selectedMaterial.subject}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Topic</h4>
                  <p className="text-sm text-muted-foreground">{selectedMaterial.topic}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Duration</h4>
                  <p className="text-sm text-muted-foreground">{selectedMaterial.duration} minutes</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Downloads</h4>
                  <p className="text-sm text-muted-foreground">{selectedMaterial.downloads}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Creator</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedMaterial.creator_name} ({selectedMaterial.creator_email})
                </p>
                <Badge variant="outline" className="mt-1">{selectedMaterial.createdBy}</Badge>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMaterial.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Status</h4>
                <div className="flex gap-2">
                  {selectedMaterial.isPublic && <Badge>Public</Badge>}
                  {selectedMaterial.isAIGenerated && <Badge variant="secondary">AI Generated</Badge>}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Close
            </Button>
            {selectedMaterial && (
              <Button
                variant="destructive"
                onClick={() => handleDeleteMaterial(selectedMaterial.id)}
              >
                Delete Material
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
