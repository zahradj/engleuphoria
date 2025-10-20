import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  ExternalLink,
  Copy,
  Zap,
  Palette,
  Share2,
  Lightbulb,
  CheckCircle2,
  Video
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LessonImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonUrl: string;
  lessonTitle: string;
}

export function LessonImportDialog({
  open,
  onOpenChange,
  lessonUrl,
  lessonTitle
}: LessonImportDialogProps) {
  const { toast } = useToast();

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(lessonUrl);
    toast({
      title: "Link Copied!",
      description: "Lesson URL copied to clipboard"
    });
  };

  const handleOpenLesson = () => {
    window.open(lessonUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            📚 How to Use: {lessonTitle}
          </DialogTitle>
          <DialogDescription>
            Choose the method that works best for your teaching style
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="direct" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="direct" className="text-xs sm:text-sm">
              <Zap className="h-4 w-4 mr-1" />
              Direct Use
            </TabsTrigger>
            <TabsTrigger value="remix" className="text-xs sm:text-sm">
              <Palette className="h-4 w-4 mr-1" />
              Remix
            </TabsTrigger>
            <TabsTrigger value="embed" className="text-xs sm:text-sm">
              <Share2 className="h-4 w-4 mr-1" />
              Embed
            </TabsTrigger>
          </TabsList>

          {/* Method 1: Direct Use */}
          <TabsContent value="direct" className="space-y-4 mt-4">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              ⚡ Fastest Method
            </Badge>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Open the Lesson</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Click the button below to launch the lesson in a new tab
                  </p>
                  <Button onClick={handleOpenLesson} size="sm" className="w-full sm:w-auto">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Lesson Now
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Share with Students</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Copy the link and share it with your students via email, LMS, or classroom platform
                  </p>
                  <Button onClick={handleCopyUrl} size="sm" variant="outline" className="w-full sm:w-auto">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Lesson Link
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Use in Class</h4>
                  <p className="text-sm text-muted-foreground">
                    Project on screen for whole class or assign for individual/group work
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Perfect For:</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Quick deployment without setup</li>
                    <li>• One-time lesson delivery</li>
                    <li>• Testing the lesson before customizing</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Method 2: Remix & Customize */}
          <TabsContent value="remix" className="space-y-4 mt-4">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              🎨 Most Flexible
            </Badge>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Open Lesson Preview</h4>
                  <p className="text-sm text-muted-foreground">
                    Click to view the complete lesson in Lovable
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Click "Remix This Project"</h4>
                  <p className="text-sm text-muted-foreground">
                    In Lovable, look for the Remix option to create your own editable copy
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Customize Content</h4>
                  <p className="text-sm text-muted-foreground">
                    Edit slides, adjust timing, change visuals, add your school's branding
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Save & Deploy</h4>
                  <p className="text-sm text-muted-foreground">
                    Publish your customized version and share with students
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">Customization Ideas:</h4>
                  <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                    <li>• Adjust difficulty for different student levels</li>
                    <li>• Add your school logo and colors</li>
                    <li>• Include student names in examples</li>
                    <li>• Extend or shorten lesson duration</li>
                    <li>• Add supplementary activities</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Method 3: Embed */}
          <TabsContent value="embed" className="space-y-4 mt-4">
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              🔗 Best Integration
            </Badge>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Copy Lesson URL</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Get the direct link to this lesson
                  </p>
                  <Button onClick={handleCopyUrl} size="sm" variant="outline" className="w-full sm:w-auto">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Add to Your Platform</h4>
                  <p className="text-sm text-muted-foreground">
                    Paste the URL into your LMS, Google Classroom, or teaching platform
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Assign to Students</h4>
                  <p className="text-sm text-muted-foreground">
                    Set as homework, group activity, or in-class assignment
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Track Progress</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitor student engagement through your platform's analytics
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Share2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-1">Compatible With:</h4>
                  <ul className="text-sm text-cyan-800 dark:text-cyan-200 space-y-1">
                    <li>• Google Classroom</li>
                    <li>• Canvas LMS</li>
                    <li>• Moodle</li>
                    <li>• Microsoft Teams</li>
                    <li>• Any platform that accepts external links</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer with Pro Tips */}
        <div className="border-t pt-4 mt-4">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">💡 Pro Tips:</h4>
                <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                  <li>• <strong>Preview first:</strong> Review all slides before using with students</li>
                  <li>• <strong>Pace yourself:</strong> Adjust timing based on your class needs</li>
                  <li>• <strong>Mix methods:</strong> Use direct for testing, remix for customization</li>
                  <li>• <strong>Perfect for hybrid:</strong> Works great for both in-person and online teaching</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button onClick={handleOpenLesson} className="flex-1">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Lesson
          </Button>
          <Button onClick={handleCopyUrl} variant="outline" className="flex-1">
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
