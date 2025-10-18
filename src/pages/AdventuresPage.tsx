import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { EnhancedContentLibrary } from '@/components/classroom/content/EnhancedContentLibraryV2';

export default function AdventuresPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              A-Name's Adventures
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Interactive English learning through adventures! Complete lessons from Pre-Starter to C2 proficiency 
              with phonics focus, vocabulary building, and engaging activities.
            </p>
          </div>
        </div>

        {/* Content Library with Adventures Integration */}
        <EnhancedContentLibrary 
          contentItems={[]}
          userRole="student"
          onAddToWhiteboard={(item) => {
            console.log('Adding to whiteboard:', item);
            // Could integrate with existing whiteboard functionality
          }}
          onSelectContent={(item) => {
            console.log('Selected content:', item);
          }}
          onPreviewFile={(item) => {
            console.log('Previewing:', item);
          }}
        />
      </div>
    </div>
  );
}