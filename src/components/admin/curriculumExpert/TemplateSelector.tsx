import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useECATemplates } from '@/hooks/useECATemplates';
import { ECAMode, AgeGroup, CEFRLevel } from '@/types/curriculumExpert';
import { Loader2 } from 'lucide-react';

interface TemplateSelectorProps {
  mode: ECAMode;
  ageGroup: AgeGroup;
  cefrLevel: CEFRLevel;
  selectedTemplateId?: string;
  onTemplateSelect: (templateId: string | undefined) => void;
}

export const TemplateSelector = ({
  mode,
  ageGroup,
  cefrLevel,
  selectedTemplateId,
  onTemplateSelect
}: TemplateSelectorProps) => {
  const { templates, isLoading, getTemplates } = useECATemplates();

  useEffect(() => {
    getTemplates({ mode, ageGroup, cefrLevel });
  }, [mode, ageGroup, cefrLevel, getTemplates]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading templates...
      </div>
    );
  }

  if (templates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="template">Template (Optional)</Label>
      <Select
        value={selectedTemplateId || 'none'}
        onValueChange={(value) => onTemplateSelect(value === 'none' ? undefined : value)}
      >
        <SelectTrigger id="template">
          <SelectValue placeholder="Generate without template" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Generate without template</SelectItem>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.templateName} ({template.useCount} uses)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedTemplateId && templates.find(t => t.id === selectedTemplateId) && (
        <p className="text-xs text-muted-foreground">
          {templates.find(t => t.id === selectedTemplateId)?.description}
        </p>
      )}
    </div>
  );
};
