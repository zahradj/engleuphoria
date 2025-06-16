
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  FileText, 
  TrendingUp, 
  Play, 
  Clock,
  Star,
  Award,
  BookOpen,
  MessageCircle,
  FolderOpen,
  Video
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStudentHandlers } from "@/hooks/useStudentHandlers";
import { HomeworkSubmissionModal } from "./HomeworkSubmissionModal";
import { TeacherMessageModal } from "./TeacherMessageModal";

interface DashboardTabProps {
  studentName: string;
  points: number;
}

export const DashboardTab = ({ studentName, points }: DashboardTabProps) => {
  const navigate = useNavigate();
  const {
    handleJoinClass,
    handleSubmitHomework,
    handleMessageTeacher,
    handleViewMaterials,
    handleBookClass,
    handlePracticeVocabulary,
    handleViewProgress
  } = useStudentHandlers();

  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);

  const handleJoinClassroom = () => {
    navigate("/media-test?roomId=unified-classroom-1&role=student&name=" + encodeURIComponent(studentName) + "&userId=student-1");
  };

  const handleHomeworkSubmit = (submission: { text: string; files: File[] }) => {
    if (selectedAssignment) {
      handleSubmitHomework(selectedAssignment, submission);
    }
    setShowHomeworkModal(false);
    setSelectedAssignment(null);
  };

  const openHomeworkSubmission = (assignmentId: string) => {
    setSelectedAssignment(assignmentId);
    setShowHomeworkModal(true);
  };

  const upcomingClasses = [
    {
      id: "class-1",
      title: "Conversation Practice",
      date: "Today",
      time: "2:00 PM",
      teacher: "Ms. Sarah"
    },
    {
      id: "class-2",
      title: "Grammar: Past Tense",
      date: "Tomorrow",
      time: "10:00 AM",
      teacher: "Mr. John"
    }
  ];

  const recentHomework = [
    {
      id: "hw-1",
      title: "Essay: My Weekend",
      dueDate: "Dec 8",
      status: "pending"
    },
    {
      id: "hw-2",
      title: "Vocabulary Quiz",
      dueDate: "Dec 6",
      status: "submitted"
    }
  ];

  const achievements = [
    { title: "First Lesson Complete!", icon: "🎯", earned: true },
    { title: "Week Streak!", icon: "🔥", earned: true },
    { title: "Homework Master", icon: "📚", earned: false },
    { title: "Conversation Pro", icon: "💬", earned: false }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Hello, {studentName}! 🌟</h1>
        <p className="opacity-90 mb-4">You're making great progress in your English journey!</p>
        <div className="flex gap-4">
          <div className="bg-white/20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-current" />
              <span className="font-semibold">{points} Points</span>
            </div>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span className="font-semibold">Level A2</span>
            </div>
          </div>
          <Button 
            onClick={handleJoinClassroom}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            size="sm"
          >
            <Video className="h-4 w-4 mr-2" />
            Join Classroom
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Upcoming Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingClasses.map((cls, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-800">{cls.title}</h4>
                    <p className="text-sm text-gray-600">{cls.date} at {cls.time}</p>
                    <p className="text-sm text-blue-600">with {cls.teacher}</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={handleJoinClassroom}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Join
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Homework */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              Recent Homework
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentHomework.map((hw) => (
                <div key={hw.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-800">{hw.title}</h4>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Due {hw.dueDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={hw.status === 'submitted' ? 'default' : 'secondary'}>
                      {hw.status}
                    </Badge>
                    {hw.status === 'pending' && (
                      <Button 
                        size="sm" 
                        onClick={() => openHomeworkSubmission(hw.id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Submit
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Your Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg text-center transition-all ${
                  achievement.earned 
                    ? 'bg-yellow-50 border-2 border-yellow-200' 
                    : 'bg-gray-50 border-2 border-gray-200 opacity-50'
                }`}
              >
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <p className="text-sm font-medium text-gray-800">{achievement.title}</p>
                {achievement.earned && (
                  <Badge variant="default" className="mt-2 bg-yellow-500">
                    Earned!
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={handleBookClass}
            >
              <Calendar className="h-6 w-6" />
              Book Class
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => openHomeworkSubmission("new")}
            >
              <FileText className="h-6 w-6" />
              Submit Homework
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => setShowMessageModal(true)}
            >
              <MessageCircle className="h-6 w-6" />
              Message Teacher
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={handleViewMaterials}
            >
              <FolderOpen className="h-6 w-6" />
              Study Materials
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <HomeworkSubmissionModal
        isOpen={showHomeworkModal}
        onClose={() => {
          setShowHomeworkModal(false);
          setSelectedAssignment(null);
        }}
        assignmentTitle={selectedAssignment ? recentHomework.find(hw => hw.id === selectedAssignment)?.title || "New Assignment" : "New Assignment"}
        onSubmit={handleHomeworkSubmit}
      />

      <TeacherMessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        onSend={handleMessageTeacher}
      />
    </div>
  );
};
