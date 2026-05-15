import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  bookingId: string;
}

export const GenerateActivityButton: React.FC<Props> = ({ bookingId }) => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('generate-class-activity', {
        body: { booking_id: bookingId, prompt: prompt.trim() },
      });
      if (error) throw error;
      toast({ title: 'Activity sent!', description: 'It just popped up on your student\'s screen.' });
      setPrompt('');
      setOpen(false);
    } catch (e: any) {
      toast({
        title: 'Couldn\'t generate activity',
        description: e?.message ?? 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Sparkles className="h-4 w-4" />
          Generate Activity
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Activity Generator
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Label htmlFor="activity-prompt" className="text-sm">
            What should we practice?
          </Label>
          <Input
            id="activity-prompt"
            placeholder="e.g. Past Simple, ordering food, phrasal verbs…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleGenerate()}
            autoFocus
          />
          <p className="text-xs text-muted-foreground">
            AI will pick the best format (quiz, roleplay, or fill-in-the-blank) and push it live to your student.
          </p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
            {loading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating…</>
            ) : (
              <>Generate</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateActivityButton;
