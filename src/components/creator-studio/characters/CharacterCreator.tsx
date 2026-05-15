import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles, Save, Trash2, Wand2, Users, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  listCharactersForHub,
  saveCharacter,
  deleteCharacter,
} from '@/services/characterService';
import type { CharacterHub, CustomCharacter } from '@/types/character';
import { generateSlideImage } from '../steps/slide-studio/mediaGeneration';

const HUB_LABEL: Record<CharacterHub, string> = {
  playground: 'Playground (Kids)',
  academy: 'Academy (Teens)',
  success: 'Success (Adults)',
};

const HUB_ACCENT: Record<CharacterHub, string> = {
  playground: 'from-orange-500 to-amber-500',
  academy: 'from-indigo-500 to-purple-600',
  success: 'from-emerald-500 to-teal-600',
};

const emptyForm = (hub: CharacterHub) => ({
  id: undefined as string | undefined,
  name: '',
  hub,
  personality_traits: '',
  visual_blueprint: '',
  avatar_url: '' as string,
});

export const CharacterCreator: React.FC = () => {
  const [hub, setHub] = useState<CharacterHub>('academy');
  const [list, setList] = useState<CustomCharacter[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [form, setForm] = useState(emptyForm('academy'));
  const [generatingAvatar, setGeneratingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);

  const refresh = async (h: CharacterHub) => {
    setLoadingList(true);
    try {
      setList(await listCharactersForHub(h));
    } catch (e: any) {
      toast.error(e?.message || 'Failed to load characters');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    refresh(hub);
    setForm((f) => ({ ...f, hub }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hub]);

  const resetForm = () => setForm(emptyForm(hub));
  const loadIntoForm = (c: CustomCharacter) =>
    setForm({
      id: c.id,
      name: c.name,
      hub: c.hub,
      personality_traits: c.personality_traits,
      visual_blueprint: c.visual_blueprint,
      avatar_url: c.avatar_url ?? '',
    });

  const handleGenerateAvatar = async () => {
    if (!form.visual_blueprint.trim()) {
      toast.error('Add a visual description first.');
      return;
    }
    setGeneratingAvatar(true);
    try {
      const prompt = `Character portrait of "${form.name || 'unnamed character'}". ${form.visual_blueprint}. Centered head-and-shoulders portrait, neutral pose, soft natural lighting, no text.`;
      // We re-use the slide image pipeline; a stable per-character bucket key keeps overwrites tidy.
      const tempId = form.id || `char_${crypto.randomUUID()}`;
      const asset = await generateSlideImage(prompt, 'characters', tempId, hub);
      setForm((f) => ({ ...f, avatar_url: asset.url }));
      toast.success('Avatar generated ✓');
    } catch (e: any) {
      toast.error(e?.message || 'Avatar generation failed');
    } finally {
      setGeneratingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Give your character a name.');
    if (!form.visual_blueprint.trim()) return toast.error('Add a visual description.');
    setSaving(true);
    try {
      const saved = await saveCharacter({
        id: form.id,
        name: form.name,
        hub: form.hub,
        personality_traits: form.personality_traits,
        visual_blueprint: form.visual_blueprint,
        avatar_url: form.avatar_url || null,
      });
      toast.success(`Saved "${saved.name}" to the Cast Vault ✨`);
      resetForm();
      await refresh(hub);
    } catch (e: any) {
      toast.error(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: CustomCharacter) => {
    if (!confirm(`Delete "${c.name}"? This cannot be undone.`)) return;
    try {
      await deleteCharacter(c.id);
      toast.success('Character removed');
      if (form.id === c.id) resetForm();
      await refresh(hub);
    } catch (e: any) {
      toast.error(e?.message || 'Delete failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className={cn('h-10 w-10 rounded-xl text-white grid place-items-center bg-gradient-to-br', HUB_ACCENT[hub])}>
          <Users className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold tracking-tight">Cast Vault — Character Creator</h1>
          <p className="text-sm text-muted-foreground">Design re-usable characters and inject them into AI-generated lessons & stories like a casting director.</p>
        </div>
        <div className="w-56">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Hub</Label>
          <Select value={hub} onValueChange={(v) => setHub(v as CharacterHub)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(HUB_LABEL) as CharacterHub[]).map((h) => (
                <SelectItem key={h} value={h}>{HUB_LABEL[h]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Form */}
        <Card className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Mia the Inventor"
              />
            </div>
            <div>
              <Label>Target Hub</Label>
              <Select value={form.hub} onValueChange={(v) => setForm({ ...form, hub: v as CharacterHub })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(HUB_LABEL) as CharacterHub[]).map((h) => (
                    <SelectItem key={h} value={h}>{HUB_LABEL[h]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Personality</Label>
            <Textarea
              rows={2}
              value={form.personality_traits}
              onChange={(e) => setForm({ ...form, personality_traits: e.target.value })}
              placeholder="e.g. Brave but clumsy, loves animals, asks lots of questions."
            />
          </div>

          <div>
            <Label>Visual Description</Label>
            <Textarea
              rows={3}
              value={form.visual_blueprint}
              onChange={(e) => setForm({ ...form, visual_blueprint: e.target.value })}
              placeholder="e.g. A teenager with spiky red hair, freckles, round glasses, and a green bomber jacket."
            />
            <p className="text-xs text-muted-foreground mt-1">Used as the visual blueprint for every AI-generated image starring this character.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleGenerateAvatar} disabled={generatingAvatar} variant="secondary">
              {generatingAvatar ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
              Generate Character Avatar
            </Button>
            <Button onClick={handleSave} disabled={saving} className={cn('text-white bg-gradient-to-r', HUB_ACCENT[form.hub])}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {form.id ? 'Update Character' : 'Save Character to Vault'}
            </Button>
            {form.id && (
              <Button variant="ghost" onClick={resetForm}>New Character</Button>
            )}
          </div>
        </Card>

        {/* Avatar preview */}
        <Card className="p-5 flex flex-col items-center justify-center text-center space-y-3 min-h-[280px]">
          <div className="h-40 w-40 rounded-2xl border bg-muted overflow-hidden grid place-items-center">
            {form.avatar_url ? (
              <img src={form.avatar_url} alt={form.name || 'character avatar'} className="h-full w-full object-cover" />
            ) : (
              <div className="text-muted-foreground flex flex-col items-center gap-1">
                <ImageIcon className="h-8 w-8" />
                <span className="text-xs">No avatar yet</span>
              </div>
            )}
          </div>
          <div className="font-bold">{form.name || 'Unnamed character'}</div>
          <div className="text-xs text-muted-foreground line-clamp-3">{form.personality_traits || '—'}</div>
        </Card>
      </div>

      {/* Vault */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Cast Vault — {HUB_LABEL[hub]}</h2>
          <span className="text-xs text-muted-foreground">{list.length} character{list.length === 1 ? '' : 's'}</span>
        </div>

        {loadingList ? (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
        ) : list.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <Sparkles className="h-6 w-6 mx-auto mb-2 opacity-60" />
            No characters yet for this hub. Create your first cast member above.
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {list.map((c) => (
              <Card key={c.id} className="p-3 space-y-2">
                <div className="aspect-square w-full rounded-lg overflow-hidden bg-muted grid place-items-center">
                  {c.avatar_url ? (
                    <img src={c.avatar_url} alt={c.name} className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="font-bold truncate">{c.name}</div>
                <div className="text-[11px] text-muted-foreground line-clamp-2 min-h-[28px]">{c.personality_traits || '—'}</div>
                <div className="flex gap-1">
                  <Button size="sm" variant="secondary" className="flex-1" onClick={() => loadIntoForm(c)}>Edit</Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(c)} aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterCreator;
