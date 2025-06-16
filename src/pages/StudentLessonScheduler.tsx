
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const StudentLessonScheduler = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const availableTeachers = [
    { id: "teacher-1", name: "Ms. Sarah Johnson", speciality: "Conversation Practice" },
    { id: "teacher-2", name: "Mr. John Smith", speciality: "Grammar & Writing" },
    { id: "teacher-3", name: "Ms. Maria Garcia", speciality: "Business English" }
  ];

  const availableTimes = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  const handleBookLesson = () => {
    if (!selectedDate || !selectedTime || !selectedTeacher) {
      toast({
        title: "Missing Information",
        description: "Please select a date, time, and teacher.",
        variant: "destructive"
      });
      return;
    }

    const teacher = availableTeachers.find(t => t.id === selectedTeacher);
    toast({
      title: "Lesson Booked!",
      description: `Your lesson with ${teacher?.name} is scheduled for ${selectedDate.toDateString()} at ${selectedTime}.`,
    });
    
    setTimeout(() => {
      navigate("/student-dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/student-dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Book a Lesson</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Select Date & Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Available Times</label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.map((time) => (
                      <SelectItem key={time} value={time}>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {time}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Choose Your Teacher
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedTeacher === teacher.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedTeacher(teacher.id)}
                >
                  <h3 className="font-semibold">{teacher.name}</h3>
                  <Badge variant="outline" className="mt-1">
                    {teacher.speciality}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Lesson Summary</h3>
                {selectedDate && selectedTime && selectedTeacher && (
                  <div className="mt-2 space-y-1 text-gray-600">
                    <p>Date: {selectedDate.toDateString()}</p>
                    <p>Time: {selectedTime}</p>
                    <p>Teacher: {availableTeachers.find(t => t.id === selectedTeacher)?.name}</p>
                    <p>Duration: 60 minutes</p>
                    <p>Cost: €10</p>
                  </div>
                )}
              </div>
              <Button 
                onClick={handleBookLesson}
                disabled={!selectedDate || !selectedTime || !selectedTeacher}
                className="bg-green-500 hover:bg-green-600"
              >
                Book Lesson
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentLessonScheduler;
