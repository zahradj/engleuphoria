import React from 'react';
import { Video, MessageCircle } from 'lucide-react';
import { useSlideHub } from '../SlideHubContext';

interface VideoSlideProps {
  slide: any;
}

function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  if (/^[\w-]{11}$/.test(input.trim())) return input.trim();
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
  const { accent, accentSoft } = useSlideHub();
  const payload = slide?.interactive_data || slide?.content || {};
  const videoUrl = slide?.video_url || payload.video_url || payload.youtube_url || '';
  const videoId = slide?.video_id || payload.video_id || extractYouTubeId(videoUrl) || '';
  const isMp4 = !videoId && /\.(mp4|webm|ogg)(\?|$)/i.test(videoUrl);
  const takeaways: string[] = Array.isArray(payload.key_takeaways) ? payload.key_takeaways : [];
  const instructions = payload.video_instructions || slide?.description || '';
  const fallbackImg = slide?.imageUrl || slide?.image_url || slide?.custom_image_url;

  const renderPlayer = () => {
    if (videoId) {
      return (
        <div className="w-full max-w-3xl mx-auto aspect-video rounded-2xl shadow-md overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title={slide.title || 'Video'}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    if (isMp4) {
      return (
        <div className="w-full max-w-3xl mx-auto aspect-video rounded-2xl shadow-md overflow-hidden bg-black">
          <video src={videoUrl} controls className="w-full h-full" />
        </div>
      );
    }
    // Conversation Starter fallback
    return (
      <div
        className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-md border-2 flex flex-col md:flex-row"
        style={{ borderColor: accent }}
      >
        <div className="md:w-1/2 aspect-video md:aspect-auto bg-slate-100">
          {fallbackImg ? (
            <img src={fallbackImg} alt={slide.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl" style={{ background: accentSoft }}>
              💬
            </div>
          )}
        </div>
        <div className="md:w-1/2 p-6 flex flex-col gap-3 bg-white">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>
            <MessageCircle className="w-4 h-4" /> Conversation Starter
          </div>
          <h3 className="text-xl font-bold text-slate-900">Discuss: {slide.title || 'this topic'}</h3>
          <p className="text-sm text-slate-600">
            The video isn't available right now. Take a moment to discuss what you'd expect to learn from a video on
            this topic.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-start gap-3">
        <Video className="w-7 h-7 mt-1 flex-shrink-0" style={{ color: accent }} />
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
          {slide.title || 'Video'}
        </h2>
      </div>

      {renderPlayer()}

      {instructions && <p className="text-base text-slate-700 leading-relaxed">{instructions}</p>}

      {takeaways.length > 0 && (
        <div className="rounded-xl p-5 border" style={{ background: accentSoft, borderColor: `${accent}33` }}>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
            Key Takeaways
          </h3>
          <ul className="space-y-2">
            {takeaways.map((t, i) => (
              <li key={i} className="text-base text-slate-800 flex items-start gap-2">
                <span className="mt-1 font-bold" style={{ color: accent }}>✓</span>
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
