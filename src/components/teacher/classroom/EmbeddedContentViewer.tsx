import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, Maximize2, Minimize2, RefreshCw } from 'lucide-react';

interface EmbeddedContentViewerProps {
  url: string;
  onClose: () => void;
}

export const EmbeddedContentViewer: React.FC<EmbeddedContentViewerProps> = ({
  url,
  onClose
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [key, setKey] = useState(0);

  // Transform URL for better embedding (e.g., YouTube)
  const getEmbedUrl = (inputUrl: string): string => {
    try {
      const parsed = new URL(inputUrl);
      
      // YouTube - convert to embed URL
      if (parsed.hostname.includes('youtube.com') && parsed.searchParams.has('v')) {
        const videoId = parsed.searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
      }
      
      // YouTube short URL
      if (parsed.hostname === 'youtu.be') {
        const videoId = parsed.pathname.slice(1);
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
      }

      // Google Docs - ensure embed view
      if (parsed.hostname.includes('docs.google.com')) {
        if (!inputUrl.includes('/embed')) {
          return inputUrl.replace('/edit', '/preview').replace('/view', '/preview');
        }
      }

      return inputUrl;
    } catch {
      return inputUrl;
    }
  };

  const embedUrl = getEmbedUrl(url);

  const handleRefresh = () => {
    setIsLoading(true);
    setError(false);
    setKey(prev => prev + 1);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`${
          isFullscreen 
            ? 'fixed inset-0 z-50' 
            : 'absolute inset-0 z-30'
        } bg-gray-950 rounded-xl overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-400 overflow-hidden">
            <ExternalLink className="w-4 h-4 shrink-0" />
            <span className="truncate max-w-[300px]">{url}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className="h-8 w-8 text-gray-400 hover:text-white"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8 w-8 text-gray-400 hover:text-white"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(url, '_blank')}
              className="h-8 w-8 text-gray-400 hover:text-white"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-gray-400 hover:text-red-400"
              title="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative bg-white">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">Loading content...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="flex flex-col items-center gap-3 text-center p-6">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Unable to load content</h3>
                <p className="text-gray-400 text-sm max-w-sm">
                  This website may not allow embedding. Try opening it in a new tab instead.
                </p>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    className="border-gray-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                  <Button onClick={() => window.open(url, '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in new tab
                  </Button>
                </div>
              </div>
            </div>
          )}

          <iframe
            key={key}
            src={embedUrl}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setError(true);
            }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
