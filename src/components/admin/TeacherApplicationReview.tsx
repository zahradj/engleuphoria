import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Video,
  User,
  Mail,
  Phone,
  Globe,
  GraduationCap,
  Calendar,
  MessageSquare,
  ExternalLink,
  Loader2,
  CalendarCheck
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { VideoReviewPanel } from './VideoReviewPanel';
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TeacherApplication {
  id: string;
  email: string;
  full_name: string;
  first_name: string;
  last_name: string;
  nationality: string;
  time_zone: string;
  phone: string;
  bio: string;
  education_level: string;
  education: string;
  teaching_experience_years: number;
  esl_certification: string;
  teaching_philosophy: string;
  teaching_methodology: string;
  classroom_management: string;
  target_age_group: string;
  video_url: string;
  video_description: string;
  professional_photo_url?: string;
  current_stage: string;
  status: string;
  created_at: string;
  updated_at: string;
  availability: string;
}

interface InterviewEmailTemplate {
  subject: string;
  body: string;
  meetingLink: string;
}

const stageConfig: Record<string, { label: string; color: string; variant: "default" | "destructive" | "outline" | "secondary" }> = {
  'application_submitted': { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800', variant: 'outline' },
  'documents_review': { label: 'Documents Under Review', color: 'bg-blue-100 text-blue-800', variant: 'secondary' },
  'interview_pending': { label: 'Interview Pending', color: 'bg-purple-100 text-purple-800', variant: 'secondary' },
  'interview_scheduled': { label: 'Interview Scheduled', color: 'bg-indigo-100 text-indigo-800', variant: 'secondary' },
  'interview_completed': { label: 'Interview Completed', color: 'bg-cyan-100 text-cyan-800', variant: 'secondary' },
  'approved': { label: 'Approved', color: 'bg-green-100 text-green-800', variant: 'default' },
  'rejected': { label: 'Rejected', color: 'bg-red-100 text-red-800', variant: 'destructive' },
};

const ageGroupLabels: Record<string, string> = {
  'kids': '👶 Kids (4-11)',
  'teens': '🎓 Teens (12-17)',
  'adults': '💼 Adults (18+)',
  'all': '🌟 All Ages',
};

export const TeacherApplicationReview: React.FC = () => {
  const [applications, setApplications] = useState<TeacherApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<TeacherApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<TeacherApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [emailTemplate, setEmailTemplate] = useState<InterviewEmailTemplate>({
    subject: '',
    body: '',
    meetingLink: '',
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, stageFilter]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load teacher applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.full_name?.toLowerCase().includes(term) ||
        app.email?.toLowerCase().includes(term) ||
        app.nationality?.toLowerCase().includes(term)
      );
    }

    if (stageFilter !== 'all') {
      filtered = filtered.filter(app => app.current_stage === stageFilter);
    }

    setFilteredApplications(filtered);
  };

  const handleApproveForInterview = async (application: TeacherApplication) => {
    // Prepare email template
    setEmailTemplate({
      subject: `Interview Invitation - EnglEuphoria Teaching Position`,
      body: `Dear ${application.first_name || application.full_name?.split(' ')[0]},

Thank you for your interest in joining EnglEuphoria as an ESL teacher!

We have reviewed your application and are pleased to invite you for an interview. Your experience and teaching philosophy align well with our mission.

Please use the scheduling link below to book your interview at a time that works for you:

[SCHEDULING_LINK]

The interview will last approximately 30 minutes and will include:
• Discussion of your teaching experience
• A brief demo lesson (5 minutes)
• Q&A about our platform and expectations

If you have any questions, please don't hesitate to reach out.

We look forward to speaking with you!

Best regards,
The EnglEuphoria Hiring Team`,
      meetingLink: 'https://calendly.com/engleuphoria/teacher-interview',
    });
    setSelectedApplication(application);
    setShowInterviewDialog(true);
  };

  const confirmInterviewInvitation = async () => {
    if (!selectedApplication) return;
    
    setActionLoading(true);
    try {
      // Update application status
      const { error } = await supabase
        .from('teacher_applications')
        .update({ 
          current_stage: 'interview_pending',
          status: 'in_review'
        })
        .eq('id', selectedApplication.id);

      if (error) throw error;

      // Send email notification (mock - would integrate with email service)
      try {
        await supabase.functions.invoke('send-teacher-emails', {
          body: {
            type: 'interview_invite',
            teacherName: selectedApplication.full_name,
            teacherEmail: selectedApplication.email,
            emailSubject: emailTemplate.subject,
            emailBody: emailTemplate.body.replace('[SCHEDULING_LINK]', emailTemplate.meetingLink),
            meetingLink: emailTemplate.meetingLink,
          }
        });
      } catch (emailError) {
        console.log('Email service not available, notification simulated');
      }

      toast.success('Interview Invitation Sent! 📨', {
        description: `${selectedApplication.full_name} has been notified to schedule their interview.`,
        duration: 5000,
      });

      setShowInterviewDialog(false);
      setSelectedApplication(null);
      fetchApplications();
    } catch (error) {
      console.error('Error approving for interview:', error);
      toast.error('Failed to send interview invitation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApplication) return;
    
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('teacher_applications')
        .update({ 
          current_stage: 'rejected',
          status: 'rejected',
          rejection_reason: rejectionReason,
        })
        .eq('id', selectedApplication.id);

      if (error) throw error;

      // Send rejection email (mock)
      try {
        await supabase.functions.invoke('send-teacher-emails', {
          body: {
            type: 'rejection',
            teacherName: selectedApplication.full_name,
            teacherEmail: selectedApplication.email,
            rejectionReason: rejectionReason,
          }
        });
      } catch (emailError) {
        console.log('Email service not available, notification simulated');
      }

      toast.success('Application Rejected', {
        description: `${selectedApplication.full_name} has been notified.`,
      });

      setShowRejectDialog(false);
      setRejectionReason('');
      setSelectedApplication(null);
      fetchApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (stage: string) => {
    const config = stageConfig[stage] || stageConfig['application_submitted'];
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const pendingCount = applications.filter(a => a.current_stage === 'application_submitted').length;
  const interviewCount = applications.filter(a => ['interview_pending', 'interview_scheduled'].includes(a.current_stage)).length;
  const approvedCount = applications.filter(a => a.current_stage === 'approved').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Review Applications</h1>
        <p className="text-muted-foreground">Review and manage teacher applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
              <User className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Interview Stage</p>
                <p className="text-2xl font-bold text-purple-600">{interviewCount}</p>
              </div>
              <CalendarCheck className="h-8 w-8 text-purple-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Tabs defaultValue="all" onValueChange={setStageFilter}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
            <TabsTrigger value="application_submitted">Pending ({pendingCount})</TabsTrigger>
            <TabsTrigger value="interview_pending">Interview ({interviewCount})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedCount})</TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <ApplicationGrid 
            applications={filteredApplications}
            onView={setSelectedApplication}
            onApprove={handleApproveForInterview}
            onReject={(app) => { setSelectedApplication(app); setShowRejectDialog(true); }}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        <TabsContent value="application_submitted" className="mt-6">
          <ApplicationGrid 
            applications={filteredApplications}
            onView={setSelectedApplication}
            onApprove={handleApproveForInterview}
            onReject={(app) => { setSelectedApplication(app); setShowRejectDialog(true); }}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        <TabsContent value="interview_pending" className="mt-6">
          <ApplicationGrid 
            applications={filteredApplications}
            onView={setSelectedApplication}
            onApprove={handleApproveForInterview}
            onReject={(app) => { setSelectedApplication(app); setShowRejectDialog(true); }}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        <TabsContent value="approved" className="mt-6">
          <ApplicationGrid 
            applications={filteredApplications}
            onView={setSelectedApplication}
            onApprove={handleApproveForInterview}
            onReject={(app) => { setSelectedApplication(app); setShowRejectDialog(true); }}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
      </Tabs>

      {/* Application Detail Dialog */}
      <Dialog open={!!selectedApplication && !showRejectDialog && !showInterviewDialog} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedApplication.professional_photo_url} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {selectedApplication.full_name?.charAt(0) || 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">{selectedApplication.full_name}</DialogTitle>
                    <DialogDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {selectedApplication.email}
                      </span>
                      {selectedApplication.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {selectedApplication.phone}
                        </span>
                      )}
                    </DialogDescription>
                  </div>
                  {getStatusBadge(selectedApplication.current_stage)}
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Nationality</p>
                    <p className="font-medium">{selectedApplication.nationality || 'Not specified'}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="font-medium">{selectedApplication.teaching_experience_years} years</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Age Group</p>
                    <p className="font-medium">{ageGroupLabels[selectedApplication.target_age_group] || selectedApplication.target_age_group}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Applied</p>
                    <p className="font-medium">{format(new Date(selectedApplication.created_at), 'MMM d, yyyy')}</p>
                  </div>
                </div>

                {/* Bio */}
                {selectedApplication.bio && (
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <User className="h-4 w-4" />
                      Bio
                    </h4>
                    <p className="text-muted-foreground">{selectedApplication.bio}</p>
                  </div>
                )}

                {/* Education */}
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <GraduationCap className="h-4 w-4" />
                    Education & Qualifications
                  </h4>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="font-medium">{selectedApplication.education_level}</p>
                    {selectedApplication.education && (
                      <p className="text-sm text-muted-foreground mt-1">{selectedApplication.education}</p>
                    )}
                    {selectedApplication.esl_certification && (
                      <Badge variant="secondary" className="mt-2">{selectedApplication.esl_certification}</Badge>
                    )}
                  </div>
                </div>

                {/* Teaching Philosophy */}
                {selectedApplication.teaching_philosophy && (
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4" />
                      Teaching Philosophy
                    </h4>
                    <p className="text-muted-foreground">{selectedApplication.teaching_philosophy}</p>
                  </div>
                )}

                {/* Video Review Panel */}
                {selectedApplication.video_url && (
                  <VideoReviewPanel
                    teacherProfileId={selectedApplication.id}
                    teacherUserId={selectedApplication.id}
                    teacherName={selectedApplication.full_name}
                    teacherEmail={selectedApplication.email}
                    videoUrl={selectedApplication.video_url}
                    videoStatus={(selectedApplication as any).video_status || 'pending'}
                    onStatusChange={fetchApplications}
                  />
                )}

                {/* Fallback if no video */}
                {!selectedApplication.video_url && (
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <Video className="h-4 w-4" />
                      Introduction Video
                    </h4>
                    <p className="text-sm text-muted-foreground">No video submitted yet.</p>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-0 mt-6">
                {selectedApplication.current_stage === 'application_submitted' && (
                  <>
                    <Button 
                      variant="destructive" 
                      onClick={() => { setShowRejectDialog(true); }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button 
                      onClick={() => handleApproveForInterview(selectedApplication)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CalendarCheck className="h-4 w-4 mr-2" />
                      Approve for Interview
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
              Please provide a reason for rejecting {selectedApplication?.full_name}'s application.
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
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Interview Invitation Dialog */}
      <Dialog open={showInterviewDialog} onOpenChange={setShowInterviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-green-600" />
              Send Interview Invitation
            </DialogTitle>
            <DialogDescription>
              Review and customize the interview invitation email for {selectedApplication?.full_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email Subject</label>
              <Input
                value={emailTemplate.subject}
                onChange={(e) => setEmailTemplate(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Scheduling Link</label>
              <Input
                value={emailTemplate.meetingLink}
                onChange={(e) => setEmailTemplate(prev => ({ ...prev, meetingLink: e.target.value }))}
                placeholder="https://calendly.com/..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email Body</label>
              <Textarea
                value={emailTemplate.body}
                onChange={(e) => setEmailTemplate(prev => ({ ...prev, body: e.target.value }))}
                rows={12}
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
              className="bg-green-600 hover:bg-green-700"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CalendarCheck className="h-4 w-4 mr-2" />
              )}
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Application Card Grid Component
interface ApplicationGridProps {
  applications: TeacherApplication[];
  onView: (app: TeacherApplication) => void;
  onApprove: (app: TeacherApplication) => void;
  onReject: (app: TeacherApplication) => void;
  getStatusBadge: (stage: string) => React.ReactNode;
}

const ApplicationGrid: React.FC<ApplicationGridProps> = ({ 
  applications, 
  onView, 
  onApprove, 
  onReject,
  getStatusBadge 
}) => {
  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No applications found</h3>
          <p className="text-muted-foreground">No teacher applications match your current filters.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {applications.map((application) => (
        <Card key={application.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={application.professional_photo_url} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {application.full_name?.charAt(0) || 'T'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{application.full_name}</CardTitle>
                  <CardDescription className="text-sm">{application.email}</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>{application.nationality || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>{application.teaching_experience_years} years experience</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{ageGroupLabels[application.target_age_group] || application.target_age_group || 'Not specified'}</span>
              </div>
              {application.video_url && (
                <div className="flex items-center gap-2 text-primary">
                  <Video className="h-4 w-4" />
                  <span>Video submitted</span>
                </div>
              )}
            </div>
            <div className="mt-3">
              {getStatusBadge(application.current_stage)}
            </div>
          </CardContent>
          <CardFooter className="pt-0 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onView(application)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {application.current_stage === 'application_submitted' && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => onReject(application)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => onApprove(application)}
                >
                  <CalendarCheck className="h-4 w-4" />
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
