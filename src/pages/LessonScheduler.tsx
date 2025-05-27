
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, CalendarIcon, Clock, Users, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ScheduledLesson {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  students: string[];
  description: string;
  type: string;
}

const LessonScheduler = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { languageText } = useLanguage();
  
  const [lessonData, setLessonData] = useState({
    title: "",
    description: "",
    type: "",
    startTime: "",
    endTime: "",
    students: [] as string[]
  });
  const [selectedDate, setSelectedDate] = useState<Date>();
  
  const availableStudents = [
    "Alex Johnson",
    "Maria Garcia", 
    "Li Wei",
    "Sophia Ahmed",
    "Emma Brown",
    "Carlos Rodriguez"
  ];

  const handleScheduleLesson = () => {
    if (!lessonData.title || !selectedDate || !lessonData.startTime || !lessonData.endTime) {
      toast({
        title: languageText.validationError,
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newLesson: ScheduledLesson = {
      id: Date.now().toString(),
      title: lessonData.title,
      date: selectedDate,
      startTime: lessonData.startTime,
      endTime: lessonData.endTime,
      students: lessonData.students,
      description: lessonData.description,
      type: lessonData.type
    };

    // Store in localStorage
    const existingLessons = JSON.parse(localStorage.getItem("scheduledLessons") || "[]");
    const updatedLessons = [...existingLessons, newLesson];
    localStorage.setItem("scheduledLessons", JSON.stringify(updatedLessons));

    toast({
      title: "Lesson Scheduled",
      description: `${lessonData.title} has been scheduled successfully`,
    });

    navigate("/teacher-dashboard");
  };

  const toggleStudent = (studentName: string) => {
    setLessonData(prev => ({
      ...prev,
      students: prev.students.includes(studentName)
        ? prev.students.filter(s => s !== studentName)
        : [...prev.students, studentName]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-b py-4 shadow-lg">
        <div className="container max-w-7xl mx-auto px-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/teacher-dashboard")} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <h1 className="text-xl font-bold">Schedule Lesson</h1>
          </div>
        </div>
      </header>
      
      <main className="container max-w-4xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Create New Lesson Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Lesson Title *</Label>
                  <Input
                    id="title"
                    value={lessonData.title}
                    onChange={(e) => setLessonData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter lesson title"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Lesson Type</Label>
                  <Select value={lessonData.type} onValueChange={(value) => setLessonData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lesson type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vocabulary">Vocabulary</SelectItem>
                      <SelectItem value="grammar">Grammar</SelectItem>
                      <SelectItem value="conversation">Conversation</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Select Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={lessonData.startTime}
                      onChange={(e) => setLessonData(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={lessonData.endTime}
                      onChange={(e) => setLessonData(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={lessonData.description}
                    onChange={(e) => setLessonData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter lesson description"
                    rows={3}
                  />
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Select Students
                </Label>
                <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                  {availableStudents.map((student) => (
                    <div key={student} className="flex items-center space-x-2 py-2">
                      <input
                        type="checkbox"
                        id={student}
                        checked={lessonData.students.includes(student)}
                        onChange={() => toggleStudent(student)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <Label htmlFor={student} className="flex-1 cursor-pointer">
                        {student}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {lessonData.students.length} students
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <Button variant="outline" onClick={() => navigate("/teacher-dashboard")} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleScheduleLesson} className="flex-1 bg-purple-600 hover:bg-purple-700">
                <Clock className="mr-2 h-4 w-4" />
                Schedule Lesson
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LessonScheduler;
