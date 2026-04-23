import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Logo } from '@/components/Logo';
import {
  Eye,
  GripVertical,
  Video,
  CalendarCheck,
  XCircle,
  CheckCircle,
  Loader2,
  Mail,
  Phone,
  Globe,
  GraduationCap,
  User,
  Send,
  Trash2,
  FileDown,
  MessageSquare,
  Clock,
  Search,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { VideoReviewPanel } from './VideoReviewPanel';

interface TeacherApplication {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  nationality: string | null;
  phone: string | null;
  bio: string | null;
  education: string | null;
  teaching_experience_years: number | null;
  esl_certification: string | null;
  teaching_philosophy: string | null;
  teaching_methodology: string | null;
  classroom_management: string | null;
  video_description: string | null;
  preferred_age_groups: string[] | null;
  professional_photo_url?: string;
  cv_url?: string | null;
  current_stage: string;
  status: string;
  created_at: string;
  updated_at: string;
  availability: string | null;
  cover_letter: string | null;
  motivation: string | null;
  certifications: string[] | null;
  languages_spoken: string[] | null;
  video_url?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  borderColor: string;
  stages: string[];
}

const COLUMNS: KanbanColumn[] = [
  {
    id: 'applied',
    title: 'Applied',
    color: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-300 dark:border-blue-700',
    stages: ['application_submitted', 'application_received'],
  },
  {
    id: 'screening',
    title: 'Screening',
    color: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-300 dark:border-amber-700',
    stages: ['under_review', 'documents_review'],
  },
  {
    id: 'interview',
    title: 'Interview Scheduled',
    color: 'bg-indigo-50 dark:bg-indigo-950/30',
    borderColor: 'border-indigo-300 dark:border-indigo-700',
    stages: ['interview_pending', 'interview_scheduled', 'interview_completed'],
  },
  {
    id: 'hired',
    title: 'Hired ✅',
    color: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-300 dark:border-emerald-700',
    stages: ['approved'],
  },
];

const ageGroupLabels: Record<string, string> = {
  kids: '👶 Kids (4-11)',
  teens: '🎓 Teens (12-17)',
  adults: '💼 Adults (18+)',
  all: '🌟 All Ages',
};

const getDisplayName = (app: TeacherApplication | null) => {
  if (!app) return 'Unknown';
  return `${app.first_name || ''} ${app.last_name || ''}`.trim() || 'Unknown';
};

export const HiringKanbanBoard: React.FC = () => {
  const [applications, setApplications] = useState<TeacherApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<TeacherApplication | null>(null);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [draggedApp, setDraggedApp] = useState<TeacherApplication | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [emailTemplate, setEmailTemplate] = useState({
    meetingLink: '',
    useInternalRoom: true,
    body: '',
  });

  const fetchApplications = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_applications')
        .select('*')
        .neq('current_stage', 'rejected')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const getColumnApps = (column: KanbanColumn) => {
    let apps = applications.filter((app) => column.stages.includes(app.current_stage));
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      apps = apps.filter(
        (app) =>
          getDisplayName(app).toLowerCase().includes(term) ||
          app.email.toLowerCase().includes(term)
      );
    }
    return apps;
  };

  // Drag & drop handlers
  const handleDragStart = (app: TeacherApplication) => {
    setDraggedApp(app);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (columnId: string) => {
    setDragOverColumn(null);
    if (!draggedApp) return;

    const currentColumn = COLUMNS.find((c) => c.stages.includes(draggedApp.current_stage));
    if (currentColumn?.id === columnId) {
      setDraggedApp(null);
      return;
    }

    // Handle interview scheduling via drag
    if (columnId === 'interview') {
      openInterviewDialog(draggedApp);
      setDraggedApp(null);
      return;
    }

    // Handle screening move
    if (columnId === 'screening') {
      try {
        await supabase
          .from('teacher_applications')
          .update({ current_stage: 'documents_review', status: 'under_review' })
          .eq('id', draggedApp.id);
        toast.success(`${getDisplayName(draggedApp)} moved to Screening`);
        fetchApplications();
      } catch {
        toast.error('Failed to update');
      }
    }

    setDraggedApp(null);
  };

  const openInterviewDialog = (app: TeacherApplication) => {
    setEmailTemplate({
      meetingLink: '',
      useInternalRoom: true,
      body: `Dear ${app.first_name || getDisplayName(app).split(' ')[0]},\n\nThank you for your interest in joining EnglEuphoria!\n\nWe have reviewed your application and are pleased to invite you for an interview.\n\nThe interview will last approximately 15 minutes and will include:\n• Discussion of your teaching experience\n• A brief demo lesson (5 minutes)\n• Q&A about our platform\n\nWe look forward to speaking with you!\n\nBest regards,\nThe EnglEuphoria Hiring Team`,
    });
    setSelectedApp(app);
    setShowInterviewDialog(true);
  };

  const confirmInterviewInvitation = async () => {
    if (!selectedApp) return;
    setActionLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const adminId = userData.user?.id;
      if (!adminId) {
        toast.error('You must be logged in');
        return;
      }

      const ageGroup = selectedApp.preferred_age_groups?.[0] || 'adults';
      const hubType = ageGroup === 'kids' ? 'Playground' : ageGroup === 'teens' ? 'Academy' : 'Professional';

      // Step 1: Create a demo classroom session first
      const classroomRoomId = `demo-${selectedApp.id}-${Date.now()}`;
      const { error: classroomError } = await supabase
        .from('classroom_sessions')
        .insert({
          room_id: classroomRoomId,
          teacher_id: adminId,
          session_status: 'waiting',
          lesson_title: 'Demo Lesson — Teacher Interview',
          session_context: { type: 'demo_interview', application_id: selectedApp.id, hub_type: hubType },
        });

      if (classroomError) {
        console.error('Classroom creation error:', classroomError);
      }

      // Step 2: Build the classroom link
      const classroomLink = `https://engleuphoria.com/classroom/${classroomRoomId}`;

      // Step 3: Create interview record with the classroom link
      const { data: interviewData, error: interviewError } = await supabase
        .from('interviews')
        .insert({
          application_id: selectedApp.id,
          admin_id: adminId,
          teacher_email: selectedApp.email,
          teacher_name: getDisplayName(selectedApp),
          scheduled_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          hub_type: hubType,
        })
        .select('room_token')
        .single();

      if (interviewError) throw interviewError;

      // Step 4: Update application stage
      await supabase
        .from('teacher_applications')
        .update({ current_stage: 'interview_scheduled', status: 'under_review' })
        .eq('id', selectedApp.id);

      // Step 5: Send the email with the classroom link (not interview room)
      const meetingLink = emailTemplate.useInternalRoom ? classroomLink : emailTemplate.meetingLink;

      try {
        await supabase.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'interview-invitation-branded',
            recipientEmail: selectedApp.email,
            idempotencyKey: `interview-invite-${selectedApp.id}-${Date.now()}`,
            templateData: {
              candidateName: selectedApp.first_name || getDisplayName(selectedApp).split(' ')[0],
              meetingLink,
              applicationId: selectedApp.id,
            },
          },
        });
      } catch (emailError) {
        console.log('Email sending fallback:', emailError);
      }

      toast.success('Interview Scheduled & Invitation Sent! 📨', {
        description: `${getDisplayName(selectedApp)} has been invited.`,
        duration: 5000,
      });
      setShowInterviewDialog(false);
      setSelectedApp(null);
      fetchApplications();
    } catch (error) {
      console.error('Error scheduling interview:', error);
      toast.error('Failed to schedule interview');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    setActionLoading(true);
    try {
      await supabase
        .from('teacher_applications')
        .update({ current_stage: 'rejected', status: 'rejected', rejection_reason: rejectionReason })
        .eq('id', selectedApp.id);

      toast.success('Application Rejected');
      setShowRejectDialog(false);
      setRejectionReason('');
      setSelectedApp(null);
      fetchApplications();
    } catch {
      toast.error('Failed to reject application');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFinalApprove = async (app: TeacherApplication) => {
    setActionLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('approve-teacher', {
        body: {
          applicationId: app.id,
          email: app.email,
          firstName: app.first_name,
          lastName: app.last_name,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success('Teacher Approved & Invited! 🎉', {
        description: `${getDisplayName(app)} will receive an email to set their password.`,
        duration: 5000,
      });
      setSelectedApp(null);
      fetchApplications();
    } catch (error: any) {
      console.error('Error approving:', error);
      toast.error('Failed to approve teacher', { description: error.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleResendInvite = async (app: TeacherApplication) => {
    try {
      const { data: interview } = await supabase
        .from('interviews')
        .select('id, room_token, hub_type')
        .eq('application_id', app.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!interview) {
        toast.error('No interview found');
        return;
      }

      const meetingLink = `https://engleuphoria.com/interview/${interview.room_token}`;
      await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'interview-invitation',
          recipientEmail: app.email,
          idempotencyKey: `interview-resend-${interview.id}-${Date.now()}`,
          templateData: {
            name: app.first_name || getDisplayName(app).split(' ')[0],
            hubType: interview.hub_type || 'Professional',
            meetingLink,
          },
        },
      });
      toast.success('Invitation resent! 📨');
    } catch {
      toast.error('Failed to resend invitation');
    }
  };

  const getVerificationBadge = (app: TeacherApplication) => {
    if (app.current_stage === 'approved') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Verified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-600 dark:text-red-400">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        Unverified
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size="small" />
          <div>
            <h1 className="text-2xl font-bold text-[#6B21A8]">Hiring Pipeline</h1>
            <p className="text-sm text-muted-foreground">
              Drag candidates between stages · {applications.length} total applicants
            </p>
          </div>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4 min-h-[600px]">
        {COLUMNS.map((column) => {
          const columnApps = getColumnApps(column);
          const isOver = dragOverColumn === column.id;

          return (
            <div
              key={column.id}
              className={`rounded-xl border-2 ${column.borderColor} ${column.color} p-3 transition-all ${
                isOver ? 'ring-2 ring-primary scale-[1.01]' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(column.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-foreground">{column.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {columnApps.length}
                </Badge>
              </div>

              <div className="space-y-2 min-h-[200px]">
                {columnApps.map((app) => (
                  <Card
                    key={app.id}
                    draggable
                    onDragStart={() => handleDragStart(app)}
                    className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow border bg-card"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground/50 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={app.professional_photo_url} />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {getDisplayName(app).charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{getDisplayName(app)}</p>
                              {getVerificationBadge(app)}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{app.email}</p>
                          {app.teaching_experience_years && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {app.teaching_experience_years}y exp ·{' '}
                              {app.preferred_age_groups?.[0]
                                ? ageGroupLabels[app.preferred_age_groups[0]]?.split(' ')[0]
                                : ''}
                            </p>
                          )}
                          <div className="flex gap-1 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => setSelectedApp(app)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            {column.id === 'applied' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-emerald-600"
                                onClick={() => openInterviewDialog(app)}
                              >
                                <CalendarCheck className="h-3 w-3" />
                              </Button>
                            )}
                            {column.id === 'interview' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => handleResendInvite(app)}
                                >
                                  <Send className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs text-emerald-600"
                                  onClick={() => handleFinalApprove(app)}
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {columnApps.length === 0 && (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg opacity-40">
                    <p className="text-xs text-muted-foreground">Drop here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedApp && !showInterviewDialog && !showRejectDialog}
        onOpenChange={() => setSelectedApp(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedApp && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedApp.professional_photo_url} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {getDisplayName(selectedApp).charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl flex items-center gap-3">
                      {getDisplayName(selectedApp)}
                      {getVerificationBadge(selectedApp)}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {selectedApp.email}
                      </span>
                      {selectedApp.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {selectedApp.phone}
                        </span>
                      )}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Nationality</p>
                    <p className="font-medium text-sm">{selectedApp.nationality || 'N/A'}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="font-medium text-sm">{selectedApp.teaching_experience_years}y</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Age Group</p>
                    <p className="font-medium text-sm">
                      {selectedApp.preferred_age_groups
                        ?.map((g) => ageGroupLabels[g] || g)
                        .join(', ') || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Applied</p>
                    <p className="font-medium text-sm">
                      {format(new Date(selectedApp.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>

                {selectedApp.bio && (
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-1 text-sm">
                      <User className="h-4 w-4" /> Bio
                    </h4>
                    <p className="text-sm text-muted-foreground">{selectedApp.bio}</p>
                  </div>
                )}

                {selectedApp.teaching_philosophy && (
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-1 text-sm">
                      <MessageSquare className="h-4 w-4" /> Teaching Philosophy
                    </h4>
                    <p className="text-sm text-muted-foreground">{selectedApp.teaching_philosophy}</p>
                  </div>
                )}

                {selectedApp.education && (
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-1 text-sm">
                      <GraduationCap className="h-4 w-4" /> Education
                    </h4>
                    <p className="text-sm text-muted-foreground">{selectedApp.education}</p>
                    {selectedApp.esl_certification && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {selectedApp.esl_certification}
                      </Badge>
                    )}
                  </div>
                )}

                {selectedApp.cv_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        const url = selectedApp.cv_url!;
                        const pathMatch = url.match(/\/object\/public\/teacher-applications\/(.+)$/);
                        if (pathMatch) {
                          const { data, error } = await supabase.storage
                            .from('teacher-applications')
                            .download(pathMatch[1]);
                          if (error) throw error;
                          const blobUrl = URL.createObjectURL(data);
                          const a = document.createElement('a');
                          a.href = blobUrl;
                          a.download = pathMatch[1].split('/').pop() || 'cv';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(blobUrl);
                        }
                      } catch {
                        toast.error('Failed to download CV');
                      }
                    }}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Download CV
                  </Button>
                )}

                {selectedApp.video_url && (
                  <VideoReviewPanel
                    teacherProfileId={selectedApp.id}
                    teacherUserId={selectedApp.id}
                    teacherName={getDisplayName(selectedApp)}
                    teacherEmail={selectedApp.email}
                    videoUrl={selectedApp.video_url}
                    videoStatus={(selectedApp as any).video_status || 'pending'}
                    onStatusChange={fetchApplications}
                  />
                )}
              </div>

              <DialogFooter className="gap-2 mt-4">
                {['application_submitted', 'application_received', 'under_review', 'documents_review'].includes(
                  selectedApp.current_stage
                ) && (
                  <>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowRejectDialog(true)}
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => openInterviewDialog(selectedApp)}
                    >
                      <CalendarCheck className="h-4 w-4 mr-1" /> Schedule Interview
                    </Button>
                  </>
                )}
                {['interview_pending', 'interview_scheduled', 'interview_completed'].includes(
                  selectedApp.current_stage
                ) && (
                  <>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowRejectDialog(true)}
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleFinalApprove(selectedApp)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      )}
                      Approve as Teacher
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {getDisplayName(selectedApp)}'s application.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Reason for rejection (optional)..."
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <XCircle className="h-4 w-4 mr-1" />}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Interview Dialog */}
      <Dialog open={showInterviewDialog} onOpenChange={setShowInterviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-emerald-600" />
              Send Interview Invitation
            </DialogTitle>
            <DialogDescription>
              Review and send the interview invitation to {getDisplayName(selectedApp)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-lg p-3 flex items-center gap-3">
              <Video className="h-5 w-5 text-[#6B21A8]" />
              <div>
                <p className="font-medium text-sm">Internal Interview Room</p>
                <p className="text-xs text-muted-foreground">
                  A private EnglEuphoria interview room will be created automatically.
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Or use external link (optional)</label>
              <Input
                value={emailTemplate.meetingLink}
                onChange={(e) =>
                  setEmailTemplate((prev) => ({
                    ...prev,
                    meetingLink: e.target.value,
                    useInternalRoom: !e.target.value,
                  }))
                }
                placeholder="Leave empty for internal room, or paste Zoom/Calendly link..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email Preview</label>
              <Textarea
                value={emailTemplate.body}
                onChange={(e) => setEmailTemplate((prev) => ({ ...prev, body: e.target.value }))}
                rows={8}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInterviewDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmInterviewInvitation}
              disabled={actionLoading}
              className="bg-[#6B21A8] hover:bg-[#6B21A8]/90"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Send className="h-4 w-4 mr-1" />
              )}
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
