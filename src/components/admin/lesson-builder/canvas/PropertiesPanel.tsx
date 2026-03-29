import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Plus, X, Check } from 'lucide-react';
import type { CanvasElementData } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface PropertiesPanelProps {
  element: CanvasElementData | null;
  onUpdate: (updates: Partial<CanvasElementData>) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ element, onUpdate }) => {
  if (!element) {
    return (
      <div className="w-64 bg-card border-l border-border p-4 flex items-center justify-center">
        <p className="text-sm text-muted-foreground text-center">Select an element to edit its properties</p>
      </div>
    );
  }

  const updateContent = (key: string, value: any) => {
    onUpdate({ content: { ...element.content, [key]: value } });
  };

  return (
    <div className="w-64 bg-card border-l border-border p-4 overflow-y-auto space-y-4">
      <h3 className="text-sm font-semibold text-foreground capitalize">{element.elementType} Properties</h3>

      {/* Position & Size */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Position & Size</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-[10px]">X</Label>
            <Input type="number" value={element.x} onChange={(e) => onUpdate({ x: Number(e.target.value) })} className="h-7 text-xs" />
          </div>
          <div>
            <Label className="text-[10px]">Y</Label>
            <Input type="number" value={element.y} onChange={(e) => onUpdate({ y: Number(e.target.value) })} className="h-7 text-xs" />
          </div>
          <div>
            <Label className="text-[10px]">W</Label>
            <Input type="number" value={element.width} onChange={(e) => onUpdate({ width: Number(e.target.value) })} className="h-7 text-xs" />
          </div>
          <div>
            <Label className="text-[10px]">H</Label>
            <Input type="number" value={element.height} onChange={(e) => onUpdate({ height: Number(e.target.value) })} className="h-7 text-xs" />
          </div>
        </div>
        <div>
          <Label className="text-[10px]">Layer (z-index)</Label>
          <Slider value={[element.zIndex]} onValueChange={([v]) => onUpdate({ zIndex: v })} min={0} max={100} step={1} />
        </div>
      </div>

      {/* Text properties */}
      {element.elementType === 'text' && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Text</Label>
          <Textarea
            value={element.content?.text || ''}
            onChange={(e) => updateContent('text', e.target.value)}
            placeholder="Enter text..."
            className="min-h-[80px] text-sm"
          />
          <div className="flex gap-1">
            <Button size="icon" variant={element.content?.bold ? 'default' : 'outline'} className="h-7 w-7" onClick={() => updateContent('bold', !element.content?.bold)}>
              <Bold className="h-3 w-3" />
            </Button>
            <Button size="icon" variant={element.content?.italic ? 'default' : 'outline'} className="h-7 w-7" onClick={() => updateContent('italic', !element.content?.italic)}>
              <Italic className="h-3 w-3" />
            </Button>
            <Button size="icon" variant={element.content?.align === 'left' ? 'default' : 'outline'} className="h-7 w-7" onClick={() => updateContent('align', 'left')}>
              <AlignLeft className="h-3 w-3" />
            </Button>
            <Button size="icon" variant={element.content?.align === 'center' ? 'default' : 'outline'} className="h-7 w-7" onClick={() => updateContent('align', 'center')}>
              <AlignCenter className="h-3 w-3" />
            </Button>
            <Button size="icon" variant={element.content?.align === 'right' ? 'default' : 'outline'} className="h-7 w-7" onClick={() => updateContent('align', 'right')}>
              <AlignRight className="h-3 w-3" />
            </Button>
          </div>
          <div>
            <Label className="text-[10px]">Font Size</Label>
            <Slider value={[element.content?.fontSize || 24]} onValueChange={([v]) => updateContent('fontSize', v)} min={10} max={120} step={1} />
          </div>
          <div>
            <Label className="text-[10px]">Color</Label>
            <Input type="color" value={element.content?.color || '#000000'} onChange={(e) => updateContent('color', e.target.value)} className="h-7" />
          </div>
        </div>
      )}

      {/* Image properties */}
      {element.elementType === 'image' && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Image URL</Label>
          <Input value={element.content?.src || ''} onChange={(e) => updateContent('src', e.target.value)} placeholder="https://..." className="text-xs" />
        </div>
      )}

      {/* Shape properties */}
      {element.elementType === 'shape' && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Shape</Label>
          <Select value={element.content?.shape || 'rectangle'} onValueChange={(v) => updateContent('shape', v)}>
            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="rectangle">Rectangle</SelectItem>
              <SelectItem value="rounded">Rounded</SelectItem>
              <SelectItem value="circle">Circle</SelectItem>
            </SelectContent>
          </Select>
          <div>
            <Label className="text-[10px]">Fill Color</Label>
            <Input type="color" value={element.content?.fill || '#6366f1'} onChange={(e) => updateContent('fill', e.target.value)} className="h-7" />
          </div>
          <div>
            <Label className="text-[10px]">Opacity</Label>
            <Slider value={[element.content?.opacity ?? 1]} onValueChange={([v]) => updateContent('opacity', v)} min={0} max={1} step={0.05} />
          </div>
        </div>
      )}

      {/* Quiz properties */}
      {element.elementType === 'quiz' && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Question</Label>
          <Textarea value={element.content?.question || ''} onChange={(e) => updateContent('question', e.target.value)} placeholder="Enter question..." className="min-h-[60px] text-xs" />
          <Label className="text-xs text-muted-foreground">Options</Label>
          {(element.content?.options || []).map((opt: any, i: number) => (
            <div key={opt.id} className="flex items-center gap-1">
              <Button size="icon" variant={opt.isCorrect ? 'default' : 'outline'} className="h-6 w-6 shrink-0"
                onClick={() => {
                  const opts = (element.content?.options || []).map((o: any) => ({ ...o, isCorrect: o.id === opt.id }));
                  updateContent('options', opts);
                }}>
                {opt.isCorrect ? <Check className="h-3 w-3" /> : <span className="text-[10px]">{String.fromCharCode(65 + i)}</span>}
              </Button>
              <Input value={opt.text} onChange={(e) => {
                const opts = [...(element.content?.options || [])];
                opts[i] = { ...opts[i], text: e.target.value };
                updateContent('options', opts);
              }} className="h-6 text-xs" />
              <Button size="icon" variant="ghost" className="h-6 w-6 shrink-0" onClick={() => {
                updateContent('options', (element.content?.options || []).filter((_: any, j: number) => j !== i));
              }}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <Button size="sm" variant="outline" className="w-full text-xs h-7" onClick={() => {
            updateContent('options', [...(element.content?.options || []), { id: uuidv4(), text: '', isCorrect: false }]);
          }}>
            <Plus className="h-3 w-3 mr-1" /> Add Option
          </Button>
        </div>
      )}

      {/* Matching properties */}
      {element.elementType === 'matching' && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Title</Label>
          <Input value={element.content?.title || ''} onChange={(e) => updateContent('title', e.target.value)} className="text-xs h-7" />
          <Label className="text-xs text-muted-foreground">Pairs</Label>
          {(element.content?.pairs || []).map((pair: any, i: number) => (
            <div key={i} className="flex items-center gap-1">
              <Input value={pair.left} onChange={(e) => {
                const pairs = [...(element.content?.pairs || [])];
                pairs[i] = { ...pairs[i], left: e.target.value };
                updateContent('pairs', pairs);
              }} placeholder="Left" className="h-6 text-xs flex-1" />
              <span className="text-[10px]">→</span>
              <Input value={pair.right} onChange={(e) => {
                const pairs = [...(element.content?.pairs || [])];
                pairs[i] = { ...pairs[i], right: e.target.value };
                updateContent('pairs', pairs);
              }} placeholder="Right" className="h-6 text-xs flex-1" />
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => {
                updateContent('pairs', (element.content?.pairs || []).filter((_: any, j: number) => j !== i));
              }}><X className="h-3 w-3" /></Button>
            </div>
          ))}
          <Button size="sm" variant="outline" className="w-full text-xs h-7" onClick={() => {
            updateContent('pairs', [...(element.content?.pairs || []), { left: '', right: '' }]);
          }}>
            <Plus className="h-3 w-3 mr-1" /> Add Pair
          </Button>
        </div>
      )}

      {/* Fill-blank properties */}
      {element.elementType === 'fill-blank' && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Sentence (use ___ for blank)</Label>
          <Textarea value={element.content?.sentence || ''} onChange={(e) => updateContent('sentence', e.target.value)} placeholder="The cat ___ on the mat." className="min-h-[60px] text-xs" />
          <Label className="text-xs text-muted-foreground">Answer</Label>
          <Input value={element.content?.answer || ''} onChange={(e) => updateContent('answer', e.target.value)} className="text-xs h-7" />
        </div>
      )}
    </div>
  );
};
