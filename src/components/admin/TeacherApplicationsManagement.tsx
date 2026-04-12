
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Video, 
  CalendarIcon,
  User,
  Mail,
  Phone,
  Globe,
  Award,
  Download,
  Send,
  Trash2,
  RefreshCw
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface TeacherApplication {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string; // computed
  nationality: string;
  time_zone: string;
  languages_spoken: string[];
  education_level: string;
  teaching_experience_years: number;
  target_age_group: string;
  video_url?: string;
  professional_photo_url?: string;
  certificates_urls: string[];
  current_stage: string;
  status: string;
  created_at: string;
  updated_at: string;
  intro_video_approved: boolean;
  documents_approved: boolean;
  equipment_test_passed: boolean;
  interview_passed: boolean;
}

export const TeacherApplicationsManagement = () => {
  const [applications, setApplications] = useState<TeacherApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<TeacherApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<TeacherApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState('');
  const [showInterviewScheduler, setShowInterviewScheduler] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Compute full_name from first_name + last_name
      const enriched = (data || []).map((app: any) => ({
        ...app,
        full_name: `${app.first_name || ''} ${app.last_name || ''}`.trim(),
      }));
      setApplications(enriched);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load teacher applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.current_stage === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const sendEmail = async (type: 'approval' | 'rejection' | 'interview_invite', application: TeacherApplication, interviewDate?: Date, interviewTime?: string, rejectionReason?: string) => {
    try {
      let templateName = '';
      let templateData: Record<string, any> = { name: application.full_name };

      if (type === 'approval') {
        templateName = 'final-welcome';
        templateData.hubType = application.target_age_group || 'General';
      } else if (type === 'rejection') {
        templateName = 'application-rejected';
        templateData.reason = rejectionReason;
      } else if (type === 'interview_invite') {
        templateName = 'interview-invitation';
        templateData.interviewDate = interviewDate ? format(interviewDate, 'EEEE, MMMM do, yyyy') : undefined;
        templateData.interviewTime = interviewTime;
      }

      const { error } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName,
          recipientEmail: application.email,
          idempotencyKey: `${templateName}-${application.id}`,
          templateData,
        }
      });

      if (error) throw error;

      toast({
        title: "Email Sent",
        description: `${type.replace('_', ' ')} email sent successfully to ${application.full_name}`,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Email Failed",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const scheduleInterview = async (application: TeacherApplication) => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for the interview",
        variant: "destructive",
      });
      return;
    }

    try {
      // Schedule interview in database
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(hours, minutes);

      const { error: interviewError } = await supabase
        .from('teacher_interviews')
        .insert([{
          application_id: application.id,
          scheduled_at: scheduledAt.toISOString(),
          duration: 20,
          interview_type: 'video_call',
          status: 'scheduled',
          zoom_link: `${window.location.origin}/interview-room/${application.id}`
        }]);

      if (interviewError) throw interviewError;

      // Update application stage
      const { error: updateError } = await supabase
        .from('teacher_applications')
        .update({ current_stage: 'interview_scheduled' })
        .eq('id', application.id);

      if (updateError) throw updateError;

      // Send interview email via dedicated Edge Function (handles system_emails logging)
      const { error: emailError } = await supabase.functions.invoke('send-interview-invite', {
        body: { applicationId: application.id }
      });

      if (emailError) {
        console.error('Interview email failed:', emailError);
        toast({
          title: "Interview Scheduled (email failed)",
          description: "Interview was scheduled but the invitation email could not be sent. Use 'Resend Invite' to try again.",
          variant: "destructive",
        });
      }

      toast({
        title: "Interview Scheduled",
        description: `Interview scheduled for ${application.full_name}`,
      });

      setShowInterviewScheduler(false);
      setSelectedDate(undefined);
      setSelectedTime('');
      fetchApplications();
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error scheduling interview:', error);
      toast({
        title: "Error",
        description: "Failed to schedule interview",
        variant: "destructive",
      });
    }
  };

  const deleteApplication = async (applicationId: string) => {
    try {
      // Delete related interviews first
      await supabase
        .from('teacher_interviews')
        .delete()
        .eq('application_id', applicationId);

      const { error } = await supabase
        .from('teacher_applications')
        .delete()
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Application Deleted",
        description: "The rejected application has been removed.",
      });

      fetchApplications();
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error deleting application:', error);
      toast({
        title: "Error",
        description: "Failed to delete application",
        variant: "destructive",
      });
    }
  };

  const resendInterviewInvite = async (application: TeacherApplication) => {
    try {
      // Fetch the interview details
      const { data: interview, error: fetchError } = await supabase
        .from('teacher_interviews')
        .select('*')
        .eq('application_id', application.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError || !interview) {
        toast({
          title: "No Interview Found",
          description: "No scheduled interview found for this applicant.",
          variant: "destructive",
        });
        return;
      }

      const interviewDate = new Date(interview.scheduled_at);
      const formattedDate = format(interviewDate, 'EEEE, MMMM do, yyyy');
      const formattedTime = format(interviewDate, 'HH:mm');

      // Use the dedicated Edge Function for proper logging and data lookup
      const { error } = await supabase.functions.invoke('send-interview-invite', {
        body: { applicationId: application.id }
      });

      if (error) throw error;

      toast({
        title: "Invitation Resent",
        description: `Interview invitation resent to ${application.first_name} ${application.last_name}`,
      });
    } catch (error) {
      console.error('Error resending invite:', error);
      toast({
        title: "Error",
        description: "Failed to resend interview invitation",
        variant: "destructive",
      });
    }
  };

  const updateApplicationStage = async (applicationId: string, stage: string, approved: boolean = false) => {
    const application = applications.find(app => app.id === applicationId);
    if (!application) return;

    try {
      const updateData: any = { current_stage: stage };
      
      if (stage === 'approved' && approved) {
        updateData.status = 'accepted';
      } else if (stage === 'rejected') {
        updateData.status = 'rejected';
      }

      const { error } = await supabase
        .from('teacher_applications')
        .update(updateData)
        .eq('id', applicationId);

      if (error) throw error;

      // Send appropriate email
      if (stage === 'approved' && approved) {
        await sendEmail('approval', application);
      } else if (stage === 'rejected') {
        await sendEmail('rejection', application, undefined, undefined, reviewNotes);
      }

      toast({
        title: "Success",
        description: `Application ${approved ? 'approved' : 'updated'} successfully`,
      });

      fetchApplications();
      setSelectedApplication(null);
      setReviewNotes('');
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error", 
        description: "Failed to update application",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (stage: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      'application_submitted': 'outline',
      'documents_review': 'secondary',
      'equipment_test': 'secondary',
      'interview_scheduled': 'secondary',
      'interview_completed': 'secondary',
      'final_review': 'secondary',
      'approved': 'default',
      'rejected': 'destructive'
    };

    return (
      <Badge variant={variants[stage] || 'outline'}>
        {stage.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Teacher Applications</h1>
        <p className="text-gray-600">Review and manage teacher applications</p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setStatusFilter('all')}>
              All ({applications.length})
            </TabsTrigger>
            <TabsTrigger value="pending" onClick={() => setStatusFilter('application_submitted')}>
              Pending
            </TabsTrigger>
            <TabsTrigger value="interview" onClick={() => setStatusFilter('interview_scheduled')}>
              Interviews ({applications.filter(a => a.current_stage === 'interview_scheduled').length})
            </TabsTrigger>
            <TabsTrigger value="approved" onClick={() => setStatusFilter('approved')}>
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" onClick={() => setStatusFilter('rejected')}>
              Rejected ({applications.filter(a => a.current_stage === 'rejected').length})
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {application.full_name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {application.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          {application.nationality}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(application.current_stage)}
                      {application.current_stage === 'interview_scheduled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resendInterviewInvite(application)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Resend Invite
                        </Button>
                      )}
                      {application.current_stage === 'rejected' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Application</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to permanently delete {application.full_name}'s application? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteApplication(application.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Experience:</span>
                      <p>{application.teaching_experience_years} years</p>
                    </div>
                    <div>
                      <span className="font-medium">Target Age:</span>
                      <p>{application.target_age_group}</p>
                    </div>
                    <div>
                      <span className="font-medium">Languages:</span>
                      <p>{application.languages_spoken?.join(', ') || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Applied:</span>
                      <p>{new Date(application.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredApplications.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                  <p className="text-gray-600">No teacher applications match your current filters.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedApplication.full_name}</CardTitle>
                  <CardDescription>{selectedApplication.email}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedApplication.current_stage)}
                  <Button variant="outline" onClick={() => setSelectedApplication(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Nationality</Label>
                  <p className="mt-1">{selectedApplication.nationality}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Time Zone</Label>
                  <p className="mt-1">{selectedApplication.time_zone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Education Level</Label>
                  <p className="mt-1">{selectedApplication.education_level}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Teaching Experience</Label>
                  <p className="mt-1">{selectedApplication.teaching_experience_years} years</p>
                </div>
              </div>

              {/* Languages and Target Age */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Languages Spoken</Label>
                  <p className="mt-1">{selectedApplication.languages_spoken?.join(', ') || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Target Age Group</Label>
                  <p className="mt-1">{selectedApplication.target_age_group}</p>
                </div>
              </div>

              {/* Media Files */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Application Materials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedApplication.video_url && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Introduction Video
                      </Label>
                      <video 
                        src={selectedApplication.video_url} 
                        controls 
                        className="w-full mt-2 rounded-lg"
                      />
                    </div>
                  )}
                  {selectedApplication.professional_photo_url && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Professional Photo</Label>
                      <img 
                        src={selectedApplication.professional_photo_url} 
                        alt="Professional photo"
                        className="w-full h-48 object-cover mt-2 rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Certificates */}
              {selectedApplication.certificates_urls && selectedApplication.certificates_urls.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Certificates & Documents
                  </Label>
                  <div className="mt-2 space-y-2">
                    {selectedApplication.certificates_urls.map((url, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Certificate {index + 1}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Actions */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Review Actions</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="review-notes">Review Notes</Label>
                    <Textarea
                      id="review-notes"
                      placeholder="Add notes about this application..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={() => updateApplicationStage(selectedApplication.id, 'approved', true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Application
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => updateApplicationStage(selectedApplication.id, 'rejected')}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Application
                    </Button>
                    {selectedApplication.current_stage !== 'equipment_test' && selectedApplication.current_stage !== 'interview_scheduled' && (
                      <Button
                        variant="outline"
                        onClick={() => updateApplicationStage(selectedApplication.id, 'equipment_test')}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Send to Equipment Test
                      </Button>
                    )}
                    {(selectedApplication.current_stage === 'equipment_test' || selectedApplication.current_stage === 'documents_review') && (
                      <Button
                        variant="outline"
                        onClick={() => setShowInterviewScheduler(true)}
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Schedule Interview
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Interview Scheduler Modal */}
      {showInterviewScheduler && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Schedule Interview</CardTitle>
              <CardDescription>
                Schedule an interview with {selectedApplication.full_name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Interview Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Interview Time</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  <option value="">Select time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowInterviewScheduler(false);
                    setSelectedDate(undefined);
                    setSelectedTime('');
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={() => scheduleInterview(selectedApplication)}>
                  <Send className="h-4 w-4 mr-2" />
                  Schedule & Send Invite
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
