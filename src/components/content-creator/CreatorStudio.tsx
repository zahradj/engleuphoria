import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreatorStudioPreview } from './CreatorStudioPreview';
import { CreatorStudioAITools } from './CreatorStudioAITools';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Save, Send, Loader2 } from 'lucide-react';

const TRACKS = [
  { value: 'kids', label: 'Playground', emoji: '🎮' },
  { value: 'teens', label: 'Academy', emoji: '🎓' },
  { value: 'adults', label: 'Professional', emoji: '💼' },
] as const;

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export const CreatorStudio: React.FC = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [track, setTrack] = useState<string>('teens');
  const [level, setLevel] = useState<string>('B1');
  const [saving, setSaving] = useState(false);

  const handleSave = async (publish: boolean) => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title,
        content: { markdown: content } as any,
        target_system: track,
        difficulty_level: level,
        is_published: publish,
        created_by: user?.id,
        ai_metadata: {} as any,
        language: 'en',
      };

      const { error } = await supabase.from('curriculum_lessons').insert(payload);
      if (error) throw error;

      toast.success(publish ? 'Lesson published!' : 'Draft saved!');
      setTitle('');
      setContent('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      {/* Split screen */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* LEFT: Editor */}
        <div className="flex flex-col gap-4 overflow-auto">
          <Input
            placeholder="Lesson Title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold h-12 bg-card border-border"
          />

          {/* Track pills */}
          <div className="flex gap-2">
            {TRACKS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTrack(t.value)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all border',
                  track === t.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-transparent hover:bg-accent'
                )}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>

          {/* Level selector */}
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="w-40 bg-card">
              <SelectValue placeholder="CEFR Level" />
            </SelectTrigger>
            <SelectContent>
              {CEFR_LEVELS.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Markdown editor */}
          <Textarea
            placeholder="Write your lesson content in Markdown…&#10;&#10;# Introduction&#10;Welcome to this lesson on…&#10;&#10;## Key Vocabulary&#10;- **word** — definition&#10;&#10;## Practice&#10;1. Exercise one…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 min-h-[300px] resize-none bg-card border-border font-mono text-sm leading-relaxed"
          />
        </div>

        {/* RIGHT: Live Preview */}
        <div className="relative min-h-0">
          <CreatorStudioPreview
            title={title}
            content={content}
            track={track}
            level={level}
          />

          {/* Floating AI Magic Wand */}
          <div className="absolute bottom-4 right-4">
            <CreatorStudioAITools content={content} level={level} track={track} />
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
        <Button
          variant="outline"
          onClick={() => handleSave(false)}
          disabled={saving}
        >
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Draft
        </Button>
        <Button
          onClick={() => handleSave(true)}
          disabled={saving}
        >
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
          Publish
        </Button>
      </div>
    </div>
  );
};
