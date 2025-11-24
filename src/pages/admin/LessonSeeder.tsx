import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, RotateCw, Trash2, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { lessonSeedService } from '@/services/lessonSeedService';
import { BackNavigation } from '@/components/navigation/BackNavigation';

const LessonSeeder = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lesson1Exists, setLesson1Exists] = useState<boolean | null>(null);
  const [lesson1Id, setLesson1Id] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkLesson1Status();
  }, []);

  const checkLesson1Status = async () => {
    const result = await lessonSeedService.checkLesson1Exists();
    setLesson1Exists(result.exists);
    setLesson1Id(result.lessonId || null);
  };

  const handleSeedLesson1 = async () => {
    setIsSeeding(true);
    
    const result = await lessonSeedService.seedLesson1();
    
    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
        variant: "default"
      });
      await checkLesson1Status();
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive"
      });
    }
    
    setIsSeeding(false);
  };

  const handleReseedLesson1 = async () => {
    setIsSeeding(true);
    
    const result = await lessonSeedService.reseedLesson1();
    
    if (result.success) {
      toast({
        title: "Success!",
        description: "Lesson 1 re-seeded successfully!",
        variant: "default"
      });
      await checkLesson1Status();
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive"
      });
    }
    
    setIsSeeding(false);
  };

  const handleDeleteLesson1 = async () => {
    if (!confirm('Are you sure you want to delete Lesson 1? This will remove it from the database.')) {
      return;
    }

    setIsDeleting(true);
    
    const result = await lessonSeedService.deleteLesson1();
    
    if (result.success) {
      toast({
        title: "Deleted",
        description: result.message,
        variant: "default"
      });
      await checkLesson1Status();
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive"
      });
    }
    
    setIsDeleting(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <BackNavigation />
        
        <div className="flex items-center gap-3 mb-6">
          <Database className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Lesson Seeder</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lesson 1: Greetings & Letter Aa</span>
              {lesson1Exists === null && (
                <Badge variant="secondary">Checking...</Badge>
              )}
              {lesson1Exists === true && (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Seeded
                </Badge>
              )}
              {lesson1Exists === false && (
                <Badge variant="secondary">
                  <XCircle className="w-4 h-4 mr-1" />
                  Not Seeded
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Pre-made interactive lesson with 20 complete screens including vocabulary, phonics, activities, and games
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-foreground">Lesson Details:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Topic:</strong> Greetings and the Letter A</li>
                <li>• <strong>CEFR Level:</strong> Pre-A1</li>
                <li>• <strong>Age Group:</strong> 5-7 years</li>
                <li>• <strong>Duration:</strong> 30 minutes</li>
                <li>• <strong>Total XP:</strong> 500</li>
                <li>• <strong>Screens:</strong> 20 interactive screens</li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-foreground">Included Activities:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 grid grid-cols-2 gap-2">
                <li>✓ Vocabulary learning (5 words)</li>
                <li>✓ Phonics (Letter Aa)</li>
                <li>✓ Tap-to-choose games</li>
                <li>✓ Drag & drop matching</li>
                <li>✓ Find the letter activity</li>
                <li>✓ Letter tracing</li>
                <li>✓ Memory matching game</li>
                <li>✓ Dialogue practice</li>
                <li>✓ Speaking simulation</li>
                <li>✓ Listening comprehension</li>
                <li>✓ Quick review quiz</li>
                <li>✓ Completion screen with badges</li>
              </ul>
            </div>

            {lesson1Id && (
              <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Lesson ID:</strong> {lesson1Id}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {!lesson1Exists && (
                <Button
                  onClick={handleSeedLesson1}
                  disabled={isSeeding}
                  size="lg"
                  className="flex-1"
                >
                  {isSeeding ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Seeding Lesson...
                    </>
                  ) : (
                    <>
                      <Database className="w-5 h-5 mr-2" />
                      Seed Lesson 1
                    </>
                  )}
                </Button>
              )}

              {lesson1Exists && (
                <>
                  <Button
                    onClick={handleReseedLesson1}
                    disabled={isSeeding}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    {isSeeding ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Re-seeding...
                      </>
                    ) : (
                      <>
                        <RotateCw className="w-5 h-5 mr-2" />
                        Re-seed Lesson 1
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleDeleteLesson1}
                    disabled={isDeleting}
                    variant="destructive"
                    size="lg"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p><strong>1. Seed Lesson 1:</strong> Click "Seed Lesson 1" to import the pre-made lesson into the database.</p>
            <p><strong>2. Assign to Students:</strong> Go to the Students tab and assign Lesson 1 to students.</p>
            <p><strong>3. Students Can Play:</strong> Students will see Lesson 1 in their "My Lessons" tab and can start learning!</p>
            <p><strong>4. Track Progress:</strong> View student progress, completion status, and XP earned.</p>
            <p className="text-yellow-600 dark:text-yellow-400"><strong>Note:</strong> Re-seeding will delete and recreate the lesson. Any student progress will be preserved.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LessonSeeder;
