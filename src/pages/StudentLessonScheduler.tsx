
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
import { ArrowLeft, CalendarIcon, Clock, User, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ScheduledLesson {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  studentName: string;
  description: string;
  type: string;
  status: "pending" | "confirmed" | "cancelled";
}

const StudentLessonScheduler = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { languageText } = useLanguage();
  
  const [lessonData, setLessonData] = useState({
    title: "",
    description: "",
    type: "",
    startTime: "",
    endTime: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date>();
  
  // Get student name from localStorage
  const studentName = localStorage.getItem("studentName") || "Student";

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
      studentName: studentName,
      description: lessonData.description,
      type: lessonData.type,
      status: "pending"
    };

    // Store in localStorage (in a real app, this would be sent to the teacher)
    const existingLessons = JSON.parse(localStorage.getItem("studentScheduledLessons") || "[]");
    const updatedLessons = [...existingLessons, newLesson];
    localStorage.setItem("studentScheduledLessons", JSON.stringify(updatedLessons));

    toast({
      title: "Lesson Request Sent",
      description: `Your request for "${lessonData.title}" has been sent to your teacher for approval`,
    });

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-b py-4 shadow-lg">
        <div className="container max-w-7xl mx-auto px-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <h1 className="text-xl font-bold">Request a Lesson</h1>
          </div>
        </div>
      </header>
      
      <main className="container max-w-2xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Schedule a New Lesson
            </CardTitle>
            <p className="text-muted-foreground">
              Request a lesson with your teacher. They will review and confirm your request.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">What would you like to learn? *</Label>
                <Input
                  id="title"
                  value={lessonData.title}
                  onChange={(e) => setLessonData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., English Conversation, Grammar Practice"
                />
              </div>

              <div>
                <Label htmlFor="type">Lesson Type</Label>
                <Select value={lessonData.type} onValueChange={(value) => setLessonData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select what you want to focus on" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vocabulary">Vocabulary Building</SelectItem>
                    <SelectItem value="grammar">Grammar Practice</SelectItem>
                    <SelectItem value="conversation">Conversation Practice</SelectItem>
                    <SelectItem value="reading">Reading Comprehension</SelectItem>
                    <SelectItem value="writing">Writing Skills</SelectItem>
                    <SelectItem value="pronunciation">Pronunciation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Preferred Date *</Label>
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
                      {selectedDate ? format(selectedDate, "PPP") : "When would you like to have this lesson?"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Preferred Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={lessonData.startTime}
                    onChange={(e) => setLessonData(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Preferred End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={lessonData.endTime}
                    onChange={(e) => setLessonData(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Additional Notes</Label>
                <Textarea
                  id="description"
                  value={lessonData.description}
                  onChange={(e) => setLessonData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Tell your teacher what specific topics you'd like to work on or any questions you have"
                  rows={3}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Student Information</span>
                </div>
                <p className="text-sm text-blue-600">
                  Requesting as: <strong>{studentName}</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <Button variant="outline" onClick={() => navigate("/dashboard")} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleScheduleLesson} className="flex-1 bg-purple-600 hover:bg-purple-700">
                <Clock className="mr-2 h-4 w-4" />
                Send Lesson Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentLessonScheduler;
