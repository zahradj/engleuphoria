
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SpeakingScenario, ConversationMessage, MessageFeedback } from '@/types/speaking';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { speakingPracticeService } from '@/services/speakingPracticeService';
import { useToast } from '@/hooks/use-toast';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  ArrowLeft, 
  Star, 
  RotateCcw, 
  Pause,
  Play,
  MessageCircle
} from 'lucide-react';

interface PracticeSessionProps {
  scenario: SpeakingScenario;
  onComplete: (sessionData: any) => void;
  onBack: () => void;
}

export const PracticeSession: React.FC<PracticeSessionProps> = ({
  scenario,
  onComplete,
  onBack
}) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [aiAvatar, setAiAvatar] = useState<string>('😊');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  
  const { recordingState, startRecording, stopRecording, processAudio, reset } = useSpeechRecognition();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSessionActive && sessionStartTime) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - sessionStartTime.getTime()) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSessionActive, sessionStartTime]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startSession = async () => {
    setIsSessionActive(true);
    setSessionStartTime(new Date());
    
    // Add initial AI message
    const welcomeMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: scenario.prompt,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    setAiAvatar('👋');
    
    // Simulate AI speech
    setTimeout(() => {
      setAiAvatar('😊');
      setIsAiSpeaking(false);
    }, 3000);
  };

  const handleVoiceInput = async () => {
    if (recordingState.isRecording) {
      stopRecording();
      
      // Process the recorded audio
      if (recordingState.audioBlob) {
        const transcript = await processAudio(recordingState.audioBlob);
        if (transcript.trim()) {
          await handleUserMessage(transcript);
        }
      }
    } else {
      startRecording();
    }
  };

  const handleUserMessage = async (text: string) => {
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Generate AI response and feedback
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(text);
      const feedback = generateFeedback(text);
      
      const aiMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      // Update user message with feedback
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, feedback }
          : msg
      ).concat([aiMessage]));

      setAiAvatar(getRandomAiAvatar());
    }, 1500);
  };

  const generateAIResponse = async (userInput: string): Promise<string> => {
    // Simulate AI conversation logic
    const responses = [
      "That's great! Can you tell me more about that?",
      "Interesting! What else would you like to share?",
      "I understand. How do you feel about that?",
      "That sounds wonderful! What happens next?",
      "Thank you for sharing. Can you describe it in more detail?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateFeedback = (text: string): MessageFeedback => {
    // Simulate pronunciation and grammar scoring
    const pronunciationScore = 0.7 + Math.random() * 0.3;
    const grammarScore = 0.6 + Math.random() * 0.4;
    
    const encouragements = [
      "Great pronunciation! 🌟",
      "Well done! 👏",
      "Keep it up! 💪",
      "Excellent effort! ⭐",
      "You're improving! 🎯"
    ];

    return {
      pronunciation_score: pronunciationScore,
      rating: Math.ceil(pronunciationScore * 5),
      encouragement: encouragements[Math.floor(Math.random() * encouragements.length)],
      grammar_suggestions: grammarScore < 0.8 ? ["Try using 'the' before nouns"] : [],
      alternative_phrases: ["You could also say: 'I really enjoy...'"]
    };
  };

  const getRandomAiAvatar = () => {
    const avatars = ['😊', '🤖', '👨‍🏫', '👩‍🏫', '😄', '🙂', '😌'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  const endSession = async () => {
    if (!sessionStartTime) return;

    const duration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
    const xpEarned = Math.max(10, Math.floor(duration / 30) * 5); // 5 XP per 30 seconds

    const sessionData = {
      student_id: 'current-user-id',
      session_type: scenario.type,
      scenario_name: scenario.name,
      cefr_level: scenario.cefr_level,
      duration_seconds: duration,
      xp_earned: xpEarned,
      overall_rating: 4 // Simulate good performance
    };

    try {
      await speakingPracticeService.createSession(sessionData);
      onComplete(sessionData);
    } catch (error) {
      console.error('Error saving session:', error);
      toast({
        title: "Session completed!",
        description: `Great job practicing! You earned ${xpEarned} XP.`
      });
      onComplete(sessionData);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isSessionActive) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Badge variant="outline">{scenario.cefr_level}</Badge>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-10 w-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">{scenario.name}</CardTitle>
            <p className="text-gray-600">{scenario.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">📝 What you'll practice:</h4>
              <p className="text-gray-700">{scenario.context_instructions}</p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>⏱️ Expected time: {Math.floor(scenario.expected_duration / 60)} minutes</span>
              <span>🎯 Difficulty: {scenario.difficulty_rating}/5</span>
            </div>

            <Button 
              onClick={startSession}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              size="lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Practice Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-6">
      {/* Session Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            End Session
          </Button>
          <Badge variant="outline">{scenario.cefr_level}</Badge>
          <span className="text-lg font-medium">{scenario.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg font-mono">{formatTime(elapsedTime)}</div>
          <Progress value={(elapsedTime / scenario.expected_duration) * 100} className="w-32" />
        </div>
      </div>

      {/* AI Avatar and Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* AI Avatar */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6 text-center">
            <div className="text-8xl mb-4">{aiAvatar}</div>
            <h3 className="font-medium">Your AI Teacher</h3>
            <p className="text-sm text-gray-600">Ready to help you practice!</p>
            {isAiSpeaking && (
              <div className="mt-4">
                <div className="flex justify-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">Speaking...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="lg:col-span-3">
          <CardContent className="pt-6">
            <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p>{message.content}</p>
                    {message.feedback && (
                      <div className="mt-2 pt-2 border-t border-blue-300">
                        <div className="flex items-center gap-2 mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < message.feedback!.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs">{message.feedback.encouragement}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Voice Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleVoiceInput}
                disabled={recordingState.isProcessing}
                className={`${
                  recordingState.isRecording
                    ? 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300'
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300'
                }`}
              >
                {recordingState.isRecording ? (
                  <>
                    <MicOff className="h-5 w-5 mr-2" />
                    Stop Recording
                  </>
                ) : recordingState.isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 mr-2" />
                    Hold to Speak
                  </>
                )}
              </Button>

              <Button variant="outline" onClick={endSession}>
                Finish Session
              </Button>
            </div>

            {recordingState.isRecording && (
              <div className="text-center mt-4">
                <div className="flex justify-center items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-600 font-medium">Recording... Speak clearly!</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
