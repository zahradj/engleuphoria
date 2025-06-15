
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Download,
  Share
} from "lucide-react";

interface ContentItem {
  id: string;
  type: string;
  title: string;
  metadata: {
    topic: string;
    level: string;
    generatedAt: Date;
  };
}

interface ContentLibraryTabProps {
  generatedContent: ContentItem[];
  onClearContent: () => void;
  onDownload: (content: ContentItem) => void;
}

export const ContentLibraryTab = ({
  generatedContent,
  onClearContent,
  onDownload
}: ContentLibraryTabProps) => {
  const handleDownload = (content: ContentItem) => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${content.title}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Generated Content Library</h3>
        {generatedContent.length > 0 && (
          <Button variant="outline" onClick={onClearContent}>
            Clear All
          </Button>
        )}
      </div>

      {generatedContent.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No content generated yet. Create your first AI-generated content!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {generatedContent.map((content) => (
            <Card key={content.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{content.title}</CardTitle>
                  <Badge variant="outline">{content.type.replace('_', ' ')}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-600">Topic: {content.metadata.topic}</p>
                  <p className="text-xs text-gray-600">Level: {content.metadata.level}</p>
                  <p className="text-xs text-gray-600">
                    Generated: {content.metadata.generatedAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleDownload(content)}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
