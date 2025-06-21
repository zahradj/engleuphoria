
import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
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
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm'
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

      mediaRecorder.start(1000); // Capture data every second
      setRecordingState(prev => ({ ...prev, isRecording: true }));
      
      console.log('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingState(prev => ({ ...prev, isRecording: false }));
      throw error;
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.stop();
      console.log('Recording stopped');
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, [recordingState.isRecording]);

  const processAudio = useCallback(async (audioBlob: Blob): Promise<string> => {
    setRecordingState(prev => ({ ...prev, isProcessing: true }));

    try {
      console.log('Processing audio blob:', audioBlob.size, 'bytes');
      
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

      console.log('Calling speech-to-text function...');

      // Call Supabase edge function for speech-to-text
      const { data, error } = await supabase.functions.invoke('speech-to-text', {
        body: { audio: base64Audio }
      });

      if (error) {
        console.error('Speech-to-text error:', error);
        throw error;
      }

      const transcript = data.text || '';
      console.log('Transcription received:', transcript);
      
      setRecordingState(prev => ({
        ...prev,
        isProcessing: false,
        transcript
      }));

      return transcript;
    } catch (error) {
      console.error('Error processing audio:', error);
      setRecordingState(prev => ({ ...prev, isProcessing: false }));
      throw error;
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
