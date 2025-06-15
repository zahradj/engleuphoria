
import { useRef, useEffect } from "react";
import { VideoRefs } from "../types";

// Now always assign stream to both refs, for proper local preview in solo session
export function useVideoRefs(media: any, isTeacher: boolean) {
  const teacherVideoRef = useRef<HTMLVideoElement>(null);
  const studentVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!media.stream) {
      if (teacherVideoRef.current) teacherVideoRef.current.srcObject = null;
      if (studentVideoRef.current) studentVideoRef.current.srcObject = null;
      return;
    }
    // Both teacher and student should see their own video if connected, regardless of role (single participant session)
    if (teacherVideoRef.current) {
      teacherVideoRef.current.srcObject = media.stream;
    }
    if (studentVideoRef.current) {
      studentVideoRef.current.srcObject = media.stream;
    }
    return () => {
      if (teacherVideoRef.current) teacherVideoRef.current.srcObject = null;
      if (studentVideoRef.current) studentVideoRef.current.srcObject = null;
    };
  }, [media.stream]);

  return { teacherVideoRef, studentVideoRef } as VideoRefs;
}
