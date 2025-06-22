
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Video, 
  Calendar,
  User,
  Mail,
  Phone,
  Globe,
  Award,
  Download
} from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";

interface TeacherApplication {
  id: string;
  email: string;
  full_name: string;
  nationality: string;
  time_zone: string;
  languages_spoken: string[];
  education_level: string;
  teaching_experience_years: number;
  target_age_group: string;
  intro_video_url?: string;
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
      setApplications(data || []);
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

  const updateApplicationStage = async (applicationId: string, stage: string, approved: boolean = false) => {
    try {
      const updateData: any = { current_stage: stage };
      
      if (stage === 'approved' && approved) {
        updateData.status = 'approved';
      } else if (stage === 'rejected') {
        updateData.status = 'rejected';
      }

      const { error } = await supabase
        .from('teacher_applications')
        .update(updateData)
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Application ${approved ? 'approved' : 'updated'} successfully`,
      });

      fetchApplications();
      setSelectedApplication(null);
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
              All Applications ({applications.length})
            </TabsTrigger>
            <TabsTrigger value="pending" onClick={() => setStatusFilter('application_submitted')}>
              Pending Review
            </TabsTrigger>
            <TabsTrigger value="approved" onClick={() => setStatusFilter('approved')}>
              Approved
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
                  {selectedApplication.intro_video_url && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Introduction Video
                      </Label>
                      <video 
                        src={selectedApplication.intro_video_url} 
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
                  <div className="flex gap-2">
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
                    {selectedApplication.current_stage !== 'equipment_test' && (
                      <Button
                        variant="outline"
                        onClick={() => updateApplicationStage(selectedApplication.id, 'equipment_test')}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Send to Equipment Test
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
