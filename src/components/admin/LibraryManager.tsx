import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Library, Grid } from 'lucide-react';
import { SmartUploader } from './library/SmartUploader';
import { TaggingMatrix, TaggingData } from './library/TaggingMatrix';
import { CurriculumLinker } from './library/CurriculumLinker';
import { AssetGrid } from './library/AssetGrid';
import { toast } from 'sonner';

type UploadStep = 'idle' | 'upload' | 'tagging' | 'linking';

interface FileData {
  file: File;
  type: string;
}

export const LibraryManager = () => {
  const [uploadStep, setUploadStep] = useState<UploadStep>('idle');
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [taggingData, setTaggingData] = useState<TaggingData | null>(null);

  const handleStartUpload = () => {
    setUploadStep('upload');
  };

  const handleFileSelected = (data: { file: File; type: string }) => {
    setFileData(data);
    setUploadStep('tagging');
  };

  const handleTaggingComplete = (data: TaggingData) => {
    setTaggingData(data);
    setUploadStep('linking');
  };

  const handleUploadComplete = () => {
    toast.success('Asset uploaded successfully!');
    resetUpload();
  };

  const resetUpload = () => {
    setUploadStep('idle');
    setFileData(null);
    setTaggingData(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Library className="h-6 w-6" />
            Library (The Core)
          </h1>
          <p className="text-muted-foreground">
            Centralized asset management with smart tagging
          </p>
        </div>
        {uploadStep === 'idle' && (
          <Button onClick={handleStartUpload}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Asset
          </Button>
        )}
      </div>

      {uploadStep === 'upload' && (
        <SmartUploader
          onFileSelected={handleFileSelected}
          onCancel={resetUpload}
        />
      )}

      {uploadStep === 'tagging' && (
        <TaggingMatrix
          onTaggingComplete={handleTaggingComplete}
          onBack={() => setUploadStep('upload')}
        />
      )}

      {uploadStep === 'linking' && fileData && taggingData && (
        <CurriculumLinker
          fileData={fileData}
          taggingData={taggingData}
          onComplete={handleUploadComplete}
          onBack={() => setUploadStep('tagging')}
        />
      )}

      {uploadStep === 'idle' && <AssetGrid />}
    </div>
  );
};
