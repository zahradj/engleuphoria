import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Brain, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Play, 
  Clock, 
  Users, 
  Target,
  Sparkles,
  Library,
  FileText,
  Video,
  Image,
  Mic
} from 'lucide-react';
import { ContentLibraryItem } from '@/services/unifiedAIContentService';
import { GeneratedCurriculum, curriculumGenerationService } from '@/services/curriculumGenerationService';
import { CurriculumGenerationPanel } from '../ai/CurriculumGenerationPanel';

interface EnhancedContentLibraryProps {
  contentItems: any[];
  selectedContent: any;
  onSelectContent: (content: any) => void;
  onPreviewFile?: (content: any) => void;
  onDeleteFile?: (content: any) => void;
  onAddToWhiteboard?: (content: any) => void;
  currentUser: {
    id: string;
    role: 'teacher' | 'student';
    name: string;
  };
}

interface ContentFilter {
  type: 'all' | 'ai-generated' | 'curriculum' | 'uploads' | 'media';
  level: 'all' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  subject: 'all' | 'grammar' | 'vocabulary' | 'conversation' | 'reading' | 'writing';
}

export function EnhancedContentLibrary({
  contentItems,
  selectedContent,
  onSelectContent,
  onPreviewFile,
  onDeleteFile,
  onAddToWhiteboard,
  currentUser
}: EnhancedContentLibraryProps) {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ContentFilter>({
    type: 'all',
    level: 'all',
    subject: 'all'
  });
  const [aiContent, setAiContent] = useState<ContentLibraryItem[]>([]);
  const [curriculums, setCurriculums] = useState<GeneratedCurriculum[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load AI-generated content and curriculums
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      // Load from localStorage or API
      const savedAiContent = localStorage.getItem('ai-generated-content');
      if (savedAiContent) {
        setAiContent(JSON.parse(savedAiContent));
      }

      const savedCurriculums = localStorage.getItem('generated-curriculums');
      if (savedCurriculums) {
        setCurriculums(JSON.parse(savedCurriculums));
      }
    } catch (error) {
      console.error('Failed to load content:', error);
    }
  };

  // Combine all content types
  const getAllContent = () => {
    const combined = [
      ...contentItems.map(item => ({ ...item, contentType: 'upload' })),
      ...aiContent.map(item => ({ ...item, contentType: 'ai-generated' })),
      ...curriculums.map(curriculum => ({
        id: curriculum.id,
        title: `${curriculum.level.name} Curriculum`,
        type: 'curriculum',
        level: curriculum.level.level,
        contentType: 'curriculum',
        metadata: {
          totalPages: curriculum.totalPages,
          totalWeeks: curriculum.level.totalWeeks,
          estimatedHours: curriculum.estimatedStudyTime,
          generatedAt: curriculum.generatedAt
        }
      }))
    ];

    return combined;
  };

  // Filter content based on search and filters
  const getFilteredContent = () => {
    let filtered = getAllContent();

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.level?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      if (filters.type === 'ai-generated') {
        filtered = filtered.filter(item => item.contentType === 'ai-generated');
      } else if (filters.type === 'curriculum') {
        filtered = filtered.filter(item => item.contentType === 'curriculum');
      } else if (filters.type === 'uploads') {
        filtered = filtered.filter(item => item.contentType === 'upload');
      } else if (filters.type === 'media') {
        filtered = filtered.filter(item => 
          item.fileType && ['image', 'video', 'audio'].includes(item.fileType)
        );
      }
    }

    // Level filter
    if (filters.level !== 'all') {
      filtered = filtered.filter(item => item.level === filters.level);
    }

    return filtered;
  };

  const handleCurriculumGenerated = (curriculum: GeneratedCurriculum) => {
    setCurriculums(prev => {
      const updated = [...prev, curriculum];
      localStorage.setItem('generated-curriculums', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAIContentGenerated = (content: ContentLibraryItem) => {
    setAiContent(prev => {
      const updated = [...prev, content];
      localStorage.setItem('ai-generated-content', JSON.stringify(updated));
      return updated;
    });
  };

  const getContentIcon = (item: any) => {
    if (item.contentType === 'curriculum') return Brain;
    if (item.contentType === 'ai-generated') return Sparkles;
    if (item.fileType === 'video') return Video;
    if (item.fileType === 'image') return Image;
    if (item.fileType === 'audio') return Mic;
    return FileText;
  };

  const getContentColor = (item: any) => {
    if (item.contentType === 'curriculum') return 'bg-purple-500';
    if (item.contentType === 'ai-generated') return 'bg-blue-500';
    if (item.fileType === 'video') return 'bg-red-500';
    if (item.fileType === 'image') return 'bg-green-500';
    if (item.fileType === 'audio') return 'bg-orange-500';
    return 'bg-gray-500';
  };

  const filteredContent = getFilteredContent();

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="flex-shrink-0 p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Library className="w-5 h-5 text-primary" />
                Enhanced Content Library
              </h2>
              <p className="text-sm text-muted-foreground">
                AI-generated curriculums, content library, and course materials
              </p>
            </div>
            <Badge variant="secondary" className="bg-primary/10">
              {filteredContent.length} items
            </Badge>
          </div>

          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search size={16} />
              Browse Content
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Brain size={16} />
              AI Generator
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Target size={16} />
              Analytics
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="browse" className="flex-1 min-h-0 flex flex-col">
          {/* Search and Filters */}
          <div className="flex-shrink-0 p-4 bg-white border-b space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Search content, curriculums, and materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter size={16} />
              </Button>
            </div>

            <div className="flex gap-2 flex-wrap">
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">All Types</option>
                <option value="curriculum">Curriculums</option>
                <option value="ai-generated">AI Generated</option>
                <option value="uploads">Uploads</option>
                <option value="media">Media Files</option>
              </select>

              <select
                value={filters.level}
                onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value as any }))}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">All Levels</option>
                <option value="A1">A1 - Beginner</option>
                <option value="A2">A2 - Elementary</option>
                <option value="B1">B1 - Intermediate</option>
                <option value="B2">B2 - Upper-Intermediate</option>
                <option value="C1">C1 - Advanced</option>
                <option value="C2">C2 - Master</option>
              </select>

              <select
                value={filters.subject}
                onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value as any }))}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">All Subjects</option>
                <option value="grammar">Grammar</option>
                <option value="vocabulary">Vocabulary</option>
                <option value="conversation">Conversation</option>
                <option value="reading">Reading</option>
                <option value="writing">Writing</option>
              </select>
            </div>
          </div>

          {/* Content Grid */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4">
            {filteredContent.length === 0 ? (
              <div className="text-center py-12">
                <Library size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No content found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filters.type !== 'all' || filters.level !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Start by generating AI content or uploading materials'
                  }
                </p>
                <Button onClick={() => setActiveTab('generate')}>
                  <Brain size={16} className="mr-2" />
                  Generate Content
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContent.map((item) => {
                  const IconComponent = getContentIcon(item);
                  const colorClass = getContentColor(item);

                  return (
                    <Card
                      key={item.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedContent?.id === item.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => onSelectContent(item)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center mb-2`}>
                            <IconComponent size={20} className="text-white" />
                          </div>
                          <div className="flex gap-1">
                            {item.level && (
                              <Badge variant="secondary" className="text-xs">
                                {item.level}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {item.contentType || item.type}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-sm font-medium line-clamp-2">
                          {item.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="pt-0">
                        {item.contentType === 'curriculum' && (
                          <div className="space-y-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FileText size={12} />
                              {item.metadata?.totalPages} pages
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              {item.metadata?.totalWeeks} weeks
                            </div>
                            <div className="flex items-center gap-1">
                              <Target size={12} />
                              {item.metadata?.estimatedHours}h study time
                            </div>
                          </div>
                        )}

                        {item.contentType === 'ai-generated' && (
                          <div className="space-y-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Sparkles size={12} />
                              {item.type} - {item.level}
                            </div>
                            {item.duration && (
                              <div className="flex items-center gap-1">
                                <Clock size={12} />
                                {item.duration} minutes
                              </div>
                            )}
                          </div>
                        )}

                        {item.contentType === 'upload' && (
                          <div className="space-y-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FileText size={12} />
                              {item.fileType || 'Document'}
                            </div>
                            {item.size && (
                              <div className="flex items-center gap-1">
                                <Target size={12} />
                                {(item.size / 1024 / 1024).toFixed(1)} MB
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex gap-1 mt-3">
                          <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
                            <Eye size={12} className="mr-1" />
                            Preview
                          </Button>
                          {onAddToWhiteboard && (
                            <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
                              <Play size={12} className="mr-1" />
                              Use
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                            <Download size={12} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="generate" className="flex-1 min-h-0">
          <div className="h-full p-4">
            <CurriculumGenerationPanel
              onCurriculumGenerated={handleCurriculumGenerated}
            />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="flex-1 min-h-0">
          <div className="h-full p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">AI Generated</span>
                  </div>
                  <div className="text-2xl font-bold">{aiContent.length}</div>
                  <div className="text-xs text-muted-foreground">Total items</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">Curriculums</span>
                  </div>
                  <div className="text-2xl font-bold">{curriculums.length}</div>
                  <div className="text-xs text-muted-foreground">Generated courses</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Uploaded Files</span>
                  </div>
                  <div className="text-2xl font-bold">{contentItems.length}</div>
                  <div className="text-xs text-muted-foreground">Course materials</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Usage Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Curriculum Progress</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Content Engagement</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>AI Content Usage</span>
                      <span>60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}