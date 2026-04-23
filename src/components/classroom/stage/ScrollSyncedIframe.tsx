import React, { useState } from 'react';
import { Globe, ExternalLink } from 'lucide-react';
import { useWebScrollSync } from '@/hooks/useWebScrollSync';

interface ScrollSyncedIframeProps {
  url: string | null;
  roomId: string;
  userId: string;
  role: 'teacher' | 'student';
}

const getEmbedUrl = (inputUrl: string): string => {
  try {
    const parsed = new URL(inputUrl);
    if (parsed.hostname.includes('youtube.com') && parsed.searchParams.has('v')) {
      return `https://www.youtube.com/embed/${parsed.searchParams.get('v')}?autoplay=0&rel=0`;
    }
    if (parsed.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}?autoplay=0&rel=0`;
    }
    if (parsed.hostname.includes('docs.google.com') && !inputUrl.includes('/embed')) {
      return inputUrl.replace('/edit', '/preview').replace('/view', '/preview');
    }
    return inputUrl;
  } catch {
    return inputUrl;
  }
};

/**
 * Co-browsing iframe wrapper. The iframe has scrolling="no" + a tall fixed
 * height so the WRAPPER scrolls — that scroll position is what gets synced
 * (cross-origin iframes can't be scrolled programmatically from the parent).
 *
 * The student's iframe receives pointer-events: none so the teacher fully
 * controls the view; the teacher's iframe stays interactive.
 */
export const ScrollSyncedIframe: React.FC<ScrollSyncedIframeProps> = ({
  url,
  roomId,
  userId,
  role,
}) => {
  const [loadError, setLoadError] = useState(false);
  const { wrapperRef, onScroll } = useWebScrollSync({
    roomId,
    userId,
    role,
    enabled: !!url,
  });

  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Globe className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No web content shared yet.</p>
          {role === 'teacher' && (
            <p className="text-xs mt-1 opacity-70">Paste a URL in the control dock to start co-browsing.</p>
          )}
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <div className="text-center max-w-sm px-6">
          <Globe className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-foreground mb-1">This site blocks embedding.</p>
          <p className="text-xs text-muted-foreground mb-4">
            Some sites (e.g. YouTube channel pages, banks) cannot be loaded inside the classroom.
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open in new tab
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      onScroll={onScroll}
      className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-white"
    >
      <iframe
        src={getEmbedUrl(url)}
        scrolling="no"
        onError={() => setLoadError(true)}
        style={{
          width: '100%',
          height: '3000px',
          border: 0,
          display: 'block',
          // Student view: lock interaction so teacher controls scroll/clicks.
          // Teacher view: stays interactive for navigation.
          pointerEvents: role === 'student' ? 'none' : 'auto',
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
      />
    </div>
  );
};
