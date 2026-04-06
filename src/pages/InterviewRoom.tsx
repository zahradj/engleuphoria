import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { JitsiMeeting } from '@/components/video';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle, Mic, Camera, MonitorPlay, Star } from 'lucide-react';
import { toast } from 'sonner';

interface Interview {
  id: string;
  application_id: string;
  admin_id: string;
  teacher_email: string;
  teacher_name: string;
  scheduled_at: string;
  duration_minutes: number;
  room_token: string;
  status: string;
  admin_notes: string | null;
  checklist: Record<string, boolean | null>;
  hub_type: string | null;
}

const InterviewRoom = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notes, setNotes] = useState('');
  const [checklist, setChecklist] = useState({
    energy_level: false,
    subject_knowledge: false,
    tech_stability: false,
    demo_performance: false,
  });
  const [showApprovalPrompt, setShowApprovalPrompt] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (token) fetchInterview();
  }, [token]);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      setIsAdmin(!!data);
    };
    checkAdmin();
  }, [user]);

  const fetchInterview = async () => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('room_token', token)
        .single();

      if (error) throw error;
      setInterview(data);
      setNotes(data.admin_notes || '');
      if (data.checklist) {
        setChecklist({
          energy_level: data.checklist.energy_level ?? false,
          subject_knowledge: data.checklist.subject_knowledge ?? false,
          tech_stability: data.checklist.tech_stability ?? false,
          demo_performance: data.checklist.demo_performance ?? false,
        });
      }
    } catch (error) {
      console.error('Error fetching interview:', error);
      toast.error('Interview not found or access denied.');
    } finally {
      setLoading(false);
    }
  };

  const updateInterview = async (updates: Record<string, any>) => {
    if (!interview) return;
    const { error } = await supabase
      .from('interviews')
      .update(updates)
      .eq('id', interview.id);
    if (error) {
      console.error('Error updating interview:', error);
      toast.error('Failed to save changes');
    }
  };

  const handleChecklistChange = (key: string, checked: boolean) => {
    const updated = { ...checklist, [key]: checked };
    setChecklist(updated);
    updateInterview({ checklist: updated });
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
  };

  const saveNotes = () => {
    updateInterview({ admin_notes: notes });
    toast.success('Notes saved');
  };

  const handleApprove = async () => {
    if (!interview) return;
    setActionLoading(true);
    try {
      // Update interview status
      await updateInterview({ status: 'passed', admin_notes: notes, checklist });

      // Update teacher application to approved
      const { error } = await supabase
        .from('teacher_applications')
        .update({ current_stage: 'approved', status: 'accepted' })
        .eq('id', interview.application_id);

      if (error) throw error;

      toast.success('🎉 Teacher Approved! They are now active and bookable.');
      setShowApprovalPrompt(false);
      navigate('/super-admin');
    } catch (error) {
      console.error('Error approving:', error);
      toast.error('Failed to approve teacher');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!interview) return;
    setActionLoading(true);
    try {
      await updateInterview({ status: 'failed', admin_notes: notes, checklist });

      const { error } = await supabase
        .from('teacher_applications')
        .update({ current_stage: 'rejected', status: 'rejected' })
        .eq('id', interview.application_id);

      if (error) throw error;

      toast.success('Application rejected.');
      navigate('/super-admin');
    } catch (error) {
      console.error('Error rejecting:', error);
      toast.error('Failed to reject');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCallEnd = () => {
    if (isAdmin) {
      setShowApprovalPrompt(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Interview Not Found</h2>
            <p className="text-muted-foreground">This interview link is invalid or has expired.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayName = isAdmin ? 'Admin Interviewer' : interview.teacher_name;
  const userRole = isAdmin ? 'teacher' : 'student'; // admin gets moderator controls

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Video Area */}
      <div className={`flex-1 flex flex-col ${isAdmin ? 'mr-80' : ''}`}>
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h1 className="text-white font-semibold">
              EnglEuphoria Interview
            </h1>
            <Badge variant="secondary" className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30">
              {interview.hub_type || 'General'}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span className="flex items-center gap-1"><Mic className="h-4 w-4" /> Audio</span>
            <span className="flex items-center gap-1"><Camera className="h-4 w-4" /> Video</span>
            <span className="flex items-center gap-1"><MonitorPlay className="h-4 w-4" /> Screen</span>
          </div>
        </div>

        {/* Jitsi Video */}
        <div className="flex-1">
          <JitsiMeeting
            roomName={`engleuphoria-interview-${interview.room_token}`}
            displayName={displayName}
            userRole={userRole}
            onReadyToClose={handleCallEnd}
            className="w-full h-full"
          />
        </div>

        {/* Teacher Welcome Banner (non-admin) */}
        {!isAdmin && (
          <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-t border-indigo-500/20 px-6 py-3">
            <p className="text-indigo-200 text-sm text-center">
              Welcome to your EnglEuphoria interview, <strong>{interview.teacher_name}</strong>! 
              Your interviewer will join shortly. Test your camera and mic while you wait.
            </p>
          </div>
        )}
      </div>

      {/* Admin Evaluation Sidebar */}
      {isAdmin && (
        <div className="w-80 fixed right-0 top-0 bottom-0 bg-gray-900 border-l border-gray-800 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Teacher Info */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">{interview.teacher_name}</CardTitle>
                <p className="text-gray-400 text-sm">{interview.teacher_email}</p>
              </CardHeader>
              <CardContent>
                <Badge className="bg-indigo-600">{interview.hub_type || 'General'} Hub</Badge>
              </CardContent>
            </Card>

            {/* Vetting Checklist */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Vetting Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { key: 'energy_level', label: '⚡ Energy Level' },
                  { key: 'subject_knowledge', label: '📚 Subject Knowledge' },
                  { key: 'tech_stability', label: '🖥️ Tech Stability' },
                  { key: 'demo_performance', label: '🎭 Demo Performance' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-3">
                    <Checkbox
                      id={key}
                      checked={checklist[key as keyof typeof checklist]}
                      onCheckedChange={(checked) => handleChecklistChange(key, !!checked)}
                    />
                    <Label htmlFor={key} className="text-gray-300 cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Admin Notes */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-base">Interview Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Notes about the candidate..."
                  className="bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-500 min-h-[120px]"
                />
                <Button size="sm" variant="secondary" className="mt-2 w-full" onClick={saveNotes}>
                  Save Notes
                </Button>
              </CardContent>
            </Card>

            {/* Verdict Buttons */}
            <div className="space-y-2 pt-2">
              <Button
                onClick={handleApprove}
                disabled={actionLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Approve Teacher
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={actionLoading}
                className="w-full"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>

          {/* Approval Confirmation Overlay */}
          {showApprovalPrompt && (
            <div className="absolute inset-0 bg-gray-900/95 flex items-center justify-center p-6">
              <Card className="bg-gray-800 border-gray-700 w-full">
                <CardContent className="pt-6 text-center space-y-4">
                  <h3 className="text-xl font-bold text-white">Interview Complete</h3>
                  <p className="text-gray-400">What's your verdict on {interview.teacher_name}?</p>
                  <div className="space-y-2">
                    <Button
                      onClick={handleApprove}
                      disabled={actionLoading}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                      Approve as Teacher
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={actionLoading}
                      className="w-full"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Application
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-gray-400"
                      onClick={() => setShowApprovalPrompt(false)}
                    >
                      Decide Later
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InterviewRoom;
