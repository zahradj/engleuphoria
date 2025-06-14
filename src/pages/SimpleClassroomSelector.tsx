
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, GraduationCap, Users, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SimpleClassroomSelector = () => {
  const navigate = useNavigate();

  const joinAsTeacher = () => {
    navigate("/classroom/demo-room?role=teacher&name=Ms. Johnson&userId=teacher-1");
  };

  const joinAsStudent = () => {
    navigate("/classroom/demo-room?role=student&name=Emma Thompson&userId=student-1");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Join Unified Classroom</h1>
          <p className="text-gray-600">Choose your role to enter the classroom with appropriate controls</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Teacher Option */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Join as Teacher</h3>
              <Badge className="mb-4 bg-purple-100 text-purple-700">Full Controls</Badge>
              <p className="text-gray-600 mb-6">
                Access all teaching tools including recording, rewards system, whiteboard controls, and student management.
              </p>
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                <li>✓ Recording controls</li>
                <li>✓ Reward system</li>
                <li>✓ AI assistant</li>
                <li>✓ Participant management</li>
              </ul>
              <Button onClick={joinAsTeacher} className="w-full">
                <Crown className="w-4 h-4 mr-2" />
                Enter as Teacher
              </Button>
            </div>
          </Card>

          {/* Student Option */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Join as Student</h3>
              <Badge variant="secondary" className="mb-4">Learning Mode</Badge>
              <p className="text-gray-600 mb-6">
                Access learning tools including dictionary, chat, homework tracker, and progress monitoring.
              </p>
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                <li>✓ Interactive whiteboard</li>
                <li>✓ Dictionary & chat</li>
                <li>✓ Progress tracking</li>
                <li>✓ Raise hand feature</li>
              </ul>
              <Button onClick={joinAsStudent} variant="outline" className="w-full">
                <GraduationCap className="w-4 h-4 mr-2" />
                Enter as Student
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center justify-center gap-2 text-yellow-800">
              <Video className="w-4 h-4" />
              <span className="text-sm font-medium">Camera & microphone access will be requested when you join</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimpleClassroomSelector;
