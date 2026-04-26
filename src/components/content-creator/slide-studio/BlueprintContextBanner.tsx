import React from 'react';
import { Sparkles, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlueprintHandoff, CEFRLevel, HubType, HUB_LABEL, HUB_DEFAULT_CEFR } from './types';

interface Props {
  handoff: BlueprintHandoff;
  topic: string;
  setTopic: (v: string) => void;
  cefrLevel: CEFRLevel;
  setCefrLevel: (v: CEFRLevel) => void;
  hub: HubType;
  setHub: (v: HubType) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  hasSlides: boolean;
}

export const BlueprintContextBanner: React.FC<Props> = ({
  handoff, topic, setTopic, cefrLevel, setCefrLevel, hub, setHub, isGenerating, onGenerate, hasSlides,
}) => {
  const fromBp = handoff.fromBlueprint;

  return (
    <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 shadow-lg space-y-4">
      {fromBp ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-500/40">
              From Blueprint
            </span>
            {handoff.skill_focus && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40">
                Focus: {handoff.skill_focus}
              </span>
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
              {cefrLevel} · {HUB_LABEL[hub].split(' ')[0]}
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">{handoff.topic}</h2>
          {handoff.unit_title && (
            <p className="text-xs text-muted-foreground">
              Unit: <strong className="text-foreground/80">{handoff.unit_title}</strong>
              {handoff.unit_theme ? ` · 🎯 ${handoff.unit_theme}` : ''}
            </p>
          )}
          {handoff.learning_objective && (
            <p className="text-sm text-muted-foreground italic">🎓 {handoff.learning_objective}</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-500" />
            <h2 className="font-bold tracking-tight">Build a Master PPP Lesson</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select value={cefrLevel} onValueChange={(v) => setCefrLevel(v as CEFRLevel)}>
              <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="A1">A1 — Absolute Beginner</SelectItem>
                <SelectItem value="A2">A2 — Elementary</SelectItem>
                <SelectItem value="B1">B1 — Intermediate</SelectItem>
                <SelectItem value="B2">B2 — Upper-Intermediate</SelectItem>
                <SelectItem value="C1">C1 — Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={hub}
              onValueChange={(v) => {
                const h = v as HubType;
                setHub(h);
                setCefrLevel(HUB_DEFAULT_CEFR[h]);
              }}
            >
              <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="playground">{HUB_LABEL.playground}</SelectItem>
                <SelectItem value="academy">{HUB_LABEL.academy}</SelectItem>
                <SelectItem value="success">{HUB_LABEL.success}</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Lesson topic e.g. Ordering Coffee"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              maxLength={500}
              className="bg-background/50"
            />
          </div>
        </div>
      )}

      <Button
        onClick={onGenerate}
        disabled={isGenerating || !topic.trim()}
        className="w-full h-14 text-base font-semibold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Architecting your PPP lesson…
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            {hasSlides ? 'Re-Generate PPP Slides with AI' : '✨ Auto-Generate PPP Slides with AI'}
          </>
        )}
      </Button>
    </div>
  );
};
