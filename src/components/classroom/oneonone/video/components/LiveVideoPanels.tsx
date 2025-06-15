
import React from "react";
import { VideoRefs } from "../types";

interface Props {
  isTeacher: boolean;
  media: any;
  lessonStarted: boolean;
  videoRefs: VideoRefs;
}

export function LiveVideoPanels({ isTeacher, media, lessonStarted, videoRefs }: Props) {
  return lessonStarted ? (
    <>
      <div
        id="teacher-panel"
        className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center"
        style={{ zIndex: 2 }}
      >
        {isTeacher ? (
          media.stream && !media.isCameraOff ? (
            <video
              autoPlay
              muted // Always mute local preview to prevent feedback!
              playsInline
              className="w-11/12 h-5/6 object-cover rounded-2xl shadow-lg border-2 border-blue-200"
              ref={videoRefs.teacherVideoRef}
              onError={e => console.error("Teacher video error", e)}
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-blue-400 flex items-center justify-center shadow-xl">
              <span className="text-3xl font-bold text-white">T</span>
            </div>
          )
        ) : (
          // Student sees teacher avatar
          <div className="w-36 h-36 rounded-full bg-blue-300 flex items-center justify-center shadow-xl">
            <span className="text-3xl font-semibold text-white">T</span>
          </div>
        )}
      </div>
      <div
        id="student-panel"
        className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center"
        style={{ zIndex: 2 }}
      >
        {!isTeacher ? (
          media.stream && !media.isCameraOff ? (
            <video
              autoPlay
              muted // Always mute local preview for student!
              playsInline
              className="w-11/12 h-5/6 object-cover rounded-2xl shadow-lg border-2 border-purple-200"
              ref={videoRefs.studentVideoRef}
              onError={e => console.error("Student video error", e)}
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-purple-400 flex items-center justify-center shadow-xl">
              <span className="text-3xl font-bold text-white">S</span>
            </div>
          )
        ) : (
          // Teacher sees student avatar
          <div className="w-36 h-36 rounded-full bg-purple-300 flex items-center justify-center shadow-xl">
            <span className="text-3xl font-semibold text-white">S</span>
          </div>
        )}
      </div>
    </>
  ) : null;
}
