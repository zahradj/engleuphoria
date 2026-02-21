import { useState, useRef, useCallback, useEffect } from 'react';

type DeviceStatus = 'idle' | 'checking' | 'passed' | 'failed';

interface PreFlightState {
  cameraStatus: DeviceStatus;
  micStatus: DeviceStatus;
  speakerStatus: DeviceStatus;
  videoStream: MediaStream | null;
  audioLevel: number;
  cameraError: string | null;
  micError: string | null;
  runCameraCheck: () => Promise<void>;
  runMicCheck: () => Promise<void>;
  confirmSpeaker: () => void;
  allPassed: boolean;
  cleanup: () => void;
}

export const usePreFlightCheck = (): PreFlightState => {
  const [cameraStatus, setCameraStatus] = useState<DeviceStatus>('idle');
  const [micStatus, setMicStatus] = useState<DeviceStatus>('idle');
  const [speakerStatus, setSpeakerStatus] = useState<DeviceStatus>('idle');
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>();
  const micStreamRef = useRef<MediaStream | null>(null);

  const runCameraCheck = useCallback(async () => {
    setCameraStatus('checking');
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      setCameraStatus('passed');
    } catch (err: any) {
      setCameraError(err.name === 'NotAllowedError'
        ? 'Camera permission denied. Please allow camera access in your browser settings.'
        : 'Camera not found. Please check your device.');
      setCameraStatus('failed');
    }
  }, []);

  const runMicCheck = useCallback(async () => {
    setMicStatus('checking');
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const update = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel((avg / 255) * 100);
        animFrameRef.current = requestAnimationFrame(update);
      };
      update();
      setMicStatus('passed');
    } catch (err: any) {
      setMicError(err.name === 'NotAllowedError'
        ? 'Microphone permission denied. Please allow mic access in your browser settings.'
        : 'Microphone not found. Please check your device.');
      setMicStatus('failed');
    }
  }, []);

  const confirmSpeaker = useCallback(() => {
    setSpeakerStatus('passed');
  }, []);

  const cleanup = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    if (videoStream) {
      videoStream.getTracks().forEach(t => t.stop());
    }
  }, [videoStream]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const allPassed = cameraStatus === 'passed' && micStatus === 'passed';

  return {
    cameraStatus,
    micStatus,
    speakerStatus,
    videoStream,
    audioLevel,
    cameraError,
    micError,
    runCameraCheck,
    runMicCheck,
    confirmSpeaker,
    allPassed,
    cleanup,
  };
};
