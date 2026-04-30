import React from 'react';
import { Video } from 'lucide-react';

interface VideoSlideProps {
  slide: any;
}

function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  // Already a video ID (11 chars, alphanumeric + dash/underscore)
  if (/^[\w-]{11}$/.test(input.trim())) return input.trim();
  // Standard YouTube URLs
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/v\/)([\w-]{11})/,
  ];
  for (const pat of patterns) {
    const match = input.match(pat);
    if (match) return match[1];
  }
  return null;
}

export default function VideoSlide({ slide }: VideoSlideProps) {
  const payload = slide?.interactive_data || slide?.content || {};
  const videoUrl = slide?.video_url || payload.video_url || payload.youtube_url || '';
  const videoId = slide?.video_id || payload.video_id || extractYouTubeId(videoUrl) || '';
  const takeaways: string[] = Array.isArray(payload.key_takeaways) ? payload.key_takeaways : [];
  const instructions = payload.video_instructions || slide?.description || '';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col gap-8">
      {/* Title */}
      <div className="flex items-start gap-3">
        <Video className="w-8 h-8 text-red-500 mt-1 flex-shrink-0" />
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
          {slide.title || 'Video'}
        </h2>
      </div>

      {/* YouTube Embed */}
      {videoId ? (
        <div className="w-full max-w-3xl mx-auto aspect-video rounded-2xl shadow-md overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title={slide.title || 'Video'}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : videoUrl ? (
        <div className="w-full max-w-3xl mx-auto aspect-video rounded-2xl shadow-md overflow-hidden bg-muted flex items-center justify-center">
          <p className="text-muted-foreground text-sm">🎬 Video: {videoUrl}</p>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto aspect-video rounded-2xl shadow-md overflow-hidden bg-slate-100 flex items-center justify-center">
          <p className="text-slate-400 text-sm">No video URL provided</p>
        </div>
      )}

      {/* Instructions */}
      {instructions && (
        <p className="text-lg text-slate-600 leading-relaxed">{instructions}</p>
      )}

      {/* Key Takeaways */}
      {takeaways.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Key Takeaways</h3>
          <ul className="space-y-2">
            {takeaways.map((t, i) => (
              <li key={i} className="text-base text-slate-700 flex items-start gap-2">
                <span className="mt-1 text-emerald-500 font-bold">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export { extractYouTubeId };
