import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HotspotActivityProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  isTeacher: boolean;
}

export function HotspotActivity({ onSave, onCancel }: HotspotActivityProps) {
  const [title, setTitle] = useState('Hotspot Activity');

  const handleSave = () => {
    onSave({
      title,
      type: 'hotspot',
      hotspots: []
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Hotspot Activity</CardTitle>
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