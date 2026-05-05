import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronUp, ChevronDown, Copy, Download, Upload, Eye, Code2, X, Sparkles, Loader2, Image as ImageIcon, Save, BookOpen, Send, FolderOpen, History, Wand2, FileUp, ArrowLeft } from 'lucide-react';
import { SlideRenderer, type Slide } from './PlaygroundDemo';
import { detectLessonHub, creatorPathFor, deriveCefrLevel } from '@/utils/creatorHydration';
import { generateOnePlaygroundImage } from '@/hooks/usePlaygroundImages';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SlideMediaPanel } from '@/components/creator-studio/shared/SlideMediaPanel';
import { PreviewModeToggle, type PreviewMode } from '@/components/creator-studio/shared/PreviewModeToggle';
import { PlayablePreviewPane } from '@/components/creator-studio/shared/PlayablePreviewPane';
import { UniversalMediaShell } from '@/components/creator-studio/shared/UniversalMediaShell';
import { SoloVocabCard } from '@/components/creator-studio/shared/SoloVocabCard';
import { VisualFlashcard } from '@/components/creator-studio/shared/VisualFlashcard';
import { PhonicsFocusCard } from '@/components/creator-studio/shared/PhonicsFocusCard';
import { WandFieldButton } from '@/components/creator-studio/shared/WandFieldButton';
import { AIToolsPanel } from '@/components/creator-studio/shared/AIToolsPanel';
import { slideIcon } from '@/components/creator-studio/shared/slideIcons';
import { InsertSlideButton } from '@/components/creator-studio/shared/InsertSlideButton';
import { PreviewRoleToggle, type PreviewRole } from '@/components/creator-studio/shared/PreviewRoleToggle';
import { TeacherNotesField } from '@/components/creator-studio/shared/TeacherNotesField';
import { AssetVaultDialog } from '@/components/creator-studio/shared/AssetVaultDialog';
import { SlideTemplatesDialog } from '@/components/creator-studio/shared/SlideTemplatesDialog';
import { SlideCommentsPanel } from '@/components/creator-studio/shared/SlideCommentsPanel';
import { BulkActionsMenu } from '@/components/creator-studio/shared/BulkActionsMenu';
import { BulkAudioDialog } from '@/components/creator-studio/shared/BulkAudioDialog';
import { findSlidesMissingAudio } from '@/components/creator-studio/shared/slideAudioHelpers';
import { DifficultyTunerDialog } from '@/components/creator-studio/shared/DifficultyTunerDialog';
import { ImportFromTextDialog, IMPORTED_LESSON_STORAGE_KEY } from '@/components/creator-studio/shared/ImportFromTextDialog';
import { PublishTemplateDialog } from '@/components/creator-studio/marketplace/PublishTemplateDialog';
import { useCreatorLesson } from '@/hooks/useCreatorLesson';
import { useAutoSave, useRevisionHistory, type LessonRevision } from '@/hooks/useAutoSaveAndHistory';
import { SaveStatusBadge } from '@/components/creator-studio/shared/SaveStatusBadge';
import { RevisionHistoryModal } from '@/components/creator-studio/shared/RevisionHistoryModal';
import { getLibraryLessonSlides } from '@/services/lessonLibraryService';
import { StorybookEditor } from '@/components/creator-studio/shared/StorybookEditor';
import { MediaAnalyzerModal } from '@/components/creator-studio/shared/MediaAnalyzerModal';
import { mapAIQuizSlides } from '@/components/creator-studio/shared/aiQuizMapper';
import { LessonBlueprintPanel, EMPTY_BLUEPRINT, type LessonBlueprint } from '@/components/creator-studio/shared/LessonBlueprintPanel';
import { CanvasElementEditor } from '@/components/creator-studio/shared/CanvasElementEditor';
import { ScaffoldedMediaEditor } from '@/components/creator-studio/shared/ScaffoldedMediaEditor';
import { Headphones } from 'lucide-react';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';

/**
 * Playground Slide Creator
 * ------------------------
 * Authoring tool for the Playground Engine. Lets you build a deck of
 * dynamic slides (multiple choice, true/false, fill, drag, match, draw,
 * intro) with live preview, JSON editing, import/export.
 *
 * Branding: Playground hub — Orange (#FE6A2F) + Yellow (#FEFBDD).
 */

type SlideType = Slide['type'];

const SLIDE_TYPES: { type: SlideType; label: string; emoji: string }[] = [
  { type: 'intro', label: 'Intro', emoji: '👋' },
  { type: 'multiple', label: 'Multiple Choice', emoji: '🔘' },
  { type: 'truefalse', label: 'True / False', emoji: '✓' },
  { type: 'fill', label: 'Fill the Blank', emoji: '✏️' },
  { type: 'drag', label: 'Drag & Drop', emoji: '🖱️' },
  { type: 'match', label: 'Matching', emoji: '🔗' },
  { type: 'draw', label: 'Drawing', emoji: '🎨' },
  { type: 'storybook', label: 'Storybook', emoji: '📖' },
  { type: 'media_player', label: 'Listening', emoji: '🎧' },
  { type: 'canvas_game', label: 'Canvas Game', emoji: '🎯' },
  { type: 'living_canvas', label: 'Click-to-Reveal', emoji: '✨' },
  { type: 'scaffolded_media', label: 'Scaffolded Media', emoji: '🎬' },
  { type: 'vocab_solo', label: 'Solo Vocab Card', emoji: '🃏' },
  { type: 'phonics_focus', label: 'Phonics Focus', emoji: '🔊' },
  { type: 'lesson_summary', label: 'Lesson Summary', emoji: '🏆' },
];

function makeSlide(type: SlideType): Slide {
  switch (type) {
    case 'intro':
      return { type: 'intro', title: '👋 Hello!', text: 'Welcome to the lesson', voice: { text: 'Hello!', autoPlay: true } };
    case 'multiple':
      return { type: 'multiple', question: 'What is this? 🐶', options: ['dog', 'cat', 'apple'], answer: 'dog', voice: { text: 'What is this?', autoPlay: true } };
    case 'truefalse':
      return { type: 'truefalse', statement: 'This is a cat 🐱', answer: true, voice: { text: 'True or false?', autoPlay: true } };
    case 'fill':
      return { type: 'fill', text: 'My name is ____', answer: 'Alex', voice: { text: 'Fill in the blank', autoPlay: true } };
    case 'drag':
      return { type: 'drag', instruction: 'Drag the word onto the picture', word: 'APPLE', image_url: '/playground/placeholder-dropzone.svg', voice: { text: 'Drag the word', autoPlay: true } };
    case 'match':
      return {
        type: 'match',
        instruction: 'Tap a word, then tap its picture',
        pairs: [{ word: 'DOG', image_url: '/playground/placeholder-dropzone.svg' }, { word: 'CAT', image_url: '/playground/placeholder-dropzone.svg' }],
        voice: { text: 'Match them!', autoPlay: true },
      };
    case 'draw':
      return { type: 'draw', prompt: 'Draw your favourite animal!', voice: { text: 'Draw something!', autoPlay: true } };
    case 'vocab_solo':
      return { type: 'vocab_solo', word: 'APPLE', definition: 'A round red or green fruit.', image_url: '', audio_url: '', voice: { text: 'apple', autoPlay: true } } as Slide;
    case 'phonics_focus':
      return { type: 'phonics_focus', phoneme: '/æ/', grapheme: 'a', sound_ipa: '/æ/', label: 'Listen to the sound', example_words: ['CAT', 'BAT', 'HAT'], audio_url: '', voice: { text: 'short a', autoPlay: true } } as unknown as Slide;
    case 'lesson_summary':
      return { type: 'lesson_summary', title: 'Level Complete!', vocab_recap: [], takeaway: 'You did amazing!', voice: { text: 'Great job! Level complete!', autoPlay: true } };
    case 'storybook':
      return { type: 'storybook', title: 'New Story', topic: '', pages: [{ page_number: 1, text: 'Once upon a time…', image_url: '', audio_url: '' }], voice: { text: 'Story time!', autoPlay: false } };
    case 'media_player':
      return { type: 'media_player', title: 'Listening Exercise', media_url: '', media_kind: 'youtube', transcript: '' };
    case 'canvas_game':
      return {
        type: 'canvas_game',
        title: 'Sort the Fruit',
        instruction: 'Drag the fruit into the basket!',
        instruction_audio: 'Drag the fruit into the basket!',
        elements: [
          { id: 'basket', type: 'shape', x: 70, y: 35, width: 18, z_index: 1, interaction: 'target', color: '#a7f3d0', text: 'BASKET' } as any,
          { id: 'apple', type: 'text', text: '🍎', x: 15, y: 80, width: 12, z_index: 3, interaction: 'draggable', target_x: 70, target_y: 35, snap_tolerance: 12, success_sfx: 'Yum!' } as any,
          { id: 'banana', type: 'text', text: '🍌', x: 35, y: 80, width: 12, z_index: 3, interaction: 'draggable', target_x: 70, target_y: 35, snap_tolerance: 12, success_sfx: 'Tasty!' } as any,
        ],
        voice: { text: 'Drag the fruit into the basket!', autoPlay: true },
      } as Slide;
    case 'living_canvas':
      return {
        type: 'living_canvas',
        title: 'Find the Sun',
        instruction: 'Tap the cloud to find the sun!',
        instruction_audio: 'Tap the cloud to find the sun!',
        elements: [
          { id: 'sun', type: 'text', text: '🌞', x: 50, y: 40, width: 18, z_index: 1, interaction: 'none', color: 'transparent' } as any,
          { id: 'cloud', type: 'text', text: '☁️', x: 50, y: 40, width: 22, z_index: 5, interaction: 'reveal', reveal_anim: 'fly', reveal_sfx: 'The sun is shining!' } as any,
        ],
        voice: { text: 'Tap the cloud!', autoPlay: true },
      } as Slide;
    case 'scaffolded_media':
      return {
        type: 'scaffolded_media',
        title: 'Listening Checkpoint',
        media_url: '',
        media_kind: 'youtube',
        segments: [
          { start_time: 0, end_time: 30, question: { prompt: 'What did the speaker say?', options: ['Option A', 'Option B', 'Option C'], answer: 'Option A' } },
        ],
        voice: { text: 'Listen carefully!', autoPlay: false },
      } as Slide;
  }
}

function slideTitle(slide: Slide): string {
  switch (slide.type) {
    case 'intro': return slide.title;
    case 'multiple': return slide.question;
    case 'truefalse': return slide.statement;
    case 'fill': return slide.text;
    case 'drag': return slide.instruction;
    case 'match': return slide.instruction;
    case 'draw': return slide.prompt;
    case 'storybook': return slide.title || 'Storybook';
    case 'media_player': return slide.title || 'Listening Exercise';
    case 'canvas_game': return slide.title || 'Canvas Game';
    case 'living_canvas': return slide.title || 'Click-to-Reveal';
    case 'scaffolded_media': return slide.title || 'Scaffolded Media';
    case 'lesson_summary': return slide.title || 'Lesson Summary';
  }
}

const STARTER: Slide[] = [
  { type: 'intro', title: '👋 Hello, friend!', text: "Let's play and learn!", voice: { text: "Let's play!", autoPlay: true } },
];

export default function PlaygroundCreator() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLessonId = searchParams.get('lessonId');

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/content-creator');
  };

  const [slides, setSlides] = useState<Slide[]>(STARTER);
  const [title, setTitle] = useState<string>('Untitled Playground Lesson');
  const [selected, setSelected] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('editor');
  const [previewRole, setPreviewRole] = useState<PreviewRole>('teacher');
  const [vaultOpen, setVaultOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [bulkAudioOpen, setBulkAudioOpen] = useState(false);
  const [tunerOpen, setTunerOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [publishTemplateOpen, setPublishTemplateOpen] = useState(false);
  const [jsonOpen, setJsonOpen] = useState(false);
  const [jsonDraft, setJsonDraft] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('Animals');
  const [aiLevel, setAiLevel] = useState('A1');
  const [aiBusy, setAiBusy] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [blueprint, setBlueprint] = useState<LessonBlueprint | null>(null);

  // Insert quiz slides directly after the current slide (before any trailing lesson_summary).
  const insertAfterCurrent = (extra: Slide[]) => {
    setSlides((prev) => {
      const at = Math.min(selected + 1, prev.length);
      const next = [...prev.slice(0, at), ...extra, ...prev.slice(at)];
      return next;
    });
  };

  const lessonHook = useCreatorLesson({ hub: 'playground', initialLessonId });

  // Hydrate from DB when an existing lesson is loaded.
  useEffect(() => {
    const lesson = lessonHook.lesson;
    if (!lesson) return;
    // Hub-mismatch redirect: if this lesson was authored for a different hub,
    // bounce to its native creator so Pre-A1 / visual logic stays correct.
    const detected = detectLessonHub(lesson);
    if (detected && detected !== 'playground') {
      navigate(`${creatorPathFor(detected)}?lessonId=${lesson.id}`, { replace: true });
      return;
    }
    const dbSlides = getLibraryLessonSlides(lesson) as Slide[];
    setSlides(dbSlides);
    setSelected(0);
    if (lesson.title) {
      setTitle(lesson.title);
      setAiTopic(lesson.title);
    }
    setAiLevel(deriveCefrLevel(lesson, 'playground'));
    const meta: any = (lesson as any).ai_metadata;
    if (meta?.lesson_blueprint) setBlueprint(meta.lesson_blueprint as LessonBlueprint);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonHook.lesson?.id]);

  // Keep ?lessonId= in sync when we create a new draft.
  useEffect(() => {
    if (lessonHook.lessonId && searchParams.get('lessonId') !== lessonHook.lessonId) {
      const next = new URLSearchParams(searchParams);
      next.set('lessonId', lessonHook.lessonId);
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonHook.lessonId]);

  // Inject AI-imported lesson (from ImportFromTextDialog on the dashboard)
  useEffect(() => {
    if (searchParams.get('imported') !== '1') return;
    try {
      const raw = sessionStorage.getItem(IMPORTED_LESSON_STORAGE_KEY);
      if (!raw) return;
      const payload = JSON.parse(raw);
      if (payload.hub && payload.hub !== 'playground') return;
      if (Array.isArray(payload.slides) && payload.slides.length > 0) {
        setSlides(payload.slides);
        setSelected(0);
        if (payload.title) setTitle(payload.title);
        toast.success(`Loaded ${payload.slides.length} imported slides`);
      }
      sessionStorage.removeItem(IMPORTED_LESSON_STORAGE_KEY);
      const next = new URLSearchParams(searchParams);
      next.delete('imported');
      setSearchParams(next, { replace: true });
    } catch (e) {
      console.error('Failed to inject imported lesson', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const safeIndex = slides.length === 0 ? 0 : Math.min(Math.max(selected, 0), slides.length - 1);
  const current = slides[safeIndex] ?? { type: 'intro', title: '', content: '' } as any;
  const slideId = `slide-${safeIndex}`;

  const generateWithAI = async () => {
    if (!aiTopic.trim()) return;
    setAiBusy(true);
    try {
      // Step 1 — Plan the blueprint (5 vocab + 1 grammar)
      toast.message('Planning lesson blueprint…');
      const interests = blueprint?.interests?.trim();
      const specific_needs = blueprint?.specific_needs?.trim();
      const planRes = await supabase.functions.invoke('plan-lesson-blueprint', {
        body: { topic: aiTopic.trim(), cefr_level: aiLevel, hub: 'playground', interests, specific_needs },
      });
      if (planRes.error) throw planRes.error;
      const bp = { ...(planRes.data as LessonBlueprint), interests, specific_needs };
      setBlueprint(bp);

      // Step 2 — Generate slides forced to use that blueprint
      const { data, error } = await supabase.functions.invoke('generate-ppp-slides', {
        body: {
          lesson_title: aiTopic.trim(),
          objective: `Fun interactive Playground lesson about ${aiTopic.trim()}. Target vocabulary: ${bp.vocabulary.join(', ')}. Target grammar: ${bp.grammar}.`,
          skill_focus: 'Vocabulary',
          cefr_level: aiLevel,
          hub: 'playground',
          target_hub: 'playground',
          hub_type: 'playground',
          target_vocabulary: bp.vocabulary,
          grammar_focus: bp.grammar,
          interests,
          specific_needs,
          blueprint: { lesson_title: aiTopic.trim(), target_vocabulary: bp.vocabulary, grammar_focus: bp.grammar, target_hub: 'playground', interests, specific_needs },
        },
      });
      if (error) throw error;
      const playgroundSlides: Slide[] | undefined = data?.playground_slides;
      if (!playgroundSlides || !Array.isArray(playgroundSlides) || playgroundSlides.length === 0) {
        throw new Error('AI returned no Playground slides');
      }
      const finalSlides = playgroundSlides.some((s: any) => s.type === 'lesson_summary')
        ? playgroundSlides
        : [...playgroundSlides, makeSlide('lesson_summary')];
      setSlides(finalSlides);
      setSelected(0);
      setAiOpen(false);
      toast.success(`Generated ${playgroundSlides.length} slides ✨`);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'AI generation failed');
    } finally {
      setAiBusy(false);
    }
  };

  const update = (patch: Partial<Slide>) => {
    setSlides((prev) => prev.map((s, i) => (i === selected ? ({ ...s, ...patch } as Slide) : s)));
  };

  const addSlide = (type: SlideType) => {
    setSlides((prev) => {
      const next = [...prev, makeSlide(type)];
      setSelected(next.length - 1);
      return next;
    });
  };

  const deleteSlide = (i: number) => {
    if (slides.length === 1) return;
    setSlides((prev) => prev.filter((_, idx) => idx !== i));
    setSelected((s) => Math.max(0, Math.min(s, slides.length - 2)));
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= slides.length) return;
    setSlides((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setSelected(j);
  };

  const duplicate = (i: number) => {
    setSlides((prev) => {
      const next = [...prev];
      next.splice(i + 1, 0, JSON.parse(JSON.stringify(prev[i])));
      return next;
    });
    setSelected(i + 1);
  };

  const onDragStart = (i: number) => setDragIdx(i);
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDrop = (i: number) => {
    if (dragIdx === null || dragIdx === i) { setDragIdx(null); return; }
    setSlides((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(i, 0, moved);
      return next;
    });
    setSelected(i);
    setDragIdx(null);
  };

  const history = useRevisionHistory(lessonHook.lessonId);
  const [historyOpen, setHistoryOpen] = useState(false);

  const autoSave = useAutoSave({
    lessonId: lessonHook.lessonId,
    slides,
    title,
    silentSaveDraft: (s, m) => lessonHook.silentSaveDraft(s, { ...m, level: aiLevel, blueprint }),
  });

  const handleSaveDraft = async () => {
    const id = await lessonHook.saveDraft(slides, { title, level: aiLevel, blueprint });
    if (id) history.captureRevision({ title, slides, kind: 'manual' });
  };
  const handlePublish = async () => {
    const id = await lessonHook.publish(slides, { title, level: aiLevel, blueprint });
    if (id) history.captureRevision({ title, slides, kind: 'publish' });
  };
  const handleRestore = (rev: LessonRevision) => {
    const restored = Array.isArray(rev.content?.slides) ? rev.content.slides : [];
    if (restored.length === 0) { toast.error('Snapshot has no slides'); return; }
    setSlides(restored);
    setSelected(0);
    if (rev.title) setTitle(rev.title);
    setHistoryOpen(false);
    toast.success('Restored snapshot — remember to Save or Publish');
  };
  const handleImportFromLibrary = async (id: string) => {
    const lesson = await lessonHook.importLesson(id);
    if (!lesson) return;
    const dbSlides = getLibraryLessonSlides(lesson) as Slide[];
    if (dbSlides.length === 0) { toast.error('That lesson has no slides yet'); return; }
    setSlides(dbSlides);
    setTitle(lesson.title || 'Imported lesson');
    setSelected(0);
    toast.success(`Loaded "${lesson.title}"`);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(slides, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'playground-lesson.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Expected non-empty array');
        setSlides(parsed);
        setSelected(0);
      } catch (e: any) {
        alert('Invalid JSON: ' + e.message);
      }
    };
    reader.readAsText(file);
  };

  const openJsonEditor = () => {
    setJsonDraft(JSON.stringify(slides, null, 2));
    setJsonError(null);
    setJsonOpen(true);
  };

  const applyJson = () => {
    try {
      const parsed = JSON.parse(jsonDraft);
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Expected non-empty array of slides');
      setSlides(parsed);
      setSelected(0);
      setJsonOpen(false);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b-4 border-orange-400 shadow-sm">
        <div className="w-full flex items-center justify-between px-4 py-3 gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={goBack}
              title="Back"
              className="flex items-center gap-1 bg-white border-2 border-orange-300 hover:bg-orange-50 text-orange-700 font-bold rounded-xl px-3 py-2 text-xs transition active:scale-95 flex-shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0">
              🎨
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-orange-600 tracking-wider uppercase">Playground · Slide Creator</div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Lesson title…"
                className="text-lg font-bold text-slate-900 bg-transparent outline-none border-b border-transparent focus:border-orange-400 w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => setAiOpen(true)} className="inline-flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-orange-500 hover:opacity-90 text-white font-bold rounded-xl px-3 py-2 text-xs shadow-md transition active:scale-95">
              <Sparkles className="w-3.5 h-3.5" /> AI
            </button>
            <Popover>
              <PopoverTrigger asChild>
                <button className="inline-flex items-center gap-2 bg-white border-2 border-orange-300 hover:bg-orange-50 text-orange-700 font-bold rounded-xl px-3 py-2 text-xs transition active:scale-95">
                  <FolderOpen className="w-3.5 h-3.5" /> Library
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-2 max-h-96 overflow-y-auto">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide px-2 py-1">Import from Library</div>
                {lessonHook.isLoadingLibrary ? (
                  <div className="p-3 text-xs text-slate-500"><Loader2 className="w-3 h-3 animate-spin inline mr-1" /> Loading…</div>
                ) : lessonHook.library.length === 0 ? (
                  <div className="p-3 text-xs text-slate-500">No saved Playground lessons yet.</div>
                ) : (
                  lessonHook.library.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => handleImportFromLibrary(l.id)}
                      className="w-full text-left rounded-lg px-2 py-1.5 hover:bg-orange-50 text-sm"
                    >
                      <div className="font-semibold text-slate-800 truncate">{l.title}</div>
                      <div className="text-[10px] text-slate-500">{l.is_published ? 'Published' : 'Draft'} · {(l.content as any)?.slides?.length ?? 0} slides</div>
                    </button>
                  ))
                )}
              </PopoverContent>
            </Popover>
            <button
              onClick={() => setVaultOpen(true)}
              className="inline-flex items-center gap-2 bg-white border-2 border-orange-300 hover:bg-orange-50 text-orange-700 font-bold rounded-xl px-3 py-2 text-xs transition active:scale-95"
              title="Open Asset Vault"
            >
              <ImageIcon className="w-3.5 h-3.5" /> Vault
            </button>
            <button
              onClick={() => setTemplatesOpen(true)}
              className="inline-flex items-center gap-2 bg-white border-2 border-orange-300 hover:bg-orange-50 text-orange-700 font-bold rounded-xl px-3 py-2 text-xs transition active:scale-95"
              title="Insert pre-built slide templates"
            >
              <Sparkles className="w-3.5 h-3.5" /> Templates
            </button>
            <label className="cursor-pointer inline-flex items-center gap-2 bg-white border-2 border-orange-300 hover:bg-orange-50 text-orange-700 font-bold rounded-xl px-3 py-2 text-xs transition active:scale-95">
              <Upload className="w-3.5 h-3.5" /> JSON
              <input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
            </label>
            <button onClick={exportJson} className="inline-flex items-center gap-2 bg-white border-2 border-orange-300 hover:bg-orange-50 text-orange-700 font-bold rounded-xl px-3 py-2 text-xs transition active:scale-95">
              <Download className="w-3.5 h-3.5" />
            </button>
            <button onClick={openJsonEditor} className="inline-flex items-center gap-2 bg-white border-2 border-orange-300 hover:bg-orange-50 text-orange-700 font-bold rounded-xl px-3 py-2 text-xs transition active:scale-95">
              <Code2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setPreviewOpen(true)} className="inline-flex items-center gap-2 bg-white border-2 border-orange-400 hover:bg-orange-50 text-orange-700 font-bold rounded-xl px-3 py-2 text-xs transition active:scale-95">
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            <SaveStatusBadge status={autoSave.status} lastSavedAt={autoSave.lastSavedAt} />
            <button
              onClick={() => setHistoryOpen(true)}
              disabled={!lessonHook.lessonId}
              title={lessonHook.lessonId ? 'Revision history' : 'Save the lesson once to enable history'}
              className="inline-flex items-center gap-1.5 bg-white border-2 border-orange-300 text-orange-700 font-bold rounded-xl px-2.5 py-2 text-xs transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <History className="w-3.5 h-3.5" />
            </button>
            <BulkActionsMenu
              hub="playground"
              missingAudioCount={findSlidesMissingAudio(slides).length}
              onGenerateMissingAudio={() => setBulkAudioOpen(true)}
              onPublishTemplate={() => setPublishTemplateOpen(true)}
              canPublishTemplate={slides.length >= 8}
            />
            <button
              onClick={() => setImportOpen(true)}
              title="Convert raw text into a full lesson"
              className="inline-flex items-center gap-2 bg-white border-2 border-orange-400 text-orange-700 font-bold rounded-xl px-3 py-2 text-xs transition active:scale-95"
            >
              <FileUp className="w-3.5 h-3.5" /> Import
            </button>
            <button onClick={handleSaveDraft} disabled={lessonHook.isSaving} className="inline-flex items-center gap-2 bg-white border-2 border-orange-400 text-orange-700 font-bold rounded-xl px-3 py-2 text-xs transition active:scale-95 disabled:opacity-50">
              {lessonHook.isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Draft
            </button>
            <button onClick={handlePublish} disabled={lessonHook.isSaving} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl px-4 py-2 text-xs shadow-md transition active:scale-95 disabled:opacity-50">
              {lessonHook.isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Publish
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-[240px_1fr_380px] gap-4 p-4 min-h-0">
        {/* Slide list */}
        <aside className="min-h-0 flex flex-col order-1">
          <LessonBlueprintPanel
            hub="playground"
            blueprint={blueprint}
            onChange={setBlueprint}
            slides={slides}
            onSyncedSlides={(s) => { setSlides(s as Slide[]); setSelected(0); }}
            cefrLevel={'A1'}
          />
          <div className="bg-white rounded-2xl shadow-md border-2 border-orange-200 p-3 flex flex-col flex-1 min-h-0">
            <h2 className="text-sm font-bold text-orange-600 px-2 py-1">SLIDES</h2>
            <div className="space-y-1 flex-1 overflow-y-auto pr-1 min-h-0">
              {slides.map((s, i) => {
                const Icon = slideIcon((s as any).type);
                return (
                  <div key={i}>
                    {i > 0 && (
                      <InsertSlideButton
                        hub="playground"
                        options={[
                          { type: 'storybook', label: 'Storybook', emoji: '📖' },
                          { type: 'scaffolded_media', label: 'Media Analyzer', emoji: '🎬' },
                          { type: 'canvas_game', label: 'Canvas Game', emoji: '🎮' },
                          { type: 'vocab_solo', label: 'Vocab Card', emoji: '✨' },
                          { type: 'phonics_focus', label: 'Phonics Focus', emoji: '🔊' },
                        ]}
                        onInsert={(t) => { setSlides((p) => { const n = [...p]; n.splice(i, 0, makeSlide(t as SlideType)); return n; }); setSelected(i); }}
                      />
                    )}
                    <div
                      draggable
                      onDragStart={() => onDragStart(i)}
                      onDragOver={onDragOver}
                      onDrop={() => onDrop(i)}
                      onClick={() => setSelected(i)}
                      className={`w-full text-left rounded-xl p-3 border-2 transition cursor-pointer ${
                        i === selected ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-slate-200 hover:border-orange-300 bg-white'
                      } ${dragIdx === i ? 'opacity-40' : ''}`}
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-bold text-orange-600 inline-flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5" />
                          {s.type === 'lesson_summary' ? `🔒 #${i + 1}` : `#${i + 1} · ${s.type}`}
                        </span>
                        {s.type !== 'lesson_summary' && (
                          <div className="flex gap-1 opacity-70">
                            <span onClick={(e) => { e.stopPropagation(); move(i, -1); }} className="hover:text-orange-600"><ChevronUp className="w-3.5 h-3.5" /></span>
                            <span onClick={(e) => { e.stopPropagation(); move(i, 1); }} className="hover:text-orange-600"><ChevronDown className="w-3.5 h-3.5" /></span>
                            <span onClick={(e) => { e.stopPropagation(); duplicate(i); }} className="hover:text-orange-600"><Copy className="w-3.5 h-3.5" /></span>
                            <span onClick={(e) => { e.stopPropagation(); deleteSlide(i); }} className="hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-slate-800 truncate">
                        {s.type === 'lesson_summary' ? 'Auto-Summary (system)' : slideTitle(s)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-orange-100">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2 px-1">Add Slide</p>
              <div className="grid grid-cols-2 gap-2">
                {SLIDE_TYPES.map((t) => (
                  <button
                    key={t.type}
                    onClick={() => addSlide(t.type)}
                    className="text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-2 flex flex-col items-center gap-1 transition active:scale-95"
                  >
                    <span className="text-lg">{t.emoji}</span>
                    {t.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setMediaModalOpen(true)}
                className="mt-2 w-full text-xs font-bold text-white bg-gradient-to-r from-fuchsia-500 to-orange-500 rounded-lg p-2 inline-flex items-center justify-center gap-2 active:scale-95"
              >
                <Headphones className="w-3.5 h-3.5" /> Add Listening Exercise
              </button>
            </div>
          </div>
        </aside>

        {/* Live preview (CENTER) */}
        <section className="min-h-0 flex flex-col order-2">
          <div className="bg-white rounded-2xl shadow-md border-2 border-orange-200 p-3 flex flex-col flex-1 min-h-0 overflow-y-auto">
            <div className="flex items-center justify-between mb-2 px-2 gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-orange-600">LIVE PREVIEW</h2>
              <div className="flex items-center gap-2">
                <PreviewRoleToggle value={previewRole} onChange={setPreviewRole} hub="playground" />
                <PreviewModeToggle value={previewMode} onChange={setPreviewMode} hub="playground" />
              </div>
            </div>
            <PlayablePreviewPane
              mode={previewMode}
              slides={slides}
              startIndex={selected}
              hub="playground"
              previewRole={previewRole}
              getTeacherNotes={(s) => (s as any).teacher_notes}
              renderSlide={(slide, idx) => {
                const s: any = slide;
                const isVocab = s.type === 'vocab_solo';
                const isPhonics = s.type === 'phonics_focus';
                const flashcards = Array.isArray(s.flashcards) ? s.flashcards : [];
                const legacySolo = !isVocab && !isPhonics && flashcards.length > 0;
                return (
                  <div className="rounded-xl bg-gradient-to-br from-orange-400 via-amber-300 to-yellow-200 p-4 min-h-[420px] flex items-center justify-center">
                    <div key={idx + (slide as Slide).type} className="bg-white rounded-2xl shadow-xl w-full p-4 min-h-[380px] flex items-center justify-center">
                      <div className="scale-[0.85] origin-center w-full">
                        {isVocab ? (
                          <VisualFlashcard slide={s} hub="playground" />
                        ) : isPhonics ? (
                          <PhonicsFocusCard slide={s} hub="playground" />
                        ) : (
                          <UniversalMediaShell slide={s} hub="playground" suppressImage={legacySolo}>
                            {legacySolo ? (
                              <SoloVocabCard card={flashcards[0]} hub="playground" />
                            ) : (
                              <SlideRenderer slide={slide as Slide} />
                            )}
                          </UniversalMediaShell>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            {slides[selected] && (
              <TeacherNotesField
                value={(slides[selected] as any).teacher_notes}
                onChange={(next) => update({ teacher_notes: next } as any)}
              />
            )}
          </div>
        </section>

        {/* Editor (RIGHT) */}
        <section className="min-h-0 flex flex-col order-3">
          <div className="bg-white rounded-2xl shadow-md border-2 border-orange-200 p-5 flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between mb-3 gap-2 flex-shrink-0">
              <h2 className="text-sm font-bold text-orange-600">EDIT SLIDE #{safeIndex + 1} · {(current?.type ?? 'intro').toString().toUpperCase()}</h2>
              <button
                onClick={() => setTunerOpen(true)}
                title="Rewrite this slide easier or harder"
                className="inline-flex items-center gap-1 text-xs font-bold border-2 border-orange-300 text-orange-700 rounded-lg px-2 py-1 hover:bg-orange-50"
              >
                <Wand2 className="w-3.5 h-3.5" /> Tune
              </button>
            </div>
            <Tabs defaultValue="basic" className="w-full flex-1 flex flex-col min-h-0">
              <TabsList className="grid grid-cols-3 w-full flex-shrink-0">
                <TabsTrigger value="basic">Content</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="ai">AI Tools</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="pt-4 flex-1 overflow-y-auto min-h-0">
                {current.type === 'storybook' ? (
                  <StorybookEditor
                    slide={current as any}
                    hub="playground"
                    cefrLevel="A1"
                    targetVocab={blueprint?.vocabulary || []}
                    grammarFocus={blueprint?.grammar || ''}
                    onPatch={(patch) => update(patch as Partial<Slide>)}
                    onAppendQuiz={(quiz) => insertAfterCurrent(mapAIQuizSlides(quiz, 'playground') as Slide[])}
                  />
                ) : current.type === 'canvas_game' || current.type === 'living_canvas' ? (
                  <CanvasElementEditor
                    slide={current as any}
                    hub="playground"
                    onChange={(next) => update(next as Partial<Slide>)}
                  />
                ) : current.type === 'scaffolded_media' ? (
                  <ScaffoldedMediaEditor
                    slide={current as any}
                    onChange={(next) => update(next as Partial<Slide>)}
                  />
                ) : (
                  <SlideEditor slide={current} onChange={update} blueprint={blueprint} hub="playground" />
                )}
              </TabsContent>
              <TabsContent value="media" className="pt-4 flex-1 overflow-y-auto min-h-0">
                <SlideMediaPanel
                  slide={current as any}
                  onPatch={(patch) => update(patch as Partial<Slide>)}
                  hub="playground"
                  lessonId={lessonHook.lessonId}
                  slideId={slideId}
                  enableFlashcards={current.type === 'match' || current.type === 'multiple'}
                />
              </TabsContent>
              <TabsContent value="ai" className="pt-4 flex-1 overflow-y-auto min-h-0">
                <AIToolsPanel
                  hub="playground"
                  lessonId={lessonHook.lessonId}
                  slideId={slideId}
                  onTuneDifficulty={() => setTunerOpen(true)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>

      {/* Fullscreen preview */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center p-4"
          >
            <button onClick={() => setPreviewOpen(false)} className="absolute top-4 right-4 bg-white text-orange-600 rounded-full p-2 shadow-lg hover:bg-orange-50">
              <X className="w-5 h-5" />
            </button>
            <FullPreview slides={slides} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* JSON editor modal */}
      <AnimatePresence>
        {jsonOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-orange-200">
                <h3 className="font-bold text-orange-600">Edit Lesson JSON</h3>
                <button onClick={() => setJsonOpen(false)}><X className="w-5 h-5 text-slate-500" /></button>
              </div>
              <textarea
                value={jsonDraft}
                onChange={(e) => setJsonDraft(e.target.value)}
                className="flex-1 font-mono text-xs p-4 outline-none resize-none"
                spellCheck={false}
              />
              {jsonError && <div className="px-4 py-2 text-sm text-red-600 bg-red-50 border-t border-red-200">{jsonError}</div>}
              <div className="p-4 border-t border-orange-200 flex justify-end gap-2">
                <button onClick={() => setJsonOpen(false)} className="px-4 py-2 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={applyJson} className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md">Apply</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI generation modal */}
      <AnimatePresence>
        {aiOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border-4 border-orange-300 overflow-hidden">
              <div className="bg-gradient-to-r from-fuchsia-500 to-orange-500 p-5 text-white">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  <h3 className="text-xl font-extrabold">Generate Playground Lesson</h3>
                </div>
                <p className="text-sm opacity-90 mt-1">AI will craft a kid-friendly interactive deck.</p>
              </div>
              <div className="p-5 space-y-4">
                <Field label="Topic">
                  <input
                    autoFocus
                    className={inputCls}
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="e.g. Animals, Colors, Greetings"
                    disabled={aiBusy}
                  />
                </Field>
                <Field label="CEFR Level">
                  <select className={inputCls} value={aiLevel} onChange={(e) => setAiLevel(e.target.value)} disabled={aiBusy}>
                    {['Pre-A1','A1','A2','B1','B2'].map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>
                <p className="text-xs text-slate-500">The AI will pick 5 vocabulary words and 1 grammar structure for you — you can edit them in the Lesson Blueprint panel.</p>
              </div>
              <div className="p-4 bg-orange-50 border-t border-orange-200 flex justify-end gap-2">
                <button disabled={aiBusy} onClick={() => setAiOpen(false)} className="px-4 py-2 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-white disabled:opacity-50">Cancel</button>
                <button disabled={aiBusy || !aiTopic.trim()} onClick={generateWithAI} className="px-5 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-orange-500 text-white font-bold shadow-md disabled:opacity-50 inline-flex items-center gap-2">
                  {aiBusy ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : <><Sparkles className="w-4 h-4" /> Generate</>}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <RevisionHistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        revisions={history.revisions}
        loading={history.loading}
        onRestore={handleRestore}
      />

      <AssetVaultDialog
        open={vaultOpen}
        onOpenChange={setVaultOpen}
        hub="playground"
        onPick={({ url, field }) => update({ [field]: url } as any)}
      />

      <SlideTemplatesDialog
        open={templatesOpen}
        onOpenChange={setTemplatesOpen}
        hub="playground"
        makeSlide={(t) => makeSlide(t as SlideType)}
        onInsert={(newSlides, tpl) => {
          setSlides((prev) => {
            const next = [...prev, ...newSlides];
            setSelected(next.length - newSlides.length);
            return next;
          });
          toast.success(`Added "${tpl.label}" (${newSlides.length} slides)`);
        }}
      />

      <BulkAudioDialog
        open={bulkAudioOpen}
        onOpenChange={setBulkAudioOpen}
        slides={slides}
        lessonId={lessonHook.lessonId}
        patchSlide={(idx, patch) =>
          setSlides((prev) => prev.map((s, i) => (i === idx ? ({ ...s, ...patch } as Slide) : s)))
        }
      />

      <DifficultyTunerDialog
        open={tunerOpen}
        onOpenChange={setTunerOpen}
        slide={current}
        onPatch={(patch) =>
          setSlides((prev) => prev.map((s, i) => (i === selected ? ({ ...s, ...patch } as Slide) : s)))
        }
        hub="playground"
      />

      <ImportFromTextDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        defaultHub="playground"
      />

      <MediaAnalyzerModal
        open={mediaModalOpen}
        onOpenChange={setMediaModalOpen}
        hub="playground"
        cefrLevel="A1"
        onCreate={(mediaSlide, quiz) => {
          const mapped = mapAIQuizSlides(quiz, 'playground') as Slide[];
          setSlides((prev) => {
            const at = Math.min(selected + 1, prev.length);
            const next = [...prev.slice(0, at), mediaSlide as unknown as Slide, ...mapped, ...prev.slice(at)];
            setSelected(at);
            return next;
          });
        }}
      />

      <PublishTemplateDialog
        open={publishTemplateOpen}
        onOpenChange={setPublishTemplateOpen}
        hub="playground"
        title={title}
        slides={slides}
      />
    </div>
  );
}

// ─── Slide editor (per type) ─────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">{label}</span>
      {children}
    </label>
  );
}

const inputCls = 'w-full border-2 border-orange-200 focus:border-orange-500 rounded-xl px-3 py-2 outline-none text-slate-800 bg-white';

function ImageField({
  label, url, subject, onChange,
}: { label: string; url?: string; subject?: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const generate = async () => {
    const subj = (subject || '').trim();
    if (!subj) { toast.error('Set the word first'); return; }
    setBusy(true);
    try {
      const u = await generateOnePlaygroundImage(subj);
      if (!u) throw new Error('No image returned');
      onChange(u);
      toast.success('Image generated');
    } catch (e: any) {
      toast.error(e?.message || 'Image generation failed');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      <span className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">{label}</span>
      <div className="flex gap-2 items-center">
        {url ? (
          <img src={url} alt="" className="w-14 h-14 rounded-lg object-cover border-2 border-orange-200 bg-white" />
        ) : (
          <div className="w-14 h-14 rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-orange-400" />
          </div>
        )}
        <input
          className={inputCls + ' flex-1 text-xs'}
          placeholder="https://..."
          value={url || ''}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={generate}
          disabled={busy}
          className="text-xs font-bold text-white bg-gradient-to-r from-fuchsia-500 to-orange-500 rounded-lg px-3 py-2 inline-flex items-center gap-1 disabled:opacity-50 shadow-sm"
        >
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          AI
        </button>
      </div>
    </div>
  );
}


function SlideEditor({ slide, onChange, blueprint, hub = 'playground' }: { slide: Slide; onChange: (p: Partial<Slide>) => void; blueprint?: LessonBlueprint | null; hub?: 'playground' | 'academy' | 'success' }) {
  const voice = (slide as any).voice as Slide['voice'] | undefined;
  const wandFor = (field: string, currentValue: string, apply: (v: string) => void) => (
    <WandFieldButton
      field={field}
      currentValue={currentValue}
      slideType={slide.type}
      hub={hub}
      cefrLevel="A1"
      blueprint={blueprint}
      onResult={apply}
    />
  );
  const VoiceFields = (
    <div className="grid grid-cols-3 gap-3 pt-3 mt-3 border-t border-orange-100">
      <div className="col-span-2">
        <Field label="🔊 Voice (TTS)">
          <input
            className={inputCls}
            value={voice?.text || ''}
            placeholder="What the voice says..."
            onChange={(e) => onChange({ voice: { ...(voice || {}), text: e.target.value } } as any)}
          />
        </Field>
      </div>
      <Field label="Auto-play">
        <select
          className={inputCls}
          value={voice?.autoPlay ? 'yes' : 'no'}
          onChange={(e) => onChange({ voice: { text: voice?.text || '', autoPlay: e.target.value === 'yes' } } as any)}
        >
          <option value="yes">On</option>
          <option value="no">Off</option>
        </select>
      </Field>
    </div>
  );

  const wandRow = (children: React.ReactNode, wand: React.ReactNode) => (
    <div className="flex gap-2 items-center">{children}{wand}</div>
  );

  switch (slide.type) {
    case 'intro':
      return (
        <div className="space-y-3">
          <Field label="Title">{wandRow(
            <input className={inputCls} value={slide.title} onChange={(e) => onChange({ title: e.target.value } as any)} />,
            wandFor('title', slide.title, (v) => onChange({ title: v } as any)),
          )}</Field>
          <Field label="Text">{wandRow(
            <input className={inputCls} value={slide.text || ''} onChange={(e) => onChange({ text: e.target.value } as any)} />,
            wandFor('text', slide.text || '', (v) => onChange({ text: v } as any)),
          )}</Field>
          {VoiceFields}
        </div>
      );

    case 'multiple':
      return (
        <div className="space-y-3">
          <Field label="Question">{wandRow(
            <input className={inputCls} value={slide.question} onChange={(e) => onChange({ question: e.target.value } as any)} />,
            wandFor('question', slide.question, (v) => onChange({ question: v } as any)),
          )}</Field>
          <Field label="Options (one per line)">
            <textarea
              className={inputCls + ' h-24'}
              value={slide.options.join('\n')}
              onChange={(e) => onChange({ options: e.target.value.split('\n').filter(Boolean) } as any)}
            />
          </Field>
          <Field label="Correct Answer">
            <select className={inputCls} value={slide.answer} onChange={(e) => onChange({ answer: e.target.value } as any)}>
              {slide.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          {VoiceFields}
        </div>
      );

    case 'truefalse':
      return (
        <div className="space-y-3">
          <Field label="Statement">{wandRow(
            <input className={inputCls} value={slide.statement} onChange={(e) => onChange({ statement: e.target.value } as any)} />,
            wandFor('statement', slide.statement, (v) => onChange({ statement: v } as any)),
          )}</Field>
          <Field label="Correct Answer">
            <select className={inputCls} value={slide.answer ? 'true' : 'false'} onChange={(e) => onChange({ answer: e.target.value === 'true' } as any)}>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </Field>
          {VoiceFields}
        </div>
      );

    case 'fill':
      return (
        <div className="space-y-3">
          <Field label="Sentence (use ____ for blank)">{wandRow(
            <input className={inputCls} value={slide.text} onChange={(e) => onChange({ text: e.target.value } as any)} />,
            wandFor('sentence', slide.text, (v) => onChange({ text: v } as any)),
          )}</Field>
          <Field label="Answer"><input className={inputCls} value={slide.answer} onChange={(e) => onChange({ answer: e.target.value } as any)} /></Field>
          {VoiceFields}
        </div>
      );

    case 'drag':
      return (
        <div className="space-y-3">
          <Field label="Instruction">{wandRow(
            <input className={inputCls} value={slide.instruction} onChange={(e) => onChange({ instruction: e.target.value } as any)} />,
            wandFor('instruction', slide.instruction, (v) => onChange({ instruction: v } as any)),
          )}</Field>
          <Field label="Word">{wandRow(
            <input className={inputCls} value={slide.word} onChange={(e) => onChange({ word: e.target.value } as any)} />,
            wandFor('word', slide.word, (v) => onChange({ word: v } as any)),
          )}</Field>
          <ImageField
            label="Image (AI-generated)"
            url={slide.image_url}
            subject={slide.word}
            onChange={(url) => onChange({ image_url: url } as any)}
          />
          {VoiceFields}
        </div>
      );

    case 'vocab_solo':
      return (
        <div className="space-y-3">
          <Field label="Word">{wandRow(
            <input className={inputCls} value={(slide as any).word} onChange={(e) => onChange({ word: e.target.value } as any)} />,
            wandFor('word', (slide as any).word, (v) => onChange({ word: v } as any)),
          )}</Field>
          <Field label="Definition">{wandRow(
            <input className={inputCls} value={(slide as any).definition || ''} onChange={(e) => onChange({ definition: e.target.value } as any)} />,
            wandFor('definition', (slide as any).definition || '', (v) => onChange({ definition: v } as any)),
          )}</Field>
          <ImageField
            label="Image (AI-generated)"
            url={(slide as any).image_url}
            subject={(slide as any).word}
            onChange={(url) => onChange({ image_url: url } as any)}
          />
          <p className="text-[11px] text-slate-500">Generate audio in the <b>AI Media & Audio</b> tab → it auto-binds to the 🔊 Play button.</p>
          {VoiceFields}
        </div>
      );

    case 'phonics_focus': {
      const ps: any = slide;
      const examples: string[] = Array.isArray(ps.example_words) ? ps.example_words : [];
      const setExample = (i: number, v: string) => {
        const next = [...examples];
        next[i] = v;
        onChange({ example_words: next.filter((_, idx) => idx < 3 || next[idx]?.trim()) } as any);
      };
      while (examples.length < 3) examples.push('');
      return (
        <div className="space-y-3">
          <Field label="Grapheme / Letter (large display)">
            <input className={inputCls} value={ps.grapheme || ''} onChange={(e) => onChange({ grapheme: e.target.value } as any)} placeholder="a" />
          </Field>
          <Field label="Phoneme (IPA)">
            <input className={inputCls} value={ps.phoneme || ''} onChange={(e) => onChange({ phoneme: e.target.value, sound_ipa: e.target.value } as any)} placeholder="/æ/" />
          </Field>
          <Field label="Headline (optional)">
            <input className={inputCls} value={ps.label || ''} onChange={(e) => onChange({ label: e.target.value } as any)} placeholder="Listen to the sound" />
          </Field>
          <div>
            <span className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Example Words (3, from your vocabulary)</span>
            <div className="space-y-1.5">
              {[0, 1, 2].map((i) => (
                <input
                  key={i}
                  className={inputCls}
                  placeholder={`example ${i + 1}`}
                  value={examples[i] || ''}
                  onChange={(e) => setExample(i, e.target.value.toUpperCase())}
                />
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-500">Generate the isolated sound in the <b>AI Media & Audio</b> tab — it binds to the 🔊 button.</p>
          {VoiceFields}
        </div>
      );
    }

    case 'match':
      return (
        <div className="space-y-3">
          <Field label="Instruction">{wandRow(
            <input className={inputCls} value={slide.instruction} onChange={(e) => onChange({ instruction: e.target.value } as any)} />,
            wandFor('instruction', slide.instruction, (v) => onChange({ instruction: v } as any)),
          )}</Field>
          <div>
            <span className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Pairs</span>
            <div className="space-y-2">
              {slide.pairs.map((p, i) => (
                <div key={i} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Field label="Word">
                      <input
                        className={inputCls} placeholder="Word" value={p.word}
                        onChange={(e) => {
                          const next = [...slide.pairs]; next[i] = { ...p, word: e.target.value };
                          onChange({ pairs: next } as any);
                        }}
                      />
                    </Field>
                  </div>
                  <div className="flex-1">
                    <ImageField
                      label="Image"
                      url={p.image_url}
                      subject={p.word}
                      onChange={(url) => {
                        const next = [...slide.pairs]; next[i] = { ...p, image_url: url };
                        onChange({ pairs: next } as any);
                      }}
                    />
                  </div>
                  <button
                    onClick={() => onChange({ pairs: slide.pairs.filter((_, j) => j !== i) } as any)}
                    className="text-red-500 hover:bg-red-50 rounded-lg px-2 mb-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => onChange({ pairs: [...slide.pairs, { word: '', image_url: '/playground/placeholder-dropzone.svg' }] } as any)}
              className="mt-2 text-sm font-bold text-orange-600 hover:bg-orange-50 rounded-lg px-3 py-1.5 inline-flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add pair
            </button>
          </div>
          {VoiceFields}
        </div>
      );

    case 'draw':
      return (
        <div className="space-y-3">
          <Field label="Prompt">{wandRow(
            <input className={inputCls} value={slide.prompt} onChange={(e) => onChange({ prompt: e.target.value } as any)} />,
            wandFor('prompt', slide.prompt, (v) => onChange({ prompt: v } as any)),
          )}</Field>
          {VoiceFields}
        </div>
      );
    case 'lesson_summary':
      return (
        <div className="space-y-3">
          <Field label="Title"><input className={inputCls} value={(slide as any).title || ''} onChange={(e) => onChange({ title: e.target.value } as any)} /></Field>
          <Field label="Vocabulary recap (one word per line)">
            <textarea className={inputCls + ' h-24'} value={(slide as any).vocab_recap?.join('\n') || ''}
              onChange={(e) => onChange({ vocab_recap: e.target.value.split('\n').map((s: string) => s.trim()).filter(Boolean) } as any)} />
          </Field>
          <Field label="Takeaway"><input className={inputCls} value={(slide as any).takeaway || ''} onChange={(e) => onChange({ takeaway: e.target.value } as any)} /></Field>
          {VoiceFields}
        </div>
      );
    case 'storybook':
      return <div className="text-sm text-slate-600">Use the Storybook editor (auto-shown above). 📖</div>;
    case 'media_player':
      return (
        <div className="space-y-3">
          <Field label="Title"><input className={inputCls} value={(slide as any).title || ''} onChange={(e) => onChange({ title: e.target.value } as any)} /></Field>
          <Field label="Media URL"><input className={inputCls} value={(slide as any).media_url || ''} onChange={(e) => onChange({ media_url: e.target.value } as any)} /></Field>
          <Field label="Transcript"><textarea className={inputCls + ' h-24'} value={(slide as any).transcript || ''} onChange={(e) => onChange({ transcript: e.target.value } as any)} /></Field>
        </div>
      );
  }
}
function FullPreview({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const slide = slides[i];
  return (
    <div className="w-full max-w-5xl flex flex-col items-center gap-4">
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full min-h-[60vh] p-10 flex items-center justify-center"
      >
        <SlideRenderer slide={slide} />
      </motion.div>
      <div className="flex items-center gap-4 bg-white rounded-full shadow-lg px-6 py-3">
        <button onClick={() => setI((n) => Math.max(0, n - 1))} disabled={i === 0}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold rounded-full px-5 py-2 active:scale-95 transition">← Back</button>
        <span className="font-bold text-orange-600 text-lg">{i + 1} / {slides.length}</span>
        <button onClick={() => setI((n) => Math.min(slides.length - 1, n + 1))} disabled={i === slides.length - 1}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold rounded-full px-5 py-2 active:scale-95 transition">Next →</button>
      </div>
    </div>
  );
}
