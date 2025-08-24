import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SlideGenerationMonitor } from '@/components/admin/SlideGenerationMonitor';
import { FileSliders } from 'lucide-react';

export const SlideGenerationTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSliders className="h-5 w-5" />
            Automated Slide Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SlideGenerationMonitor />
        </CardContent>
      </Card>
    </div>
  );
};