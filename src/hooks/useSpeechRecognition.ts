
import { useState, useRef, useCallback } from 'react';
import { VoiceRecordingState } from '@/types/speaking';

export const useSpeechRecognition = () => {
  const [recordingState, setRecordingState] = useState<VoiceRecordingState>({
    isRecording: false,
    isProcessing: false
  });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordingState(prev => ({
          ...prev,
          isRecording: false,
          audioBlob
        }));
      };

      mediaRecorder.start();
      setRecordingState(prev => ({ ...prev, isRecording: true }));
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingState(prev => ({ ...prev, isRecording: false }));
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.stop();
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, [recordingState.isRecording]);

  const processAudio = useCallback(async (audioBlob: Blob): Promise<string> => {
    setRecordingState(prev => ({ ...prev, isProcessing: true }));

    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Audio = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      // Call Supabase edge function for speech-to-text
      const { data, error } = await supabase.functions.invoke('speech-to-text', {
        body: { audio: base64Audio }
      });

      if (error) throw error;

      const transcript = data.text || '';
      setRecordingState(prev => ({
        ...prev,
        isProcessing: false,
        transcript
      }));

      return transcript;
    } catch (error) {
      console.error('Error processing audio:', error);
      setRecordingState(prev => ({ ...prev, isProcessing: false }));
      return '';
    }
  }, []);

  const reset = useCallback(() => {
    setRecordingState({
      isRecording: false,
      isProcessing: false
    });
  }, []);

  return {
    recordingState,
    startRecording,
    stopRecording,
    processAudio,
    reset
  };
};
