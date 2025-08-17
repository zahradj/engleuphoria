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
  Mic,
  RefreshCw
} from 'lucide-react';
import { SystematicLessonsLibrary } from '@/components/curriculum/SystematicLessonsLibrary';

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
  type: 'all' | 'uploads' | 'media';
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
  const [activeTab, setActiveTab] = useState('systematic');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ContentFilter>({
    type: 'all',
    level: 'all',
    subject: 'all'
  });
  const [isLoading, setIsLoading] = useState(false);

  // Combine all content types - now only uploads and systematic lessons
  const getAllContent = () => {
    const combined = [
      ...contentItems.map(item => ({ ...item, contentType: 'upload' }))
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
        item.level?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.topic?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      if (filters.type === 'uploads') {
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

  const handleDownloadContent = async (item: any) => {
    try {
      console.log('Downloading:', item.title);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleAddToWhiteboard = (item: any) => {
    if (onAddToWhiteboard) {
      onAddToWhiteboard(item);
    }
  };

  const getContentIcon = (item: any) => {
    if (item.fileType === 'video') return Video;
    if (item.fileType === 'image') return Image;
    if (item.fileType === 'audio') return Mic;
    return FileText;
  };

  const getContentColor = (item: any) => {
    if (item.fileType === 'video') return 'bg-red-500';
    if (item.fileType === 'image') return 'bg-green-500';
    if (item.fileType === 'audio') return 'bg-orange-500';
    return 'bg-gray-500';
  };

  const getLevelColor = (level: string) => {
    const colors = {
      A1: 'bg-green-100 text-green-800',
      A2: 'bg-blue-100 text-blue-800',
      B1: 'bg-yellow-100 text-yellow-800',
      B2: 'bg-orange-100 text-orange-800',
      C1: 'bg-red-100 text-red-800',
      C2: 'bg-purple-100 text-purple-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredContent = getFilteredContent();

  // Content statistics
  const contentStats = {
    total: filteredContent.length,
    uploads: contentItems.length,
    byLevel: {
      A1: filteredContent.filter(item => item.level === 'A1').length,
      A2: filteredContent.filter(item => item.level === 'A2').length,
      B1: filteredContent.filter(item => item.level === 'B1').length,
      B2: filteredContent.filter(item => item.level === 'B2').length,
      C1: filteredContent.filter(item => item.level === 'C1').length,
      C2: filteredContent.filter(item => item.level === 'C2').length
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="min-h-screen flex flex-col">
        <div className="flex-shrink-0 p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Library className="w-5 h-5 text-primary" />
                Enhanced Content Library
              </h2>
              <p className="text-sm text-muted-foreground">
                Complete A-Z curriculum, AI-generated content, and course materials
              </p>
            </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10">
              {contentStats.total} items
            </Badge>
          </div>
          </div>

          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="systematic" className="flex items-center gap-2">
              <Sparkles size={16} />
              Systematic Lessons
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search size={16} />
              Uploaded Files
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="browse" className="flex-1 min-h-0 flex flex-col">
          {/* Search and Filters */}
          <div className="flex-shrink-0 p-4 bg-white border-b space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Search curriculum lessons, AI content, and materials..."
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
                <option value="uploads">Uploaded Files</option>
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
                <option value="C2">C2 - Mastery</option>
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
                <h3 className="text-lg font-medium mb-2">No uploaded files found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filters.type !== 'all' || filters.level !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Upload files to see them here'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* List View of All Content */}
                <div className="bg-white rounded-lg border">
                  <div className="p-4 border-b">
                    <h3 className="font-medium">Uploaded Files ({filteredContent.length} items)</h3>
                  </div>
                  <div className="divide-y min-h-[70vh] overflow-y-auto">
                    {filteredContent.map((item, index) => {
                      const IconComponent = getContentIcon(item);

                      return (
                        <div
                          key={item.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedContent?.id === item.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                          }`}
                          onClick={() => onSelectContent(item)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="text-sm text-muted-foreground font-mono">
                                #{(index + 1).toString().padStart(3, '0')}
                              </div>
                              <div className={`w-8 h-8 ${getContentColor(item)} rounded flex items-center justify-center`}>
                                <IconComponent size={16} className="text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{item.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  {item.level && (
                                    <Badge className={`text-xs ${getLevelColor(item.level)}`}>
                                      {item.level}
                                    </Badge>
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    {item.fileType || item.type}
                                  </span>
                                  {item.topic && (
                                    <span className="text-xs text-muted-foreground">• {item.topic}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadContent(item);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Download size={14} />
                              </Button>
                               <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToWhiteboard(item);
                                }}
                                className="h-8 w-8 p-0"
                                title="Add to Whiteboard"
                               >
                                 <Play size={14} />
                               </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="systematic" className="flex-1 min-h-0">
          <div className="h-full p-4">
            <SystematicLessonsLibrary 
              onSelectLesson={onSelectContent}
              onOpenInClassroom={onAddToWhiteboard}
              isClassroomMode={true}
            />
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}