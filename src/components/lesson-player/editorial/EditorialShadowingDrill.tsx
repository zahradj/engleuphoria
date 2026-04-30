import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Volume2, Mic, Square, Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditorialShadowingDrillProps {
  slide: any;
  onCorrect?: () => void;
}

export default function EditorialShadowingDrill({ slide, onCorrect }: EditorialShadowingDrillProps) {
  const payload = slide?.interactive_data || slide?.content || {};
  const targetPhrase = payload.target_phrase || payload.text || '';
  const title = slide?.title || 'Shadowing Drill';

  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, [audioURL]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunks.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunks.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.current = mr;
      mr.start();
      setRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    } catch { console.error('Microphone access denied'); }
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorder.current?.stop();
    setRecording(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const handleReRecord = () => {
    if (audioURL) URL.revokeObjectURL(audioURL);
    setAudioURL(null);
    setSubmitted(false);
    setPlaying(false);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onCorrect?.();
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (!targetPhrase) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="font-serif text-3xl font-bold text-slate-800 mb-4">{slide.title}</h2>
        <p className="text-slate-600">{slide.description}</p>
        <p className="mt-8 text-sm text-amber-600 italic">Interactive data missing for this activity.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col gap-8">
      <div className="flex items-start gap-3">
        <Volume2 className="w-8 h-8 text-cyan-500 mt-1 flex-shrink-0" />
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
          {title}
        </h2>
      </div>

      {/* Target phrase display */}
      <div className="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-xl p-8 border border-cyan-200 text-center">
        <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">🗣️ Repeat this phrase</p>
        <p className="text-2xl md:text-3xl font-serif font-bold text-slate-800 leading-relaxed">
          "{targetPhrase}"
        </p>
      </div>

      {/* Waveform placeholder */}
      <div className="w-full h-12 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">
        Audio Intonation Waveform (Pending)
      </div>

      {/* Voice Recorder */}
      <div className={`rounded-xl border-2 p-6 transition-all ${
        submitted ? 'border-emerald-300 bg-emerald-50'
          : recording ? 'border-red-300 bg-red-50 animate-pulse'
          : 'border-dashed border-slate-300 bg-white'
      }`}>
        {submitted ? (
          <div className="flex items-center justify-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <p className="text-emerald-700 font-semibold">Shadowing submitted! Your teacher will grade your pronunciation.</p>
          </div>
        ) : !audioURL ? (
          <div className="flex flex-col items-center gap-4">
            {recording ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-600 font-mono font-semibold text-lg">{formatTime(elapsed)}</span>
                </div>
                <Button onClick={stopRecording} variant="destructive" className="gap-2 px-8 py-3">
                  <Square className="w-4 h-4" /> Stop Recording
                </Button>
              </>
            ) : (
              <>
                <p className="text-slate-500 text-sm font-medium">🎤 Shadow the phrase — say it exactly as written</p>
                <Button onClick={startRecording} className="gap-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white">
                  <Mic className="w-4 h-4" /> Start Recording
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <audio ref={audioRef} src={audioURL} onEnded={() => setPlaying(false)} className="hidden" />
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={togglePlayback} className="gap-1.5">
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {playing ? 'Pause' : 'Play Back'}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleReRecord} className="gap-1.5 text-slate-500">
                <RotateCcw className="w-4 h-4" /> Re-record
              </Button>
            </div>
            <Button onClick={handleSubmit} className="gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white">
              <CheckCircle2 className="w-4 h-4" /> Submit Shadowing
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
