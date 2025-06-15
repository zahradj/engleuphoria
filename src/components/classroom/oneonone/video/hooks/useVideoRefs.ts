
import { useRef, useEffect } from "react";
import { VideoRefs } from "../types";

export function useVideoRefs(media: any, isTeacher: boolean) {
  const teacherVideoRef = useRef<HTMLVideoElement>(null);
  const studentVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log("🎥 useVideoRefs effect triggered:", {
      hasStream: !!media.stream,
      isConnected: media.isConnected,
      isCameraOff: media.isCameraOff
    });

    // Clear streams if no media stream
    if (!media.stream) {
      if (teacherVideoRef.current) {
        teacherVideoRef.current.srcObject = null;
        console.log("🎥 Cleared teacher video");
      }
      if (studentVideoRef.current) {
        studentVideoRef.current.srcObject = null;
        console.log("🎥 Cleared student video");
      }
      return;
    }

    // Assign stream to the appropriate video element based on user role
    if (isTeacher && teacherVideoRef.current) {
      teacherVideoRef.current.srcObject = media.stream;
      console.log("🎥 Assigned stream to teacher video");
    }
    
    if (!isTeacher && studentVideoRef.current) {
      studentVideoRef.current.srcObject = media.stream;
      console.log("🎥 Assigned stream to student video");
    }

    // Cleanup function
    return () => {
      if (teacherVideoRef.current) {
        teacherVideoRef.current.srcObject = null;
      }
      if (studentVideoRef.current) {
        studentVideoRef.current.srcObject = null;
      }
    };
  }, [media.stream, media.isConnected, isTeacher]);

  return { teacherVideoRef, studentVideoRef } as VideoRefs;
}
