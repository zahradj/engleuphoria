import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Key,
  Sparkles
} from "lucide-react";
import { StudentProfile, CurriculumPlan } from "@/types/curriculum";
import { aiPlannerService } from "@/services/aiPlannerService";
import { resourceBankService } from "@/services/resourceBankService";
import { CurriculumPlanEditor } from "./curriculum/CurriculumPlanEditor";
import { StudentProfileForm } from "./curriculum/StudentProfileForm";
import { ResourceBankManager } from "./curriculum/ResourceBankManager";
import { NLEFPProgressTracker } from "./nlefp/NLEFPProgressTracker";

export const AIIntegrationTab = () => {
  const [activeTab, setActiveTab] = useState("planner");
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<CurriculumPlan | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [curriculumFramework, setCurriculumFramework] = useState<'NLEFP' | 'Traditional'>('NLEFP');
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
      badges: ["First Steps", "Animal Explorer", "NLEFP Module 1 Master"],
      nlefpProgress: {
        completedModules: [1, 2],
        currentModule: 3,
        progressWeeksCompleted: 2,
        portfolioTasks: ["Daily Routine Video", "Family Tree Presentation"]
      },
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
      
      const response = await aiPlannerService.generateCurriculum({
        studentProfile: selectedStudent,
        availableResources,
        weekCount: 6,
        framework: curriculumFramework
      });

      if (response.success && response.plan) {
        setCurrentPlan(response.plan);
        toast({
          title: "🤖 NLEFP Curriculum Generated!",
          description: `Personalized plan created using ${curriculumFramework} methodology for ${selectedStudent.name}`,
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
    toast({
      title: "API Integration Active",
      description: "AI features are now handled securely on the server.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">NLEFP AI Curriculum Generator</h2>
          <p className="text-gray-600">Create personalized Neuro-Linguistic English Fluency programs</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="planner" className="flex items-center gap-2">
            <Wand2 size={16} />
            NLEFP Planner
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <Sparkles size={16} />
            Progress
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
                Select Student & Framework
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="framework">Curriculum Framework</Label>
                  <Select value={curriculumFramework} onValueChange={(value: 'NLEFP' | 'Traditional') => setCurriculumFramework(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NLEFP">
                        <div className="flex items-center gap-2">
                          <Brain size={16} />
                          NLEFP (Recommended)
                        </div>
                      </SelectItem>
                      <SelectItem value="Traditional">Traditional ESL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                          {student.nlefpProgress && (
                            <Badge className="bg-purple-100 text-purple-700">
                              Module {student.nlefpProgress.currentModule}
                            </Badge>
                          )}
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
                      <Badge variant="secondary">{selectedStudent.learningStyle}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>Interests:</strong> {selectedStudent.interests.join(", ")}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Weekly Time:</strong> {selectedStudent.weeklyMinutes} minutes
                    </p>
                    {selectedStudent.nlefpProgress && (
                      <p className="text-sm text-purple-600">
                        <strong>NLEFP Progress:</strong> {selectedStudent.nlefpProgress.completedModules.length} modules completed
                      </p>
                    )}
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
                      Generating {curriculumFramework} Plan...
                    </>
                  ) : (
                    <>
                      <Wand2 size={16} className="mr-2" />
                      Generate {curriculumFramework} Curriculum
                    </>
                  )}
                </Button>

                {curriculumFramework === 'NLEFP' && (
                  <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">NLEFP Features:</h4>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• 12 research-based learning modules</li>
                      <li>• NLP anchors for memory enhancement</li>
                      <li>• Critical thinking integration</li>
                      <li>• VAK (Visual-Auditory-Kinesthetic) activities</li>
                      <li>• Progress weeks with portfolio tasks</li>
                    </ul>
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
                      <h4 className="font-medium">{curriculumFramework} Personalized Plan</h4>
                      <p className="text-sm text-gray-600">
                        Created for {mockStudents.find(s => s.id === currentPlan.studentId)?.name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-green-100 text-green-700">
                        {currentPlan.status}
                      </Badge>
                      {currentPlan.metadata?.framework === 'NLEFP' && (
                        <Badge className="bg-purple-100 text-purple-700">
                          NLEFP
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {currentPlan.weeks.slice(0, 2).map((week, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">Week {index + 1}: {week.theme}</p>
                          {week.isProgressWeek && (
                            <Badge variant="outline" className="text-xs">Progress Week</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{week.lessons.length} lessons</p>
                        {week.lessons[0]?.nlpAnchor && (
                          <p className="text-xs text-purple-600 italic">NLP: {week.lessons[0].nlpAnchor.slice(0, 50)}...</p>
                        )}
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
                  <p className="text-sm">Select a student and framework to start.</p>
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

        <TabsContent value="progress" className="mt-6">
          {selectedStudent?.nlefpProgress ? (
            <NLEFPProgressTracker
              studentId={selectedStudent.id}
              currentModule={selectedStudent.nlefpProgress.currentModule}
              progressWeeksCompleted={selectedStudent.nlefpProgress.progressWeeksCompleted}
              completedModules={selectedStudent.nlefpProgress.completedModules}
              xpTotal={selectedStudent.currentXP}
              badges={selectedStudent.badges}
            />
          ) : (
            <Card className="p-8 text-center">
              <Brain size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No NLEFP Progress Data</h3>
              <p className="text-gray-500">Select a student with NLEFP enrollment to view progress.</p>
            </Card>
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
              NLEFP Configuration
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
                  AI features are now handled securely on the server. No local API key needed.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">NLEFP Methodology:</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Neuro-Linguistic Programming integration for enhanced memory</li>
                  <li>• 6-part lesson structure with NLP anchors</li>
                  <li>• Critical thinking skills development</li>
                  <li>• VAK learning style accommodation</li>
                  <li>• Progress weeks with portfolio assessments</li>
                  <li>• Metacognitive reflection and self-assessment</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
