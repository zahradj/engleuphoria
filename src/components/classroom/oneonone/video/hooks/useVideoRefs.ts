
import { useRef, useEffect } from "react";
import { VideoRefs } from "../types";

export function useVideoRefs(media: any, isTeacher: boolean) {
  const teacherVideoRef = useRef<HTMLVideoElement>(null);
  const studentVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const teacherVideo = teacherVideoRef.current;
    const studentVideo = studentVideoRef.current;

    if (media.stream) {
      if (isTeacher && teacherVideo) {
        teacherVideo.srcObject = media.stream;
      }
      if (!isTeacher && studentVideo) {
        studentVideo.srcObject = media.stream;
      }
    }

    return () => {
      if (teacherVideo) teacherVideo.srcObject = null;
      if (studentVideo) studentVideo.srcObject = null;
    };
  }, [media.stream, isTeacher]);

  return { teacherVideoRef, studentVideoRef } as VideoRefs;
}
