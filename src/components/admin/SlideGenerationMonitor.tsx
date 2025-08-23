import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Play, Pause, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';

interface GenerationJob {
  id: string;
  job_name: string;
  total_lessons: number;
  completed_lessons: number;
  failed_lessons: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  started_at?: string;
  completed_at?: string;
  created_at: string;
  tasksByStatus?: Record<string, number>;
  totalSlidesGenerated?: number;
  progressPercentage?: number;
}

export const SlideGenerationMonitor: React.FC = () => {
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState<GenerationJob | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('content_generation_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Fetch detailed status for each job
      const jobsWithStatus = await Promise.all(
        data.map(async (job) => {
          if (job.status === 'running' || job.status === 'completed') {
            try {
              const { data: statusData } = await supabase.functions.invoke('ai-slides-batch-orchestrator', {
                body: { action: 'get_status', jobId: job.id }
              });
              
              if (statusData?.success) {
                return { ...job, ...statusData.job };
              }
            } catch (error) {
              console.error('Failed to fetch job status:', error);
            }
          }
          return job;
        })
      );

      setJobs(jobsWithStatus);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch generation jobs",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNewJob = async () => {
    setIsCreatingJob(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-slides-batch-orchestrator', {
        body: { action: 'create_job' }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Job Created",
          description: `Created generation job for ${data.totalLessons} lessons`,
        });
        fetchJobs();
        
        // Auto-start processing
        if (data.jobId) {
          startProcessing(data.jobId);
        }
      } else {
        toast({
          title: "Info",
          description: data.message,
        });
      }
    } catch (error) {
      console.error('Failed to create job:', error);
      toast({
        title: "Error",
        description: "Failed to create generation job",
        variant: "destructive"
      });
    } finally {
      setIsCreatingJob(false);
    }
  };

  const startProcessing = async (jobId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-slides-batch-orchestrator', {
        body: { 
          action: 'process_batch', 
          jobId, 
          batchSize: 3 // Process 3 lessons at a time
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Processing Started",
          description: `Processing batch for job ${jobId}`,
        });
        fetchJobs();
      }
    } catch (error) {
      console.error('Failed to start processing:', error);
      toast({
        title: "Error",
        description: "Failed to start processing",
        variant: "destructive"
      });
    }
  };

  const pauseJob = async (jobId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-slides-batch-orchestrator', {
        body: { action: 'pause_job', jobId }
      });

      if (error) throw error;

      toast({
        title: "Job Paused",
        description: "Generation job has been paused",
      });
      fetchJobs();
    } catch (error) {
      console.error('Failed to pause job:', error);
      toast({
        title: "Error",
        description: "Failed to pause job",
        variant: "destructive"
      });
    }
  };

  const resumeJob = async (jobId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-slides-batch-orchestrator', {
        body: { action: 'resume_job', jobId }
      });

      if (error) throw error;

      toast({
        title: "Job Resumed",
        description: "Generation job has been resumed",
      });
      fetchJobs();
      
      // Continue processing
      startProcessing(jobId);
    } catch (error) {
      console.error('Failed to resume job:', error);
      toast({
        title: "Error",
        description: "Failed to resume job",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'secondary', icon: null },
      running: { color: 'primary', icon: <RefreshCw className="h-3 w-3 animate-spin" /> },
      completed: { color: 'success', icon: <CheckCircle className="h-3 w-3" /> },
      failed: { color: 'destructive', icon: <AlertCircle className="h-3 w-3" /> },
      paused: { color: 'warning', icon: <Pause className="h-3 w-3" /> }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge variant={config.color as any} className="gap-1">
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Slide Generation Monitor
          </CardTitle>
          <CardDescription>
            Monitor and control automated slide generation for all 430 lessons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={createNewJob}
              disabled={isCreatingJob}
              size="lg"
            >
              {isCreatingJob ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Creating Job...
                </>
              ) : (
                'Start New Generation Job'
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={fetchJobs}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{job.job_name}</CardTitle>
                {getStatusBadge(job.status)}
              </div>
              <CardDescription>
                Created: {new Date(job.created_at).toLocaleString()}
                {job.started_at && ` • Started: ${new Date(job.started_at).toLocaleString()}`}
                {job.completed_at && ` • Completed: ${new Date(job.completed_at).toLocaleString()}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Progress: {job.completed_lessons}/{job.total_lessons} lessons</span>
                    <span>{job.progressPercentage || 0}%</span>
                  </div>
                  <Progress 
                    value={job.progressPercentage || 0} 
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-primary">Completed</div>
                    <div className="text-lg">{job.completed_lessons}</div>
                  </div>
                  <div>
                    <div className="font-medium text-destructive">Failed</div>
                    <div className="text-lg">{job.failed_lessons}</div>
                  </div>
                  <div>
                    <div className="font-medium text-secondary">Total Slides</div>
                    <div className="text-lg">{job.totalSlidesGenerated || 0}</div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">Remaining</div>
                    <div className="text-lg">{job.total_lessons - job.completed_lessons - job.failed_lessons}</div>
                  </div>
                </div>

                {job.tasksByStatus && (
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(job.tasksByStatus).map(([status, count]) => (
                      <Badge key={status} variant="outline" className="text-xs">
                        {status}: {count}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  {job.status === 'running' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startProcessing(job.id)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Process Next Batch
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => pauseJob(job.id)}
                      >
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                    </>
                  )}
                  
                  {job.status === 'paused' && (
                    <Button
                      size="sm"
                      onClick={() => resumeJob(job.id)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Resume
                    </Button>
                  )}
                  
                  {(job.status === 'pending' || job.status === 'failed') && (
                    <Button
                      size="sm"
                      onClick={() => startProcessing(job.id)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start Processing
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Generation Jobs</h3>
            <p className="text-muted-foreground mb-4">
              Create your first automated slide generation job to get started.
            </p>
            <Button onClick={createNewJob} disabled={isCreatingJob}>
              Create Generation Job
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};