
import React from "react";
import { VideoRefs } from "../types";

interface Props {
  isTeacher: boolean;
  media: any;
  lessonStarted: boolean;
  videoRefs: VideoRefs;
}

export function LiveVideoPanels({ isTeacher, media, lessonStarted, videoRefs }: Props) {
  if (!lessonStarted) return null;

  const hasVideo = media.stream && media.isConnected && !media.isCameraOff;
  
  return (
    <>
      <div
        id="teacher-panel"
        className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center"
        style={{ zIndex: 2 }}
      >
        {isTeacher ? (
          // Teacher sees their own video
          hasVideo ? (
            <video
              autoPlay
              muted // Always mute local preview to prevent feedback!
              playsInline
              className="w-11/12 h-5/6 object-cover rounded-2xl shadow-lg border-2 border-blue-200"
              ref={videoRefs.teacherVideoRef}
              onLoadedMetadata={() => console.log("🎥 Teacher video metadata loaded")}
              onError={e => console.error("🎥 Teacher video error", e)}
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-blue-400 flex items-center justify-center shadow-xl">
              <span className="text-3xl font-bold text-white">T</span>
              {media.isCameraOff && (
                <div className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Camera Off
                </div>
              )}
            </div>
          )
        ) : (
          // Student sees teacher avatar (placeholder - would be teacher's video in real implementation)
          <div className="w-36 h-36 rounded-full bg-blue-300 flex items-center justify-center shadow-xl">
            <span className="text-3xl font-semibold text-white">T</span>
            <div className="absolute bottom-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded">
              Remote
            </div>
          </div>
        )}
      </div>
      
      <div
        id="student-panel"
        className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center"
        style={{ zIndex: 2 }}
      >
        {!isTeacher ? (
          // Student sees their own video
          hasVideo ? (
            <video
              autoPlay
              muted // Always mute local preview for student!
              playsInline
              className="w-11/12 h-5/6 object-cover rounded-2xl shadow-lg border-2 border-purple-200"
              ref={videoRefs.studentVideoRef}
              onLoadedMetadata={() => console.log("🎥 Student video metadata loaded")}
              onError={e => console.error("🎥 Student video error", e)}
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-purple-400 flex items-center justify-center shadow-xl">
              <span className="text-3xl font-bold text-white">S</span>
              {media.isCameraOff && (
                <div className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Camera Off
                </div>
              )}
            </div>
          )
        ) : (
          // Teacher sees student avatar (placeholder - would be student's video in real implementation)
          <div className="w-36 h-36 rounded-full bg-purple-300 flex items-center justify-center shadow-xl">
            <span className="text-3xl font-semibold text-white">S</span>
            <div className="absolute bottom-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded">
              Remote
            </div>
          </div>
        )}
      </div>
    </>
  );
}
