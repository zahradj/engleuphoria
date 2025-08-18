import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MultipleChoiceActivityProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  isTeacher: boolean;
}

export function MultipleChoiceActivity({ onSave, onCancel }: MultipleChoiceActivityProps) {
  const [title, setTitle] = useState('Multiple Choice Activity');

  const handleSave = () => {
    onSave({
      title,
      type: 'multiple_choice',
      questions: []
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Multiple Choice Activity</CardTitle>
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