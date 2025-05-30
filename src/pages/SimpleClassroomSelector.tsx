
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const SimpleClassroomSelector = () => {
  const navigate = useNavigate();
  const { languageText } = useLanguage();
  const [userType, setUserType] = useState<string>("");

  useEffect(() => {
    // Check if user is authenticated
    const teacherName = localStorage.getItem("teacherName");
    const studentName = localStorage.getItem("studentName");
    const storedUserType = localStorage.getItem("userType");
    
    console.log("Classroom Selector - Auth check:", { teacherName, studentName, storedUserType });
    
    if (!teacherName && !studentName && !storedUserType) {
      console.log("No authentication found, redirecting to login");
      navigate("/login");
      return;
    }
    
    // Determine user type
    if (teacherName || storedUserType === "teacher") {
      setUserType("teacher");
    } else {
      setUserType("student");
    }
  }, [navigate]);

  const classrooms = [
    {
      id: "beginner-english",
      title: "Beginner English",
      description: "Basic vocabulary and grammar for beginners",
      mode: "group",
      students: 8,
      duration: "45 min",
      color: "#9B87F5"
    },
    {
      id: "conversation-practice",
      title: "Conversation Practice",
      description: "Practice speaking with interactive dialogues",
      mode: "group",
      students: 5,
      duration: "30 min",
      color: "#14B8A6"
    },
    {
      id: "one-on-one-tutoring",
      title: "One-on-One Tutoring",
      description: "Personal tutoring session",
      mode: "oneOnOne",
      students: 1,
      duration: "25 min",
      color: "#F97316"
    },
    {
      id: "vocabulary-games",
      title: "Vocabulary Games",
      description: "Learn new words through fun activities",
      mode: "group",
      students: 12,
      duration: "35 min",
      color: "#EC4899"
    }
  ];

  const handleJoinClassroom = (classroomId: string, mode: string) => {
    console.log(`Joining classroom: ${classroomId} in ${mode} mode`);
    
    // Navigate to classroom with appropriate mode
    const searchParams = new URLSearchParams({ mode });
    navigate(`/classroom?${searchParams.toString()}`);
  };

  const handleBackToDashboard = () => {
    if (userType === "teacher") {
      navigate("/teacher-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {userType === "teacher" ? "Select Classroom to Start" : "Choose Your Classroom"}
            </h1>
            <p className="text-gray-600">
              {userType === "teacher" 
                ? "Start a classroom session for your students" 
                : "Join a classroom to continue learning"
              }
            </p>
          </div>
          <Button variant="outline" onClick={handleBackToDashboard}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Classroom Grid */}
      <main className="container mx-auto py-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom) => (
            <Card key={classroom.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div 
                className="h-2"
                style={{ backgroundColor: classroom.color }}
              />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {classroom.title}
                </CardTitle>
                <p className="text-sm text-gray-600">{classroom.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{classroom.students} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{classroom.duration}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => handleJoinClassroom(classroom.id, classroom.mode)}
                  style={{ backgroundColor: classroom.color }}
                >
                  {userType === "teacher" ? "Start Classroom" : "Join Classroom"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SimpleClassroomSelector;
