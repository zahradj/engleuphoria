
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
    <div className="absolute inset-2 flex gap-4" style={{ zIndex: 2 }}>
      {/* Teacher Panel */}
      <div className="flex-1 aspect-video max-w-full max-h-full flex items-center justify-center">
        {isTeacher ? (
          // Teacher sees their own video
          hasVideo ? (
            <video
              autoPlay
              muted // Always mute local preview to prevent feedback!
              playsInline
              className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-blue-300"
              ref={videoRefs.teacherVideoRef}
              onLoadedMetadata={() => console.log("🎥 Teacher video metadata loaded")}
              onError={e => console.error("🎥 Teacher video error", e)}
            />
          ) : (
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-2xl border-4 border-blue-300 relative">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-blue-400 flex items-center justify-center shadow-xl mb-4 mx-auto">
                  <span className="text-6xl font-bold text-white">T</span>
                </div>
                <p className="text-white font-semibold text-lg">Teacher</p>
              </div>
              {media.isCameraOff && (
                <div className="absolute bottom-4 right-4 bg-red-500 text-white text-sm px-3 py-2 rounded-lg shadow-lg">
                  Camera Off
                </div>
              )}
            </div>
          )
        ) : (
          // Student sees teacher avatar (placeholder - would be teacher's video in real implementation)
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-2xl border-4 border-blue-300 relative">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-blue-300 flex items-center justify-center shadow-xl mb-4 mx-auto">
                <span className="text-6xl font-semibold text-white">T</span>
              </div>
              <p className="text-white font-semibold text-lg">Teacher</p>
            </div>
            <div className="absolute bottom-4 right-4 bg-gray-600 text-white text-sm px-3 py-2 rounded-lg">
              Remote
            </div>
          </div>
        )}
      </div>
      
      {/* Student Panel */}
      <div className="flex-1 aspect-video max-w-full max-h-full flex items-center justify-center">
        {!isTeacher ? (
          // Student sees their own video
          hasVideo ? (
            <video
              autoPlay
              muted // Always mute local preview for student!
              playsInline
              className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-purple-300"
              ref={videoRefs.studentVideoRef}
              onLoadedMetadata={() => console.log("🎥 Student video metadata loaded")}
              onError={e => console.error("🎥 Student video error", e)}
            />
          ) : (
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-2xl border-4 border-purple-300 relative">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-purple-400 flex items-center justify-center shadow-xl mb-4 mx-auto">
                  <span className="text-6xl font-bold text-white">S</span>
                </div>
                <p className="text-white font-semibold text-lg">Student</p>
              </div>
              {media.isCameraOff && (
                <div className="absolute bottom-4 right-4 bg-red-500 text-white text-sm px-3 py-2 rounded-lg shadow-lg">
                  Camera Off
                </div>
              )}
            </div>
          )
        ) : (
          // Teacher sees student avatar (placeholder - would be student's video in real implementation)
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-2xl border-4 border-purple-300 relative">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-purple-300 flex items-center justify-center shadow-xl mb-4 mx-auto">
                <span className="text-6xl font-semibold text-white">S</span>
              </div>
              <p className="text-white font-semibold text-lg">Student</p>
            </div>
            <div className="absolute bottom-4 right-4 bg-gray-600 text-white text-sm px-3 py-2 rounded-lg">
              Remote
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
