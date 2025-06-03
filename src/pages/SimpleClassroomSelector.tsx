
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

  const handleJoinClassroom = (classroom: any) => {
    console.log("Joining classroom:", classroom.mode, "as", userType);
    
    // Navigate to the new classroom
    navigate("/classroom");
  };

  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {userType === "teacher" ? "Select Classroom Type" : "Join a Class"}
          </h1>
          <p className="text-gray-600">
            {userType === "teacher" 
              ? "Choose the type of classroom you want to create" 
              : "Select the type of class you want to join"
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {classrooms.map((classroom) => {
            const IconComponent = classroom.icon;
            return (
              <Card 
                key={classroom.id} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => handleJoinClassroom(classroom)}
              >
                <CardHeader className="text-center pb-4">
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: classroom.color + "20" }}
                  >
                    <IconComponent 
                      size={32} 
                      style={{ color: classroom.color }}
                    />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {classroom.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-600 text-sm">
                    {classroom.description}
                  </p>
                  
                  <div className="flex justify-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{classroom.students} {classroom.students === 1 ? 'student' : 'students'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{classroom.duration}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4"
                    style={{ backgroundColor: classroom.color }}
                  >
                    {userType === "teacher" ? "Create Class" : "Join Class"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(userType === "teacher" ? "/teacher-dashboard" : "/student-dashboard")}
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimpleClassroomSelector;
