import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image as ImageIcon, Volume2, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function AssetLibrary() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Image Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            All generated images for Early Learners lessons will appear here.
            Images are automatically created during lesson multimedia generation.
          </p>
          <div className="mt-4 grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Audio Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            All generated audio files for phonics, vocabulary, and instructions.
            Audio is created using text-to-speech during multimedia generation.
          </p>
          <div className="mt-4 space-y-2">
            {['Phonics Instructions', 'Vocabulary Pronunciations', 'Story Narration'].map((type) => (
              <div key={type} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{type}</span>
                </div>
                <Badge variant="secondary">0 files</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
