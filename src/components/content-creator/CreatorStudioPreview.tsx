import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { ReadabilityMeter } from './ReadabilityMeter';

interface CreatorStudioPreviewProps {
  title: string;
  content: string;
  track: string;
  level: string;
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-5 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

const TRACK_LABELS: Record<string, { label: string; emoji: string }> = {
  kids: { label: 'Playground', emoji: '🎮' },
  teens: { label: 'Academy', emoji: '🎓' },
  adults: { label: 'Professional', emoji: '💼' },
};

export const CreatorStudioPreview: React.FC<CreatorStudioPreviewProps> = ({
  title,
  content,
  track,
  level,
}) => {
  const html = useMemo(() => DOMPurify.sanitize(markdownToHtml(content)), [content]);
  const trackInfo = TRACK_LABELS[track] || TRACK_LABELS.kids;

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Glassmorphic preview card */}
      <div className="flex-1 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-lg p-6 overflow-auto">
        {/* Meta badges */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {trackInfo.emoji} {trackInfo.label}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-accent/60 text-accent-foreground font-medium">
            {level}
          </span>
        </div>

        {/* Title */}
        {title ? (
          <h1 className="text-2xl font-bold text-foreground mb-4">{title}</h1>
        ) : (
          <h1 className="text-2xl font-bold text-muted-foreground/40 mb-4 italic">Untitled Lesson</h1>
        )}

        {/* Content */}
        {content.trim() ? (
          <div
            className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p className="text-muted-foreground/40 italic">Start writing to see a live preview…</p>
        )}
      </div>

      {/* Readability meter */}
      <div className="rounded-xl border border-border bg-card p-4">
        <ReadabilityMeter text={content} />
      </div>
    </div>
  );
};
