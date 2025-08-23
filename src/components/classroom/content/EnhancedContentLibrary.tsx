import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  Download, 
  Play, 
  FileText, 
  Video, 
  Image, 
  Mic, 
  Library,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { SystematicLessonsLibrary } from '@/components/curriculum/SystematicLessonsLibrary';
import { PlacementTestLibrary } from './PlacementTestLibrary';

interface EnhancedContentLibraryProps {
  contentItems: any[];
  selectedContent: any;
  onSelectContent: (content: any) => void;
  onPreviewFile?: (content: any) => void;
  onDeleteFile?: (content: any) => void;
  onAddToWhiteboard?: (content: any) => void;
  onLoadLesson?: (lessonId: string) => void;
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
  onLoadLesson,
  currentUser
}: EnhancedContentLibraryProps) {
  const [activeTab, setActiveTab] = useState(() => {
    // Persist the last used tab in localStorage
    return localStorage.getItem('contentLibraryActiveTab') || 'systematic';
  });
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
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        localStorage.setItem('contentLibraryActiveTab', value);
      }} className="h-full flex flex-col">
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

          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="systematic" className="flex items-center gap-2">
              <Sparkles size={16} />
              Systematic Lessons
            </TabsTrigger>
            <TabsTrigger value="placement" className="flex items-center gap-2">
              <GraduationCap size={16} />
              Placement Test
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search size={16} />
              Uploaded Files
            </TabsTrigger>
          </TabsList>
        </div>


        <TabsContent value="systematic" className="flex-1 min-h-0">
          <div className="h-full overflow-y-auto p-4">
            <SystematicLessonsLibrary onLoadLesson={onLoadLesson} />
          </div>
        </TabsContent>

        <TabsContent value="placement" className="flex-1 min-h-0">
          <PlacementTestLibrary 
            onTestComplete={(result) => {
              console.log('Placement test completed:', result);
              // Here you could save the result to the user's profile
            }}
          />
        </TabsContent>


      </Tabs>
    </div>
  );
}