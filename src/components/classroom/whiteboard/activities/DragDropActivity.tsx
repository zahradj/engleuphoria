import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DragDropActivityProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  isTeacher: boolean;
}

export function DragDropActivity({ onSave, onCancel }: DragDropActivityProps) {
  const [title, setTitle] = useState('Drag & Drop Activity');
  const [items, setItems] = useState(['Item 1', 'Item 2']);
  const [targets, setTargets] = useState(['Target A', 'Target B']);

  const handleSave = () => {
    onSave({
      title,
      type: 'drag_drop',
      items,
      targets,
      correctMatches: {}
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Drag & Drop Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Activity Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={handleSave}>Save Activity</Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}