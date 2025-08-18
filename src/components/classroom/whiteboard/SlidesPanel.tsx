import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Upload, 
  Link2, 
  FileImage, 
  Play, 
  Trash2, 
  Copy, 
  Edit3, 
  ExternalLink,
  RefreshCw,
  Lock,
  Eye,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

export interface Slide {
  id: string;
  title: string;
  type: 'upload' | 'embed' | 'canva' | 'generated';
  thumbnail: string;
  src: string;
  updatedAt: Date;
  isLocked?: boolean;
  embedData?: {
    provider: string;
    originalUrl: string;
    canEdit?: boolean;
  };
}

interface SlidesPanelProps {
  slides: Slide[];
  currentSlide: number;
  onSlideSelect: (index: number) => void;
  onAddSlide: (slide: Omit<Slide, 'id'>) => void;
  onAddToBoard?: (content: any) => void;
  isTeacher: boolean;
}

export function SlidesPanel({
  slides,
  currentSlide,
  onSlideSelect,
  onAddSlide,
  onAddToBoard,
  isTeacher
}: SlidesPanelProps) {
  const [embedUrl, setEmbedUrl] = useState('');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(async (file) => {
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const url = URL.createObjectURL(file);
        const thumbnail = await generateThumbnail(file);
        
        onAddSlide({
          title: file.name,
          type: 'upload',
          thumbnail,
          src: url,
          updatedAt: new Date()
        });
        
        toast.success(`Added ${file.name} to slides`);
      }
    });
    
    event.target.value = '';
  };

  // Generate thumbnail for uploaded files
  const generateThumbnail = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(URL.createObjectURL(file));
            return;
          }
          
          canvas.width = 200;
          canvas.height = 150;
          ctx.drawImage(img, 0, 0, 200, 150);
          resolve(canvas.toDataURL());
        };
        img.src = URL.createObjectURL(file);
      } else {
        // For PDFs and other files, use a placeholder
        resolve('/api/placeholder/200/150');
      }
    });
  };

  // Handle embed URL
  const handleAddEmbed = async () => {
    if (!embedUrl.trim()) return;

    try {
      const embedData = await processEmbedUrl(embedUrl);
      
      onAddSlide({
        title: embedData.title || 'Embedded Content',
        type: 'embed',
        thumbnail: embedData.thumbnail || '/api/placeholder/200/150',
        src: embedData.embedUrl,
        updatedAt: new Date(),
        embedData: {
          provider: embedData.provider,
          originalUrl: embedUrl,
          canEdit: embedData.canEdit
        }
      });
      
      setEmbedUrl('');
      toast.success('Added embedded content to slides');
    } catch (error) {
      toast.error('Failed to process embed URL');
    }
  };

  // Process embed URL to extract metadata
  const processEmbedUrl = async (url: string) => {
    // Detect provider
    let provider = 'generic';
    let canEdit = false;
    
    if (url.includes('canva.com')) {
      provider = 'canva';
      canEdit = true;
    } else if (url.includes('docs.google.com/presentation')) {
      provider = 'google_slides';
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
      provider = 'youtube';
    } else if (url.includes('vimeo.com')) {
      provider = 'vimeo';
    }

    // Convert to embed URL if needed
    let embedUrl = url;
    if (provider === 'youtube') {
      const videoId = extractYouTubeVideoId(url);
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (provider === 'vimeo') {
      const videoId = extractVimeoVideoId(url);
      embedUrl = `https://player.vimeo.com/video/${videoId}`;
    } else if (provider === 'google_slides') {
      embedUrl = url.replace('/edit', '/embed');
    }

    return {
      provider,
      embedUrl,
      canEdit,
      title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Content`,
      thumbnail: '/api/placeholder/200/150'
    };
  };

  const extractYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  };

  const extractVimeoVideoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : '';
  };

  // Handle Canva integration
  const openInCanva = (slide: Slide) => {
    if (slide.embedData?.provider === 'canva') {
      // Open Canva editor
      window.open(slide.embedData.originalUrl, '_blank');
      toast.info('Opening in Canva editor...');
    }
  };

  // Drag slide to board
  const dragSlideToBoard = (slide: Slide) => {
    if (onAddToBoard) {
      onAddToBoard({
        id: `slide-${Date.now()}`,
        title: slide.title,
        url: slide.src,
        x: 100,
        y: 100,
        width: 800,
        height: 600,
        fileType: 'slide',
        originalType: slide.type,
        embedData: slide.embedData
      });
      toast.success('Added slide to board');
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Slides</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddMenu(!showAddMenu)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Add Slide Menu */}
        {showAddMenu && (
          <div className="space-y-3 pt-2 border-t">
            {/* Upload Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
            
            {/* Embed URL Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Paste embed URL..."
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                className="text-sm"
              />
              <Button
                size="sm"
                onClick={handleAddEmbed}
                disabled={!embedUrl.trim()}
              >
                <Link2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Canva Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                window.open('https://www.canva.com/design', '_blank');
                toast.info('Opening Canva to create new design...');
              }}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Create in Canva
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {slides.map((slide, index) => (
              <Card
                key={slide.id}
                className={`cursor-pointer transition-all ${
                  currentSlide === index 
                    ? 'ring-2 ring-blue-500 shadow-md' 
                    : 'hover:shadow-sm'
                }`}
                onClick={() => onSlideSelect(index)}
              >
                <div className="p-3">
                  {/* Thumbnail */}
                  <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-2">
                    <img
                      src={slide.thumbnail}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Play overlay for videos */}
                    {(slide.embedData?.provider === 'youtube' || slide.embedData?.provider === 'vimeo') && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    )}
                    
                    {/* Current slide indicator */}
                    {currentSlide === index && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-blue-500">Current</Badge>
                      </div>
                    )}
                    
                    {/* Slide number */}
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        {index + 1}
                      </Badge>
                    </div>
                  </div>

                  {/* Slide Info */}
                  <div>
                    <h4 className="font-medium text-sm truncate mb-1">
                      {slide.title}
                    </h4>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        {slide.type === 'upload' && <FileImage className="h-3 w-3" />}
                        {slide.type === 'embed' && <Link2 className="h-3 w-3" />}
                        {slide.type === 'canva' && <Edit3 className="h-3 w-3" />}
                        <span className="capitalize">{slide.type}</span>
                      </div>
                      
                      {slide.embedData?.provider && (
                        <Badge variant="outline" className="text-xs">
                          {slide.embedData.provider}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        dragSlideToBoard(slide);
                      }}
                      title="Add to Board"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    
                    {slide.embedData?.canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          openInCanva(slide);
                        }}
                        title="Edit in Canva"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(slide.src, '_blank');
                      }}
                      title="Open Original"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    
                    {isTeacher && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle delete
                        }}
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {slides.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileImage className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No slides yet</p>
                <p className="text-xs">Upload files or add embeds to get started</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,application/pdf"
        onChange={handleFileUpload}
        className="hidden"
      />
    </Card>
  );
}