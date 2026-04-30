import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Target, Mic, Square, Play, Pause, RotateCcw, CheckCircle2, Send, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface EditorialRealWorldTaskProps {
  slide: any;
  onCorrect?: () => void;
}

export default function EditorialRealWorldTask({ slide, onCorrect }: EditorialRealWorldTaskProps) {
  const payload = slide?.interactive_data || slide?.content || {};
  const missionBriefing = payload.mission_briefing || payload.scenario_text || slide?.description || '';
  const successCriteria: string[] = Array.isArray(payload.success_criteria) ? payload.success_criteria : (payload.success_criteria ? [payload.success_criteria] : []);
  const mode: 'speaking' | 'writing' = payload.mode || 'writing';
  const title = slide?.title || 'Real-World Mission';

  // Writing mode state
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Speaking mode state
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
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
    setPlaying(false);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onCorrect?.();
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause(); else audioRef.current.play();
    setPlaying(!playing);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (!missionBriefing) {
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
      {/* Header */}
      <div className="flex items-start gap-3">
        <Target className="w-8 h-8 text-rose-500 mt-1 flex-shrink-0" />
        <div>
          <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">🏆 Final Mission</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
            {title}
          </h2>
        </div>
      </div>

      {/* Mission Briefing Card */}
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-8 border border-rose-200">
        <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3">📋 Mission Briefing</h3>
        <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">{missionBriefing}</p>
      </div>

      {/* Success Criteria */}
      {successCriteria.length > 0 && (
        <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
          <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">✅ Success Criteria — You Must Include</h3>
          <ul className="space-y-1.5">
            {successCriteria.map((c, i) => (
              <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                <span className="mt-0.5 text-amber-400">•</span>{c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mode badge */}
      <div className="flex items-center gap-2">
        {mode === 'speaking' ? (
          <span className="inline-flex items-center gap-1.5 bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-xs font-bold border border-cyan-200">
            <Mic className="w-3 h-3" /> Speaking Mode
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-200">
            <PenLine className="w-3 h-3" /> Writing Mode
          </span>
        )}
      </div>

      {/* Waveform placeholder */}
      {mode === 'speaking' && (
        <div className="w-full h-12 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">
          Audio Intonation Waveform (Pending)
        </div>
      )}

      {/* Input area */}
      {submitted ? (
        <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-6 flex items-center justify-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          <p className="text-emerald-700 font-semibold">Mission submitted! Your teacher will review your response.</p>
        </div>
      ) : mode === 'writing' ? (
        <div className="space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your response here…"
            className="min-h-[150px] text-base border-2 border-slate-200 focus:border-indigo-400 rounded-xl p-4"
          />
          <Button
            onClick={handleSubmit}
            disabled={text.trim().length < 10}
            className="gap-2 px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            <Send className="w-4 h-4" /> Submit Response
          </Button>
        </div>
      ) : (
        <div className={`rounded-xl border-2 p-6 transition-all ${
          recording ? 'border-red-300 bg-red-50 animate-pulse' : 'border-dashed border-slate-300 bg-white'
        }`}>
          {!audioURL ? (
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
                  <p className="text-slate-500 text-sm font-medium">🎤 Record your spoken response</p>
                  <Button onClick={startRecording} className="gap-2 px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white">
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
                <Send className="w-4 h-4" /> Submit Response
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
