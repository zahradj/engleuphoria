
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, Mic, MicOff, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnifiedVideoSectionProps {
  currentUser: {
    id: string;
    name: string;
    role: 'teacher' | 'student';
  };
}

export function UnifiedVideoSection({ currentUser }: UnifiedVideoSectionProps) {
  const isTeacher = currentUser.role === 'teacher';
  
  return (
    <div className="h-full">
      <Card className="h-full p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isTeacher ? 'bg-blue-500' : 'bg-green-500'} animate-pulse`} />
            <span className="text-sm font-medium">Video Call</span>
          </div>
          <Badge variant={isTeacher ? "default" : "secondary"}>
            {isTeacher ? "Teacher" : "Student"}
          </Badge>
        </div>

        {/* Video Grid */}
        <div className="space-y-3 mb-4">
          {/* Teacher Video */}
          <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <p className="text-sm font-medium text-blue-700">Teacher</p>
              </div>
            </div>
            <div className="absolute top-2 left-2">
              <Badge className="bg-blue-500 text-white text-xs">Host</Badge>
            </div>
            <div className="absolute bottom-2 right-2 flex gap-1">
              <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center">
                <Mic size={12} className="text-blue-600" />
              </div>
              <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center">
                <Camera size={12} className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* Student Video */}
          <div className="relative aspect-video bg-gradient-to-br from-green-100 to-green-200 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <p className="text-sm font-medium text-green-700">Student</p>
              </div>
            </div>
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="text-xs">Participant</Badge>
            </div>
            <div className="absolute bottom-2 right-2 flex gap-1">
              <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center">
                <Mic size={12} className="text-green-600" />
              </div>
              <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center">
                <Camera size={12} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Current User Indicator */}
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            You are: <span className="font-medium">{currentUser.name}</span>
            <Badge variant="outline" className="ml-2 text-xs">
              {isTeacher ? "Teacher" : "Student"}
            </Badge>
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Mic size={14} />
            Mute
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Camera size={14} />
            Video
          </Button>
          <Button size="sm" variant="destructive" className="flex items-center gap-1">
            <Phone size={14} />
            Leave
          </Button>
        </div>
      </Card>
    </div>
  );
}
