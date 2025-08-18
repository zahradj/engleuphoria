import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Link2, 
  Youtube, 
  Play, 
  FileText, 
  Globe, 
  Edit3,
  Image,
  Video,
  Music,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface EmbedLinksManagerProps {
  onAddEmbed: (content: any) => void;
}

interface EmbedProvider {
  name: string;
  icon: React.ElementType;
  color: string;
  domain: string;
  embedTransform?: (url: string) => string;
}

const supportedProviders: EmbedProvider[] = [
  {
    name: 'Canva',
    icon: Edit3,
    color: 'bg-purple-500',
    domain: 'canva.com',
    embedTransform: (url) => url.replace('/design/', '/embed/design/')
  },
  {
    name: 'Google Slides',
    icon: FileText,
    color: 'bg-blue-500',
    domain: 'docs.google.com',
    embedTransform: (url) => url.replace('/edit', '/embed')
  },
  {
    name: 'YouTube',
    icon: Youtube,
    color: 'bg-red-500',
    domain: 'youtube.com',
    embedTransform: (url) => {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
  },
  {
    name: 'Vimeo',
    icon: Play,
    color: 'bg-cyan-500',
    domain: 'vimeo.com',
    embedTransform: (url) => {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
  },
  {
    name: 'Figma',
    icon: Image,
    color: 'bg-pink-500',
    domain: 'figma.com',
    embedTransform: (url) => url.replace('/file/', '/embed/file/')
  },
  {
    name: 'Generic',
    icon: Globe,
    color: 'bg-gray-500',
    domain: ''
  }
];

export function EmbedLinksManager({ onAddEmbed }: EmbedLinksManagerProps) {
  const [embedUrl, setEmbedUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<{
    status: 'idle' | 'valid' | 'invalid';
    provider?: EmbedProvider;
    title?: string;
    thumbnail?: string;
  }>({ status: 'idle' });

  // Validate URL and detect provider
  const validateUrl = async (url: string) => {
    if (!url.trim()) {
      setValidation({ status: 'idle' });
      return;
    }

    setIsValidating(true);
    
    try {
      // Detect provider
      const provider = supportedProviders.find(p => 
        p.domain && url.includes(p.domain)
      ) || supportedProviders.find(p => p.name === 'Generic');

      if (!provider) {
        setValidation({ status: 'invalid' });
        return;
      }

      // Basic URL validation
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(url)) {
        setValidation({ status: 'invalid' });
        return;
      }

      // Try to fetch metadata (in a real app, this would be done server-side)
      let title = `${provider.name} Content`;
      let thumbnail = '/api/placeholder/400/300';

      // For known providers, we can construct better metadata
      if (provider.name === 'YouTube') {
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
        if (videoId) {
          title = 'YouTube Video';
          thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        }
      } else if (provider.name === 'Canva') {
        title = 'Canva Design';
      } else if (provider.name === 'Google Slides') {
        title = 'Google Slides Presentation';
      }

      setValidation({
        status: 'valid',
        provider,
        title,
        thumbnail
      });
    } catch (error) {
      setValidation({ status: 'invalid' });
    } finally {
      setIsValidating(false);
    }
  };

  // Handle URL input change
  const handleUrlChange = (value: string) => {
    setEmbedUrl(value);
    
    // Debounce validation
    clearTimeout((window as any).embedValidationTimeout);
    (window as any).embedValidationTimeout = setTimeout(() => {
      validateUrl(value);
    }, 500);
  };

  // Add embed to board
  const handleAddEmbed = () => {
    if (validation.status !== 'valid' || !validation.provider) {
      toast.error('Please enter a valid URL');
      return;
    }

    const embedUrlProcessed = validation.provider.embedTransform 
      ? validation.provider.embedTransform(embedUrl)
      : embedUrl;

    const embedContent = {
      id: `embed-${Date.now()}`,
      title: validation.title || 'Embedded Content',
      url: embedUrlProcessed,
      originalUrl: embedUrl,
      x: Math.random() * 200 + 100,
      y: Math.random() * 200 + 100,
      width: 800,
      height: 600,
      fileType: 'embed',
      provider: validation.provider.name.toLowerCase(),
      thumbnail: validation.thumbnail,
      embedData: {
        provider: validation.provider.name.toLowerCase(),
        originalUrl: embedUrl,
        canEdit: validation.provider.name === 'Canva'
      }
    };

    onAddEmbed(embedContent);
    
    // Reset form
    setEmbedUrl('');
    setValidation({ status: 'idle' });
    
    toast.success(`Added ${validation.provider.name} content to board`);
  };

  // Quick add buttons for common providers
  const openProviderForCreation = (providerName: string) => {
    const urls = {
      'Canva': 'https://www.canva.com/design',
      'Google Slides': 'https://docs.google.com/presentation/u/0/?authuser=0',
      'Figma': 'https://www.figma.com',
    };
    
    const url = urls[providerName as keyof typeof urls];
    if (url) {
      window.open(url, '_blank');
      toast.info(`Opening ${providerName} to create new content...`);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Embed Links</h3>
          </div>

          {/* URL Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Paste link (Canva, Google Slides, YouTube, etc.)"
                value={embedUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="pr-10"
              />
              
              {/* Validation Status */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isValidating && (
                  <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
                )}
                {!isValidating && validation.status === 'valid' && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                {!isValidating && validation.status === 'invalid' && (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
            
            <Button
              onClick={handleAddEmbed}
              disabled={validation.status !== 'valid'}
            >
              Add to Board
            </Button>
          </div>

          {/* Validation Preview */}
          {validation.status === 'valid' && validation.provider && (
            <div className="border rounded-lg p-3 bg-green-50 border-green-200">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${validation.provider.color}`}>
                  <validation.provider.icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{validation.title}</div>
                  <div className="text-xs text-gray-600">
                    {validation.provider.name} • Ready to embed
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(embedUrl, '_blank')}
                  title="Preview"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {validation.status === 'invalid' && embedUrl.trim() && (
            <div className="border rounded-lg p-3 bg-red-50 border-red-200">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Invalid or unsupported URL</span>
              </div>
            </div>
          )}

          {/* Supported Providers */}
          <div>
            <h4 className="text-sm font-medium mb-2">Supported Platforms</h4>
            <div className="flex flex-wrap gap-2">
              {supportedProviders.filter(p => p.name !== 'Generic').map((provider) => (
                <Button
                  key={provider.name}
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => openProviderForCreation(provider.name)}
                >
                  <provider.icon className="h-3 w-3 mr-1" />
                  <span className="text-xs">{provider.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="text-xs text-gray-600 space-y-1">
            <p>💡 <strong>Tips:</strong></p>
            <ul className="space-y-1 ml-4">
              <li>• Canva designs will be live-updated when you edit them</li>
              <li>• Google Slides must be set to "Anyone with link can view"</li>
              <li>• YouTube videos will be embedded with controls</li>
              <li>• Generic URLs will be displayed in an iframe if supported</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}