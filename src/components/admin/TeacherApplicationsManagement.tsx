
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Check, X, Calendar, User, FileText, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from 'date-fns';

export const TeacherApplicationsManagement = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      let query = supabase
        .from('teacher_applications')
        .select(`
          *,
          teacher_equipment_tests(*),
          teacher_interviews(*)
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error fetching applications",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string, notes?: string) => {
    try {
      const updates: any = { status };
      
      if (status === 'approved') {
        updates.current_stage = 'approved';
        updates.intro_video_approved = true;
        updates.documents_approved = true;
      } else if (status === 'rejected') {
        updates.current_stage = 'rejected';
      }

      if (notes) {
        updates.admin_notes = notes;
      }

      const { error } = await supabase
        .from('teacher_applications')
        .update(updates)
        .eq('id', applicationId);

      if (error) throw error;

      // If approved, create user account and teacher profile
      if (status === 'approved') {
        const application = applications.find(app => app.id === applicationId);
        if (application) {
          await createTeacherAccount(application);
        }
      }

      toast({
        title: `Application ${status}`,
        description: `Teacher application has been ${status}.`
      });

      fetchApplications();
      setSelectedApplication(null);
      setReviewNotes('');

    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error updating application",
        variant: "destructive"
      });
    }
  };

  const createTeacherAccount = async (application: any) => {
    try {
      // Create user profile
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          email: application.email,
          full_name: `${application.first_name} ${application.last_name}`,
          role: 'teacher'
        }]);

      if (userError && !userError.message.includes('duplicate')) {
        throw userError;
      }

      // Create teacher profile
      const { error: profileError } = await supabase
        .from('teacher_profiles')
        .insert([{
          user_id: application.id, // This would need to be the actual user ID
          bio: application.cover_letter?.substring(0, 500),
          years_experience: application.teaching_experience_years || 0,
          specializations: application.skills || [],
          languages_spoken: application.languages_spoken || [],
          timezone: 'UTC', // Default timezone
          is_available: true
        }]);

      if (profileError && !profileError.message.includes('duplicate')) {
        throw profileError;
      }

    } catch (error) {
      console.error('Error creating teacher account:', error);
      // Don't fail the approval process if account creation fails
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'outline',
      approved: 'default',
      rejected: 'destructive',
      interview_scheduled: 'secondary'
    };
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  const getStageBadge = (stage: string) => {
    const colors = {
      application_submitted: 'bg-blue-100 text-blue-800',
      equipment_test: 'bg-yellow-100 text-yellow-800',
      interview_scheduled: 'bg-purple-100 text-purple-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return (
      <Badge className={colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {stage?.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Teacher Applications</CardTitle>
          <CardDescription>
            Manage and review teacher applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    {application.first_name} {application.last_name}
                  </TableCell>
                  <TableCell>{application.email}</TableCell>
                  <TableCell>
                    {application.teaching_experience_years || 0} years
                  </TableCell>
                  <TableCell>
                    {getStageBadge(application.current_stage)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(application.status)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(application.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Application Review - {application.first_name} {application.last_name}
                          </DialogTitle>
                          <DialogDescription>
                            Review and approve or reject this teacher application
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedApplication && (
                          <div className="space-y-6">
                            {/* Personal Information */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Personal Information</h4>
                                <div className="space-y-2 text-sm">
                                  <div><strong>Name:</strong> {selectedApplication.first_name} {selectedApplication.last_name}</div>
                                  <div><strong>Email:</strong> {selectedApplication.email}</div>
                                  <div><strong>Phone:</strong> {selectedApplication.phone || 'Not provided'}</div>
                                  <div><strong>Nationality:</strong> {selectedApplication.nationality || 'Not provided'}</div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Professional Background</h4>
                                <div className="space-y-2 text-sm">
                                  <div><strong>Experience:</strong> {selectedApplication.teaching_experience_years || 0} years</div>
                                  <div><strong>Education:</strong> {selectedApplication.education || 'Not provided'}</div>
                                  <div><strong>Certifications:</strong> {selectedApplication.certifications?.join(', ') || 'None'}</div>
                                </div>
                              </div>
                            </div>

                            {/* Cover Letter */}
                            {selectedApplication.cover_letter && (
                              <div>
                                <h4 className="font-semibold mb-2">Cover Letter</h4>
                                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                                  {selectedApplication.cover_letter}
                                </div>
                              </div>
                            )}

                            {/* Equipment Test Results */}
                            {selectedApplication.teacher_equipment_tests?.[0] && (
                              <div>
                                <h4 className="font-semibold mb-2">Equipment Test Results</h4>
                                <div className="grid grid-cols-4 gap-4 text-sm">
                                  <div className="text-center">
                                    <div className={`font-semibold ${selectedApplication.teacher_equipment_tests[0].microphone_test ? 'text-green-600' : 'text-red-600'}`}>
                                      {selectedApplication.teacher_equipment_tests[0].microphone_test ? '✓' : '✗'}
                                    </div>
                                    <div>Microphone</div>
                                  </div>
                                  <div className="text-center">
                                    <div className={`font-semibold ${selectedApplication.teacher_equipment_tests[0].webcam_test ? 'text-green-600' : 'text-red-600'}`}>
                                      {selectedApplication.teacher_equipment_tests[0].webcam_test ? '✓' : '✗'}
                                    </div>
                                    <div>Camera</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-blue-600">
                                      {selectedApplication.teacher_equipment_tests[0].download_speed || 'N/A'}
                                    </div>
                                    <div>Download (Mbps)</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-green-600">
                                      {selectedApplication.teacher_equipment_tests[0].upload_speed || 'N/A'}
                                    </div>
                                    <div>Upload (Mbps)</div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Admin Review */}
                            <div>
                              <h4 className="font-semibold mb-2">Admin Review</h4>
                              <Textarea
                                placeholder="Add review notes..."
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                className="mb-4"
                              />
                              <div className="flex gap-4">
                                <Button
                                  onClick={() => updateApplicationStatus(selectedApplication.id, 'approved', reviewNotes)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected', reviewNotes)}
                                  variant="destructive"
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
