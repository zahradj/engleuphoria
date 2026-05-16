import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, Plus, Trash2, Sparkles, Pencil, Save, X, Gamepad2, BookOpen, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import GamePlayer from '@/components/games/GamePlayer';

type GameType = 'sentence_builder' | 'verb_trio' | 'interview' | 'sorting';
type Hub = 'playground' | 'academy' | 'success';
type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// Per-hub CEFR ceilings (mirrors src/config/hubConfigs.ts).
// Playground: A1-B1 (B1 stays story-driven, no drills).
// Academy:    A1-C1 (C1 = argumentation/analysis, NOT corporate).
// Success:    A1-C1 (premium professional tone at every level).
const HUB_LEVELS: Record<Hub, Level[]> = {
  playground: ['A1', 'A2', 'B1'],
  academy:    ['A1', 'A2', 'B1', 'B2', 'C1'],
  success:    ['A1', 'A2', 'B1', 'B2', 'C1'],
};
const HUB_LABEL: Record<Hub, string> = {
  playground: '🎨 Playground (4-9)',
  academy:    '🎓 Academy (10-17)',
  success:    '🚀 Success (18+)',
};

interface GameRow {
  id: string;
  game_type: GameType;
  level: Level;
  title: string;
  description: string | null;
  content_json: any;
  is_published: boolean;
  tags: string[] | null;
  created_at: string;
}

const GAME_TYPES: { id: GameType; label: string; emoji: string; help: string }[] = [
  { id: 'sentence_builder', label: 'Sentence Builder', emoji: '🧩', help: 'Drag word chips into the correct order.' },
  { id: 'verb_trio',        label: 'Verb Trio',        emoji: '🔁', help: 'Match present / past / past-participle of irregular verbs.' },
  { id: 'interview',        label: 'Interview',        emoji: '💬', help: 'Pick the grammatically correct reply in a chat.' },
  { id: 'sorting',          label: 'Word Sorting',     emoji: '🗂️', help: 'Drag words into the correct category buckets.' },
];

const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

const STARTER_CONTENT: Record<GameType, any> = {
  sentence_builder: {
    sentences: [
      { words: ['I', 'love', 'learning', 'English'], answer: ['I', 'love', 'learning', 'English'] },
    ],
  },
  verb_trio: {
    verbs: [
      { present: 'go', past: 'went', participle: 'gone' },
      { present: 'see', past: 'saw', participle: 'seen' },
    ],
  },
  interview: {
    avatar: '🧑‍💼',
    turns: [
      { question: "Hi! What's your name?", options: ['My name is Anna.', 'I name Anna.', 'I am name Anna.'], correct: 0 },
    ],
  },
  sorting: {
    buckets: ['Nouns', 'Verbs'],
    items: [
      { word: 'run', bucket: 'Verbs' },
      { word: 'cat', bucket: 'Nouns' },
    ],
  },
};

export const GameMaker: React.FC = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<GameRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<GameRow | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('learning_games')
      .select('id, game_type, level, title, description, content_json, is_published, tags, created_at')
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) toast.error(error.message);
    setRows((data as GameRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const startNew = (type: GameType) => {
    setEditing({
      id: '',
      game_type: type,
      level: 'A1',
      title: `${GAME_TYPES.find((g) => g.id === type)?.label} game`,
      description: '',
      content_json: STARTER_CONTENT[type],
      is_published: false,
      tags: [],
      created_at: '',
    });
  };

  const save = async () => {
    if (!editing || !user?.id) { toast.error('Sign in required'); return; }
    if (!editing.title.trim()) { toast.error('Title is required'); return; }
    let json: any = editing.content_json;
    if (typeof json === 'string') {
      try { json = JSON.parse(json); } catch { toast.error('Content JSON is invalid'); return; }
    }
    const payload = {
      game_type: editing.game_type,
      level: editing.level,
      title: editing.title.trim(),
      description: editing.description?.trim() || null,
      content_json: json,
      tags: editing.tags || [],
      is_published: editing.is_published,
      created_by: user.id,
    };
    const op = editing.id
      ? supabase.from('learning_games').update(payload).eq('id', editing.id).select().maybeSingle()
      : supabase.from('learning_games').insert(payload).select().maybeSingle();
    const { error } = await op;
    if (error) { toast.error(error.message); return; }
    toast.success(editing.id ? 'Game updated' : 'Game created');
    setEditing(null);
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this game permanently?')) return;
    const { error } = await supabase.from('learning_games').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Deleted');
    refresh();
  };

  const togglePublish = async (row: GameRow) => {
    const { error } = await supabase
      .from('learning_games')
      .update({ is_published: !row.is_published })
      .eq('id', row.id);
    if (error) { toast.error(error.message); return; }
    toast.success(!row.is_published ? 'Published to students' : 'Unpublished');
    refresh();
  };

  const grouped = useMemo(() => {
    const map: Record<string, GameRow[]> = {};
    for (const r of rows) {
      const key = `${r.level} · ${GAME_TYPES.find((g) => g.id === r.game_type)?.label || r.game_type}`;
      (map[key] ||= []).push(r);
    }
    return map;
  }, [rows]);

  const studentLink = `${window.location.origin}/dashboard/games`;

  // ── Editor view ─────────────────────────────────────────────
  if (editing) {
    const meta = GAME_TYPES.find((g) => g.id === editing.game_type)!;
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-md">{meta.emoji}</div>
          <div className="flex-1">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              {editing.id ? 'Edit Game' : 'Create Game'} · {meta.label}
            </h2>
            <p className="text-sm text-slate-500">{meta.help}</p>
          </div>
          <Button variant="ghost" onClick={() => setEditing(null)}><X className="h-4 w-4 mr-1" /> Cancel</Button>
          <Button onClick={save} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Save className="h-4 w-4 mr-1" /> Save</Button>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-3 space-y-2">
              <Label>Title</Label>
              <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Hub</Label>
              <Select
                value={((editing.tags || []).find((t) => ['playground','academy','success'].includes(t)) || 'academy') as Hub}
                onValueChange={(v) => {
                  const hub = v as Hub;
                  const allowed = HUB_LEVELS[hub];
                  const nextLevel = allowed.includes(editing.level) ? editing.level : allowed[0];
                  const otherTags = (editing.tags || []).filter((t) => !['playground','academy','success'].includes(t));
                  setEditing({ ...editing, tags: [hub, ...otherTags], level: nextLevel });
                }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(HUB_LEVELS) as Hub[]).map((h) => <SelectItem key={h} value={h}>{HUB_LABEL[h]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>CEFR Level</Label>
              <Select value={editing.level} onValueChange={(v) => setEditing({ ...editing, level: v as Level })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(() => {
                    const hub = ((editing.tags || []).find((t) => ['playground','academy','success'].includes(t)) || 'academy') as Hub;
                    return HUB_LEVELS[hub].map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>);
                  })()}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea rows={2} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center justify-between">
              <span>Content (JSON)</span>
              <span className="text-xs text-slate-400">Edit the structure for {meta.label}</span>
            </Label>
            <Textarea
              rows={14}
              className="font-mono text-xs"
              value={typeof editing.content_json === 'string' ? editing.content_json : JSON.stringify(editing.content_json, null, 2)}
              onChange={(e) => setEditing({ ...editing, content_json: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3">
            <div>
              <p className="text-sm font-semibold">Publish to Students</p>
              <p className="text-xs text-slate-500">Visible in the Grammar Arcade for matching CEFR level.</p>
            </div>
            <Switch checked={editing.is_published} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} />
          </div>

          {editing.id ? (
            <div className="rounded-xl border border-dashed border-indigo-200 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/20 p-4">
              <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Preview</p>
              <GamePlayer gameId={editing.id} />
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
          <Gamepad2 className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">Game Maker</h2>
          <p className="text-sm text-slate-500">Build CEFR-tagged grammar mini-games. Published games appear in the Student Arcade and can be linked from the classroom.</p>
        </div>
        <a href={studentLink} target="_blank" rel="noreferrer">
          <Button variant="outline" size="sm" className="gap-1"><LinkIcon className="h-4 w-4" /> Open Student Arcade</Button>
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {GAME_TYPES.map((g) => (
          <button
            key={g.id}
            onClick={() => startNew(g.id)}
            className="text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 hover:shadow-md transition p-4"
          >
            <div className="text-3xl">{g.emoji}</div>
            <div className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{g.label}</div>
            <div className="text-xs text-slate-500 mt-1">{g.help}</div>
            <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
              <Plus className="h-3 w-3" /> New {g.label}
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-2"><BookOpen className="h-4 w-4" /> Game Library</h3>
          <span className="text-xs text-slate-500">{rows.length} games</span>
        </div>

        {loading ? (
          <div className="p-10 flex items-center justify-center text-slate-400"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No games yet. Pick a type above to create your first one. <Sparkles className="inline h-4 w-4 ml-1 text-indigo-500" />
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {Object.entries(grouped).map(([heading, items]) => (
              <div key={heading}>
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/40 text-xs font-bold uppercase tracking-wide text-slate-500">{heading}</div>
                {items.map((r) => (
                  <div key={r.id} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <Badge variant="outline" className="text-[10px]">{r.level}</Badge>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{r.title}</div>
                      {r.description ? <div className="text-xs text-slate-500 truncate">{r.description}</div> : null}
                    </div>
                    <Badge className={r.is_published ? 'bg-emerald-100 text-emerald-700 border-0' : 'bg-slate-200 text-slate-600 border-0'}>
                      {r.is_published ? 'Published' : 'Draft'}
                    </Badge>
                    <Button size="sm" variant="ghost" onClick={() => setPreviewId(previewId === r.id ? null : r.id)}>Preview</Button>
                    <Button size="sm" variant="outline" onClick={() => togglePublish(r)}>{r.is_published ? 'Unpublish' : 'Publish'}</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(r)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
                {previewId && items.find((i) => i.id === previewId) ? (
                  <div className="px-4 pb-6 pt-2 bg-slate-50/40 dark:bg-slate-800/20">
                    <GamePlayer gameId={previewId} />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameMaker;
