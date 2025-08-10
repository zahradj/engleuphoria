import { useEffect, useState, useCallback } from "react";

export interface MediaDevicesState {
  cameras: MediaDeviceInfo[];
  microphones: MediaDeviceInfo[];
  selectedCameraId: string | null;
  selectedMicId: string | null;
}

const CAMERA_KEY = "preferredCameraId";
const MIC_KEY = "preferredMicId";

export function useMediaDevices() {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(() => localStorage.getItem(CAMERA_KEY));
  const [selectedMicId, setSelectedMicId] = useState<string | null>(() => localStorage.getItem(MIC_KEY));

  const enumerate = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices.filter((d) => d.kind === "videoinput");
      const mics = devices.filter((d) => d.kind === "audioinput");
      setCameras(cams);
      setMicrophones(mics);

      // Initialize selections if none
      if (!selectedCameraId && cams.length > 0) setSelectedCameraId(cams[0].deviceId || null);
      if (!selectedMicId && mics.length > 0) setSelectedMicId(mics[0].deviceId || null);
    } catch (e) {
      console.warn("Failed to enumerate devices", e);
    }
  }, [selectedCameraId, selectedMicId]);

  useEffect(() => {
    enumerate();
    const handleChange = () => enumerate();
    navigator.mediaDevices?.addEventListener?.("devicechange", handleChange);
    return () => navigator.mediaDevices?.removeEventListener?.("devicechange", handleChange);
  }, [enumerate]);

  useEffect(() => {
    if (selectedCameraId) localStorage.setItem(CAMERA_KEY, selectedCameraId);
  }, [selectedCameraId]);

  useEffect(() => {
    if (selectedMicId) localStorage.setItem(MIC_KEY, selectedMicId);
  }, [selectedMicId]);

  const refreshDevices = useCallback(() => enumerate(), [enumerate]);

  return {
    cameras,
    microphones,
    selectedCameraId,
    selectedMicId,
    setSelectedCameraId,
    setSelectedMicId,
    refreshDevices,
  };
}
