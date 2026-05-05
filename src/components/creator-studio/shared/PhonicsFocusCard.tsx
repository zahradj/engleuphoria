import { useEffect, useRef } from 'react';
import { Volume2 } from 'lucide-react';
import { HUB_THEME, type Hub } from './hubTheme';

/**
 * PhonicsFocusCard — dedicated slide for the Phonics & Phonology layer.
 *
 *  Playground (Synthetic Phonics) → giant grapheme + isolated sound + 3 example words.
 *  Academy / Success (Pronunciation & Intonation) → same shell, reframed for accuracy
 *  ("Executive Pronunciation" copy comes from the AI's `phoneme`/`label` fields).
 *
 * Owns its OWN audio (no `UniversalMediaShell` wrapper) — same no-duplicate
 * pattern as VisualFlashcard.
 */

interface PhonicsSlide {
  type?: 'phonics_focus';
  phoneme?: string;        // e.g. "/æ/"
  grapheme?: string;       // e.g. "a" or "Magic e"
  sound_ipa?: string;      // optional explicit IPA
  label?: string;          // optional headline for Academy/Success ("Word Stress")
  example_words?: string[];
  audio_url?: string;      // isolated sound
  example_audio?: Record<string, string>; // optional per-word audio
  voice?: { text?: string; audio_url?: string; autoPlay?: boolean };
}

interface Props {
  slide: PhonicsSlide;
  hub?: Hub;
  autoPlay?: boolean;
}

const HUB_INTRO: Record<Hub, string> = {
  playground: 'Listen to the sound',
  academy: 'Listen and repeat',
  success: 'Executive Pronunciation',
};

export function PhonicsFocusCard({ slide, hub = 'playground', autoPlay = true }: Props) {
  const theme = HUB_THEME[hub];
  const grapheme = (slide.grapheme || slide.phoneme || '—').toString();
  const ipa = (slide.sound_ipa || slide.phoneme || '').toString();
  const examples = (slide.example_words || []).slice(0, 3);
  const isDark = hub === 'success';
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = (text: string, audioUrl?: string) => {
    if (audioUrl) {
      try {
        audioRef.current?.pause();
        const a = new Audio(audioUrl);
        audioRef.current = a;
        a.play().catch(() => {});
        return;
      } catch { /* noop */ }
    }
    if (!text) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.75;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch { /* noop */ }
  };

  const playSound = () => speak(slide.voice?.text || ipa || grapheme, slide.audio_url || slide.voice?.audio_url);
  const playWord = (w: string) => speak(w, slide.example_audio?.[w]);

  useEffect(() => {
    if (!autoPlay) return;
    const t = setTimeout(playSound, 350);
    return () => {
      clearTimeout(t);
      audioRef.current?.pause();
      audioRef.current = null;
      try { window.speechSynthesis.cancel(); } catch { /* noop */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide.audio_url, slide.phoneme, slide.grapheme, autoPlay]);

  return (
    <div
      className={`overflow-hidden border ${theme.ring} ${theme.corners} ${theme.shadow} ${isDark ? 'bg-slate-800 text-amber-50' : 'bg-white'} w-full max-w-5xl mx-auto p-8 md:p-12`}
    >
      <p className={`text-xs font-bold tracking-widest uppercase mb-4 ${theme.accentText}`}>
        🔊 {slide.label || HUB_INTRO[hub]}
      </p>

      <button
        type="button"
        onClick={playSound}
        className={`w-full flex flex-col items-center justify-center gap-3 rounded-2xl py-10 ${isDark ? 'bg-slate-900/60' : 'bg-muted/30'} active:scale-[0.99] transition`}
      >
        <span
          className={`${theme.canvasFont} ${theme.accentText} font-black leading-none tracking-tight`}
          style={{ fontFamily: 'Fredoka, Poppins, system-ui, sans-serif', fontSize: 'clamp(6rem, 18vw, 14rem)' }}
        >
          {grapheme}
        </span>
        {ipa && ipa !== grapheme && (
          <span className={`text-2xl md:text-3xl italic ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>{ipa}</span>
        )}
        <span className={`mt-2 inline-flex items-center gap-2 font-bold rounded-full px-6 py-3 shadow-lg ${theme.accentBtn}`}>
          <Volume2 className="w-5 h-5" /> Play sound
        </span>
      </button>

      {examples.length > 0 && (
        <div className="mt-6">
          <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
            Example words
          </p>
          <div className="grid grid-cols-3 gap-3">
            {examples.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => playWord(w)}
                className={`rounded-xl border-2 ${theme.ring} px-3 py-4 font-extrabold text-lg md:text-xl text-center hover:scale-[1.02] active:scale-95 transition ${isDark ? 'bg-slate-900/40 text-amber-50' : 'bg-white text-slate-800'}`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PhonicsFocusCard;
