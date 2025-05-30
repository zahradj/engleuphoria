
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, BookOpen, User } from "lucide-react";
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
      id: "one-on-one",
      title: "One-on-One Class",
      description: "Personal tutoring session with dedicated teacher attention",
      mode: "oneOnOne",
      students: 1,
      duration: "30 min",
      color: "#F97316",
      icon: User
    },
    {
      id: "group-class",
      title: "Group Class",
      description: "Interactive group learning with multiple students",
      mode: "group",
      students: 8,
      duration: "45 min",
      color: "#9B87F5",
      icon: Users
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
              {userType === "teacher" ? "Select Class Type" : "Choose Your Class"}
            </h1>
            <p className="text-gray-600">
              {userType === "teacher" 
                ? "Choose the type of class you want to start" 
                : "Select how you want to learn today"
              }
            </p>
          </div>
          <Button variant="outline" onClick={handleBackToDashboard}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Classroom Options */}
      <main className="container mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {classrooms.map((classroom) => {
            const IconComponent = classroom.icon;
            return (
              <Card key={classroom.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div 
                  className="h-3"
                  style={{ backgroundColor: classroom.color }}
                />
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
                    <IconComponent 
                      className="h-12 w-12 mx-auto" 
                      style={{ color: classroom.color }}
                    />
                  </div>
                  <CardTitle className="text-xl mb-2">{classroom.title}</CardTitle>
                  <p className="text-sm text-gray-600">{classroom.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {classroom.mode === "oneOnOne" ? "1-on-1" : `${classroom.students} students`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{classroom.duration}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full py-3 text-lg font-medium" 
                    onClick={() => handleJoinClassroom(classroom.id, classroom.mode)}
                    style={{ backgroundColor: classroom.color }}
                  >
                    {userType === "teacher" ? "Start Class" : "Join Class"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default SimpleClassroomSelector;
