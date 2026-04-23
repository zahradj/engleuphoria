import { useEffect, useState, useCallback } from "react";

export interface MediaDevicesState {
  cameras: MediaDeviceInfo[];
  microphones: MediaDeviceInfo[];
  selectedCameraId: string | null;
  selectedMicId: string | null;
}

const CAMERA_KEY = "preferredCameraId";
const MIC_KEY = "preferredMicId";

/**
 * Lists available cameras and microphones. If labels are empty (the page hasn't
 * yet been granted permission) we fire a one-shot getUserMedia({ audio, video })
 * and immediately stop the tracks so subsequent enumerateDevices() returns
 * useful labels — without this the dropdown shows "Camera 1 / Camera 2".
 */
export function useMediaDevices() {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(() => localStorage.getItem(CAMERA_KEY));
  const [selectedMicId, setSelectedMicId] = useState<string | null>(() => localStorage.getItem(MIC_KEY));

  const enumerate = useCallback(async (forcePermissionPrompt = false) => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      let devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices.filter((d) => d.kind === "videoinput");
      const mics = devices.filter((d) => d.kind === "audioinput");

      // Labels are empty until the user grants permission. Trigger a one-shot
      // permission request so the dropdown can show real device names.
      const labelsMissing = (cams.length > 0 && cams.every((d) => !d.label)) ||
                            (mics.length > 0 && mics.every((d) => !d.label));

      if (forcePermissionPrompt || labelsMissing) {
        try {
          const probe = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
          probe.getTracks().forEach((t) => t.stop());
          devices = await navigator.mediaDevices.enumerateDevices();
        } catch {
          // User denied — keep the unlabeled list rather than crashing.
        }
      }

      const finalCams = devices.filter((d) => d.kind === "videoinput");
      const finalMics = devices.filter((d) => d.kind === "audioinput");
      setCameras(finalCams);
      setMicrophones(finalMics);

      // Initialize selections if none.
      if (!selectedCameraId && finalCams.length > 0) setSelectedCameraId(finalCams[0].deviceId || null);
      if (!selectedMicId && finalMics.length > 0) setSelectedMicId(finalMics[0].deviceId || null);
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

  /** Force a permission prompt + re-enumeration so labels populate. */
  const refreshDevices = useCallback(() => enumerate(true), [enumerate]);

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
