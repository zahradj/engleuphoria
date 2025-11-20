import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useECAGenerator } from '@/hooks/useECAGenerator';
import { ECAMode } from '@/types/curriculumExpert';

interface SaveMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ECAMode;
  content: any;
  defaultTitle?: string;
  ageGroup: string;
  cefrLevel: string;
}

export const SaveMaterialDialog = ({
  open,
  onOpenChange,
  mode,
  content,
  defaultTitle,
  ageGroup,
  cefrLevel
}: SaveMaterialDialogProps) => {
  const [title, setTitle] = useState(defaultTitle || '');
  const [isSaving, setIsSaving] = useState(false);
  const { saveToDatabase } = useECAGenerator();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: 'Title Required',
        description: 'Please enter a title for your material.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSaving(true);
      await saveToDatabase(mode, content, {
        title: title.trim(),
        ageGroup,
        cefrLevel
      });
      
      toast({
        title: 'Saved Successfully',
        description: `Your ${mode} has been saved to the library.`
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save {mode.charAt(0).toUpperCase() + mode.slice(1)}</DialogTitle>
          <DialogDescription>
            Save this {mode} to your library for future use.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="save-title">Title</Label>
            <Input
              id="save-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Enter ${mode} title...`}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !title.trim()}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
