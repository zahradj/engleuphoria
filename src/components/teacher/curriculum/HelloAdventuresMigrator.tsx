import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Download, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { helloAdventuresMigrationService } from '@/services/helloAdventuresMigrationService';

export function HelloAdventuresMigrator() {
  const [migrationProgress, setMigrationProgress] = useState(
    helloAdventuresMigrationService.getMigrationProgress()
  );
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = helloAdventuresMigrationService.onProgressUpdate(
      (progress) => setMigrationProgress(progress)
    );
    return unsubscribe;
  }, []);

  const handleStartMigration = async () => {
    try {
      toast({
        title: "Starting Hello Adventures Migration",
        description: "Importing all Hello Adventures lessons into the systematic curriculum...",
      });

      await helloAdventuresMigrationService.migrateAllContent();

      toast({
        title: "Migration Completed!",
        description: `Successfully imported ${migrationProgress.processedLessons} Hello Adventures lessons.`,
      });
    } catch (error) {
      console.error('Migration failed:', error);
      toast({
        title: "Migration Failed",
        description: error.message || "Failed to migrate Hello Adventures content.",
        variant: "destructive",
      });
    }
  };

  const handleResetMigration = () => {
    helloAdventuresMigrationService.resetMigration();
    setMigrationProgress(helloAdventuresMigrationService.getMigrationProgress());
    toast({
      title: "Migration Reset",
      description: "Migration status has been reset.",
    });
  };

  const getStatusIcon = () => {
    switch (migrationProgress.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
      case 'fetching':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-500" />;
    }
  };

  const getStatusColor = () => {
    switch (migrationProgress.status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'processing':
      case 'fetching':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const isInProgress = migrationProgress.status === 'processing' || migrationProgress.status === 'fetching';

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            Hello Adventures Migration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Automatically import all Hello Adventures lessons into your systematic curriculum library. 
            This will add interactive Pre-A1 level content perfect for young learners.
          </p>
          
          {/* Migration Status */}
          <div className={`p-4 rounded-lg border ${getStatusColor()} mb-4`}>
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon()}
              <span className="font-semibold capitalize">{migrationProgress.status}</span>
            </div>
            {migrationProgress.currentLesson && (
              <p className="text-sm">{migrationProgress.currentLesson}</p>
            )}
          </div>

          {/* Progress Bar */}
          {migrationProgress.totalLessons > 0 && (
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{migrationProgress.processedLessons} / {migrationProgress.totalLessons} lessons</span>
              </div>
              <Progress 
                value={(migrationProgress.processedLessons / migrationProgress.totalLessons) * 100} 
                className="w-full"
              />
              {migrationProgress.failedLessons > 0 && (
                <p className="text-sm text-red-600">
                  Failed: {migrationProgress.failedLessons} lessons
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleStartMigration}
              disabled={isInProgress}
              className="flex items-center gap-2"
            >
              {isInProgress ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Migrating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Import Hello Adventures
                </>
              )}
            </Button>
            
            {migrationProgress.status !== 'idle' && (
              <Button variant="outline" onClick={handleResetMigration}>
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Migration Preview */}
      <Card>
        <CardHeader>
          <CardTitle>What Will Be Imported</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Lesson Content</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Pre-A1</Badge>
                  <span>Meeting Anya - Hello Adventures</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Pre-A1</Badge>
                  <span>Anya's Family - Family Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Pre-A1</Badge>
                  <span>Colors with Anya - Rainbow Adventure</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">+ More lessons...</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Features Included</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Interactive character-based lessons</li>
                <li>• Songs and musical activities</li>
                <li>• Drag & drop exercises</li>
                <li>• Family and color vocabulary</li>
                <li>• Pre-A1 systematic progression</li>
                <li>• Young learner friendly content</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Messages */}
      {migrationProgress.errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-semibold">Migration Errors:</p>
              {migrationProgress.errors.map((error, index) => (
                <p key={index} className="text-sm">• {error}</p>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {migrationProgress.status === 'completed' && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <p className="font-semibold">Migration Completed Successfully!</p>
            <p className="text-sm mt-1">
              All Hello Adventures lessons have been imported and are now available in your curriculum library. 
              You can find them in the "Browse Library" section under the "Hello Adventures" collection.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}