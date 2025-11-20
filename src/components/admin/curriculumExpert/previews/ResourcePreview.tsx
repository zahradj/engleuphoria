import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ResourceContent } from '@/types/curriculumExpert';
import { FileText, Target } from 'lucide-react';

interface ResourcePreviewProps {
  content: ResourceContent;
}

export const ResourcePreview = ({ content }: ResourcePreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{content.resourceTitle}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Ages {content.ageGroup} • {content.cefrLevel} • {content.topic}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge>{content.cefrLevel}</Badge>
            <Badge variant="outline">{content.resourceType}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <Target className="h-4 w-4" />
            <span>Learning Objectives</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {content.objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <FileText className="h-4 w-4" />
            <span>Resource Content</span>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            {typeof content.content === 'string' ? (
              <p className="text-sm whitespace-pre-wrap">{content.content}</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(content.content).map(([key, value]) => (
                  <div key={key}>
                    <div className="font-medium text-sm mb-1 capitalize">{key.replace(/_/g, ' ')}:</div>
                    {Array.isArray(value) ? (
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                        {value.map((item, i) => (
                          <li key={i}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="font-semibold">Answer Key</div>
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content.answerKey}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="font-semibold">Teacher Notes</div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content.teacherNotes}</p>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="font-semibold">Extension Activities</div>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {content.extensionActivities.map((activity, i) => (
              <li key={i}>{activity}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
