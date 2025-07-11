import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  MessageSquare, 
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  Volume2
} from 'lucide-react';
import type { SpeakingClassroomSession, AIQuestionResponse, AITopicSuggestion } from '@/types/speaking-classroom';

interface ConversationTurn {
  question: string;
  response: string;
  timestamp: Date;
  analysis?: any;
}

export const SpeakingClassroomSessionComponent = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [session, setSession] = useState<SpeakingClassroomSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<AIQuestionResponse | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationTurn[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [currentResponse, setCurrentResponse] = useState('');
  const [sessionProgress, setSessionProgress] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const sessionStartRef = useRef<Date>(new Date());

  const topic: AITopicSuggestion | undefined = location.state?.topic;

  useEffect(() => {
    if (sessionId) {
      loadSession();
      startConversation();
    }
  }, [sessionId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - sessionStartRef.current.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadSession = async () => {
    try {
      const { data, error } = await supabase
        .from('speaking_classroom_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) throw error;
      setSession(data);
    } catch (error) {
      console.error('Error loading session:', error);
      toast({
        title: "Error",
        description: "Failed to load session. Please try again.",
        variant: "destructive"
      });
    }
  };

  const startConversation = async () => {
    if (!topic) return;

    try {
      const response = await supabase.functions.invoke('ai-question-leader', {
        body: {
          session_id: sessionId,
          topic: topic.topic,
          student_response: '', // Initial empty response
          conversation_history: [],
          cefr_level: session?.difficulty_level || 'A2',
          question_type: 'opening'
        }
      });

      if (response.error) throw response.error;
      setCurrentQuestion(response.data);
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudioResponse(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Failed to access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioResponse = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // For now, we'll simulate speech-to-text
      // In a real implementation, you'd use a speech-to-text service
      const mockTranscript = "This is a simulated response. In production, this would be the actual speech-to-text result.";
      
      await handleStudentResponse(mockTranscript);
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Error",
        description: "Failed to process audio. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStudentResponse = async (responseText: string) => {
    if (!currentQuestion || !responseText.trim()) return;

    const newTurn: ConversationTurn = {
      question: currentQuestion.question,
      response: responseText,
      timestamp: new Date()
    };

    setConversationHistory(prev => [...prev, newTurn]);
    setCurrentResponse('');

    // Generate next question
    try {
      const response = await supabase.functions.invoke('ai-question-leader', {
        body: {
          session_id: sessionId,
          topic: topic?.topic || session?.generated_topic,
          student_response: responseText,
          conversation_history: [...conversationHistory, newTurn],
          cefr_level: session?.difficulty_level || 'A2',
          question_type: 'follow_up'
        }
      });

      if (response.error) throw response.error;
      setCurrentQuestion(response.data);
      
      // Update session progress
      const newProgress = Math.min(((conversationHistory.length + 1) / 10) * 100, 100);
      setSessionProgress(newProgress);

      // Update session in database
      await supabase
        .from('speaking_classroom_sessions')
        .update({
          questions_answered: conversationHistory.length + 1,
          session_metadata: {
            ...session?.session_metadata,
            conversation_turns: conversationHistory.length + 1,
            last_response_at: new Date().toISOString()
          }
        })
        .eq('id', sessionId);

    } catch (error) {
      console.error('Error generating next question:', error);
      toast({
        title: "Error",
        description: "Failed to generate next question. Please try again.",
        variant: "destructive"
      });
    }
  };

  const endSession = async () => {
    try {
      const endTime = new Date();
      const durationSeconds = Math.floor((endTime.getTime() - sessionStartRef.current.getTime()) / 1000);

      await supabase
        .from('speaking_classroom_sessions')
        .update({
          ended_at: endTime.toISOString(),
          total_questions: conversationHistory.length,
          avg_response_time: durationSeconds / Math.max(conversationHistory.length, 1),
          session_metadata: {
            ...session?.session_metadata,
            final_conversation_count: conversationHistory.length,
            session_rating: 'completed'
          }
        })
        .eq('id', sessionId);

      toast({
        title: "Session Complete!",
        description: `Great job! You practiced for ${Math.floor(durationSeconds / 60)} minutes.`,
      });

      navigate('/speaking-classroom', {
        state: { sessionCompleted: true, duration: durationSeconds }
      });
    } catch (error) {
      console.error('Error ending session:', error);
      toast({
        title: "Error",
        description: "Failed to save session. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!session && !topic) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Loading session...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">AI Speaking Session</h1>
            <p className="text-muted-foreground">
              Topic: {topic?.topic || session?.generated_topic}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatTime(sessionDuration)}</span>
            </div>
            <Badge variant="secondary">
              {topic?.category || 'General'}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <Progress value={sessionProgress} className="h-2" />
          </div>
          <span className="text-sm text-muted-foreground">
            {conversationHistory.length}/10 questions
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Conversation Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Question */}
          {currentQuestion && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Current Question
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-4">{currentQuestion.question}</p>
                
                {currentQuestion.conversation_tips && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm font-medium mb-2">💡 Tips:</p>
                    <ul className="text-sm space-y-1">
                      {currentQuestion.conversation_tips.map((tip, i) => (
                        <li key={i}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recording Controls */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing}
                    className="flex items-center gap-2"
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="h-5 w-5" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="h-5 w-5" />
                        Start Recording
                      </>
                    )}
                  </Button>
                  
                  {conversationHistory.length > 0 && (
                    <Button variant="outline" onClick={endSession}>
                      End Session
                    </Button>
                  )}
                </div>

                {isRecording && (
                  <div className="flex items-center gap-2 text-destructive">
                    <div className="h-2 w-2 bg-destructive rounded-full animate-pulse"></div>
                    <span className="text-sm">Recording...</span>
                  </div>
                )}

                {isProcessing && (
                  <div className="flex items-center gap-2 text-primary">
                    <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-sm">Processing your response...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Text Input Alternative */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <label className="text-sm font-medium">
                  Or type your response:
                </label>
                <textarea
                  value={currentResponse}
                  onChange={(e) => setCurrentResponse(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={3}
                />
                <Button 
                  onClick={() => handleStudentResponse(currentResponse)}
                  disabled={!currentResponse.trim() || isProcessing}
                  className="w-full"
                >
                  Submit Response
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Session Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Questions Answered</span>
                <span className="font-semibold">{conversationHistory.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Speaking Time</span>
                <span className="font-semibold">{formatTime(sessionDuration)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Difficulty Level</span>
                <Badge variant="outline">
                  {topic?.difficulty || session?.difficulty_level}/5
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Topic Keywords */}
          {topic?.keywords && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Vocabulary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {topic.keywords.map((keyword, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conversation History */}
          {conversationHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Exchanges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {conversationHistory.slice(-3).map((turn, i) => (
                  <div key={i} className="space-y-2 pb-4 border-b last:border-b-0">
                    <div className="text-sm">
                      <p className="font-medium text-primary mb-1">Question:</p>
                      <p className="text-muted-foreground">{turn.question}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-secondary mb-1">Your Response:</p>
                      <p>{turn.response}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};