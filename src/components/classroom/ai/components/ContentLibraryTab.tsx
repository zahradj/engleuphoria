
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Copy,
  FileText,
  Download
} from "lucide-react";
import { ContentLibraryItem } from "@/services/unifiedAIContentService";

interface ContentLibraryTabProps {
  contentLibrary: ContentLibraryItem[];
  onClearLibrary: () => void;
  onCopyToClipboard: (content: string) => void;
  onInsertToWhiteboard: (content: string) => void;
  onExportContent: (item: ContentLibraryItem) => void;
}

export function ContentLibraryTab({
  contentLibrary,
  onClearLibrary,
  onCopyToClipboard,
  onInsertToWhiteboard,
  onExportContent
}: ContentLibraryTabProps) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Generated Content</h3>
        {contentLibrary.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearLibrary}
          >
            Clear All
          </Button>
        )}
      </div>

      {contentLibrary.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Sparkles size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No content generated yet</p>
          <p className="text-sm">Switch to Generate tab to create your first content</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contentLibrary.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {item.type.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.duration}min
                      </Badge>
                      {item.metadata.generationTime && (
                        <Badge variant="outline" className="text-xs text-green-600">
                          {Math.round(item.metadata.generationTime / 1000)}s
                        </Badge>
                      )}
                      {item.metadata.isMockData && (
                        <Badge variant="outline" className="text-xs text-yellow-600">
                          Mock
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded text-xs max-h-32 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-mono text-xs">
                    {item.content.substring(0, 200)}...
                  </pre>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCopyToClipboard(item.content)}
                  >
                    <Copy size={12} className="mr-1" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onInsertToWhiteboard(item.content)}
                  >
                    <FileText size={12} className="mr-1" />
                    To Board
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onExportContent(item)}
                  >
                    <Download size={12} className="mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
