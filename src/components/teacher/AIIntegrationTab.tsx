
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  Wand2, 
  User, 
  BookOpen, 
  Settings, 
  Play,
  Download,
  Edit,
  Plus,
  Key
} from "lucide-react";
import { StudentProfile, CurriculumPlan } from "@/types/curriculum";
import { aiPlannerService } from "@/services/aiPlannerService";
import { resourceBankService } from "@/services/resourceBankService";
import { CurriculumPlanEditor } from "./curriculum/CurriculumPlanEditor";
import { StudentProfileForm } from "./curriculum/StudentProfileForm";
import { ResourceBankManager } from "./curriculum/ResourceBankManager";

export const AIIntegrationTab = () => {
  const [activeTab, setActiveTab] = useState("planner");
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<CurriculumPlan | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const { toast } = useToast();

  // Mock student data for demonstration
  const mockStudents: StudentProfile[] = [
    {
      id: "student_1",
      name: "Emma Rodriguez",
      age: 8,
      cefrLevel: "A1",
      strengths: ["Visual learning", "Creative activities"],
      gaps: ["Grammar structures", "Speaking confidence"],
      learningStyle: "Visual",
      interests: ["Animals", "Art", "Music"],
      weeklyMinutes: 100,
      longTermGoal: "Read simple story books independently",
      parentContact: { email: "parent@example.com" },
      currentXP: 1250,
      badges: ["First Steps", "Animal Explorer"],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const handleGeneratePlan = async () => {
    if (!selectedStudent) {
      toast({
        title: "No Student Selected",
        description: "Please select a student profile first.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const availableResources = resourceBankService.getAllResources();
      
      // Use mock curriculum if no API key is set
      const response = apiKey 
        ? await aiPlannerService.generateCurriculum({
            studentProfile: selectedStudent,
            availableResources,
            weekCount: 6
          })
        : aiPlannerService.generateMockCurriculum({
            studentProfile: selectedStudent,
            availableResources,
            weekCount: 6
          });

      if (response.success && response.plan) {
        setCurrentPlan(response.plan);
        toast({
          title: "🤖 Curriculum Generated!",
          description: `Personalized 6-week plan created for ${selectedStudent.name}`,
        });
      } else {
        throw new Error(response.error || "Failed to generate curriculum");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      aiPlannerService.setApiKey(apiKey);
      toast({
        title: "API Key Saved",
        description: "OpenAI API key has been configured successfully.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Curriculum Generator</h2>
          <p className="text-gray-600">Create personalized learning plans with AI assistance</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="planner" className="flex items-center gap-2">
            <Wand2 size={16} />
            Planner
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <User size={16} />
            Students
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <BookOpen size={16} />
            Resources
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings size={16} />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="planner" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Student Selection & Generation */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                Select Student
              </h3>
              
              <div className="space-y-4">
                <Select 
                  value={selectedStudent?.id || ""} 
                  onValueChange={(value) => {
                    const student = mockStudents.find(s => s.id === value);
                    setSelectedStudent(student || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a student..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStudents.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        <div className="flex items-center gap-2">
                          <span>{student.name}</span>
                          <Badge variant="outline">{student.cefrLevel}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedStudent && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{selectedStudent.name}</span>
                      <Badge>{selectedStudent.cefrLevel}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>Interests:</strong> {selectedStudent.interests.join(", ")}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Weekly Time:</strong> {selectedStudent.weeklyMinutes} minutes
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Goal:</strong> {selectedStudent.longTermGoal}
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleGeneratePlan}
                  disabled={!selectedStudent || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Plan...
                    </>
                  ) : (
                    <>
                      <Wand2 size={16} className="mr-2" />
                      Generate 6-Week Curriculum
                    </>
                  )}
                </Button>

                {!apiKey && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      💡 No API key configured. Using demo mode with mock curriculum.
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Current Plan Preview */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-green-600" />
                Generated Plan
              </h3>
              
              {currentPlan ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">6-Week Personalized Plan</h4>
                      <p className="text-sm text-gray-600">
                        Created for {mockStudents.find(s => s.id === currentPlan.studentId)?.name}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      {currentPlan.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {currentPlan.weeks.slice(0, 2).map((week, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <p className="font-medium text-sm">Week {index + 1}: {week.theme}</p>
                        <p className="text-xs text-gray-600">{week.lessons.length} lessons</p>
                      </div>
                    ))}
                    {currentPlan.weeks.length > 2 && (
                      <p className="text-xs text-gray-500">
                        + {currentPlan.weeks.length - 2} more weeks...
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit size={14} className="mr-1" />
                      Edit Plan
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download size={14} className="mr-1" />
                      Export
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Play size={14} className="mr-1" />
                      Activate
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Wand2 size={32} className="mx-auto mb-3 text-gray-300" />
                  <p>No curriculum generated yet.</p>
                  <p className="text-sm">Select a student and click "Generate" to start.</p>
                </div>
              )}
            </Card>
          </div>

          {/* Full Plan Editor */}
          {currentPlan && (
            <div className="mt-6">
              <CurriculumPlanEditor 
                plan={currentPlan}
                onPlanUpdate={setCurrentPlan}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="students" className="mt-6">
          <StudentProfileForm students={mockStudents} />
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <ResourceBankManager />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Key size={18} className="text-purple-600" />
              API Configuration
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="openai-key"
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <Button onClick={handleApiKeySubmit}>
                    Save
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Required for AI-powered curriculum generation. Stored locally.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• AI analyzes student profile and available resources</li>
                  <li>• Generates personalized 6-week curriculum following CEFR standards</li>
                  <li>• Includes NLP anchors, XP rewards, and critical thinking tasks</li>
                  <li>• Teachers can edit and customize before activation</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
