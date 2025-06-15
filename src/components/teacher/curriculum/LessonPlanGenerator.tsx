
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  X, 
  Wand2, 
  Clock, 
  Users, 
  Target, 
  Lightbulb,
  Play,
  Download,
  CheckCircle,
  Brain,
  Heart,
  Eye,
  Ear,
  Hand
} from 'lucide-react';
import { CurriculumUnit } from '@/data/buildAndUseCurriculum';

interface LessonPlanGeneratorProps {
  unit: CurriculumUnit | null;
  onClose: () => void;
  level: 'A1' | 'A2';
}

export function LessonPlanGenerator({ unit, onClose, level }: LessonPlanGeneratorProps) {
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateLessonPlan = () => {
    setIsGenerating(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const plan = {
        title: unit ? `${unit.theme} - Build & Use Lesson` : `${level} Level Lesson`,
        duration: unit?.duration || 90,
        phases: {
          warmUp: {
            duration: 10,
            activity: "Confidence anchor ritual + vocabulary warm-up game",
            materials: ["Vocabulary cards", "Confidence anchor phrase"],
            nlpElement: "Positive state anchoring"
          },
          presentation: {
            duration: 20,
            activity: unit ? `Introduce ${unit.grammar} using VAK approach` : "Grammar presentation",
            materials: ["Visual aids", "Audio examples", "Manipulatives"],
            nlpElement: "Multi-sensory input for rapid comprehension"
          },
          practice: {
            duration: 25,
            activity: "Guided sentence building with confidence scaffolding",
            materials: ["Sentence builder cards", "Pattern practice sheets"],
            nlpElement: "Success anchoring with each correct sentence"
          },
          production: {
            duration: 25,
            activity: unit ? `${unit.activities.speaking} with peer feedback` : "Speaking production",
            materials: ["Role-play cards", "Recording device"],
            nlpElement: "Real-world application with emotional anchoring"
          },
          review: {
            duration: 10,
            activity: "Progress celebration + next lesson preview",
            materials: ["Achievement stickers", "Progress chart"],
            nlpElement: "Success state reinforcement"
          }
        },
        assessment: {
          formative: "Continuous observation during sentence building",
          summative: "End-of-lesson confidence check",
          homework: unit ? "Practice sentence patterns in real situations" : "Apply target language"
        },
        differentiation: {
          visual: "Color-coded grammar patterns and visual sentence maps",
          auditory: "Rhythm and rhyme for pattern memorization",
          kinesthetic: "Physical movement during sentence construction"
        }
      };
      
      setGeneratedPlan(plan);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Wand2 className="text-purple-500" />
                AI Lesson Plan Generator
              </CardTitle>
              <p className="text-gray-600 mt-1">
                {unit ? `Generating lesson for: ${unit.theme}` : `Generating ${level} level lesson plan`}
              </p>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {!generatedPlan ? (
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Wand2 size={40} className="text-purple-500" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Ready to Create Your Lesson Plan?</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our AI will generate a comprehensive lesson plan following the Build & Use model, 
                  including rapid comprehension strategies, sentence-building confidence boosters, 
                  and creative lesson flow.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <Brain className="mx-auto mb-2 text-blue-500" size={24} />
                    <h4 className="font-semibold">NLP Integration</h4>
                    <p className="text-sm text-gray-600">Anchoring & VAK strategies</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <Target className="mx-auto mb-2 text-green-500" size={24} />
                    <h4 className="font-semibold">Systematic Building</h4>
                    <p className="text-sm text-gray-600">Step-by-step confidence</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <Users className="mx-auto mb-2 text-purple-500" size={24} />
                    <h4 className="font-semibold">4 Skills Integration</h4>
                    <p className="text-sm text-gray-600">Listening, speaking, reading, writing</p>
                  </CardContent>
                </Card>
              </div>

              <Button 
                onClick={generateLessonPlan} 
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 text-lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating Magic...
                  </>
                ) : (
                  <>
                    <Wand2 size={20} className="mr-2" />
                    Generate Lesson Plan
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="phases">Lesson Phases</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                <TabsTrigger value="materials">Materials & Tips</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="text-green-500" />
                      {generatedPlan.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="text-blue-500" size={20} />
                        <span><strong>Duration:</strong> {generatedPlan.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="text-green-500" size={20} />
                        <span><strong>Level:</strong> {level}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Brain className="text-purple-500" size={20} />
                        <span><strong>Method:</strong> Build & Use</span>
                      </div>
                    </div>

                    {unit && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Grammar Focus:</h4>
                          <Badge className="bg-blue-100 text-blue-800">{unit.grammar}</Badge>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Learning Objectives:</h4>
                          <p className="text-gray-700">{unit.objectives}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="phases" className="space-y-4">
                {Object.entries(generatedPlan.phases).map(([phase, details]) => (
                  <Card key={phase}>
                    <CardHeader>
                      <CardTitle className="capitalize flex items-center gap-2">
                        <Clock size={16} />
                        {phase.replace(/([A-Z])/g, ' $1')} ({details.duration} min)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium mb-1">Activity:</h5>
                          <p className="text-gray-700">{details.activity}</p>
                        </div>
                        <div>
                          <h5 className="font-medium mb-1">Materials:</h5>
                          <div className="flex gap-2 flex-wrap">
                            {details.materials.map((material, idx) => (
                              <Badge key={idx} variant="outline">{material}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                          <h5 className="font-medium mb-1 text-purple-800 flex items-center gap-1">
                            <Heart size={14} />
                            NLP Element:
                          </h5>
                          <p className="text-purple-700 text-sm">{details.nlpElement}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="assessment" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Formative Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{generatedPlan.assessment.formative}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Summative Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{generatedPlan.assessment.summative}</p>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Homework Assignment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{generatedPlan.assessment.homework}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="materials" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Differentiation Strategies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-start gap-2">
                        <Eye className="text-blue-500 mt-1" size={16} />
                        <div>
                          <h5 className="font-medium">Visual Learners</h5>
                          <p className="text-sm text-gray-600">{generatedPlan.differentiation.visual}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Ear className="text-green-500 mt-1" size={16} />
                        <div>
                          <h5 className="font-medium">Auditory Learners</h5>
                          <p className="text-sm text-gray-600">{generatedPlan.differentiation.auditory}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Hand className="text-purple-500 mt-1" size={16} />
                        <div>
                          <h5 className="font-medium">Kinesthetic Learners</h5>
                          <p className="text-sm text-gray-600">{generatedPlan.differentiation.kinesthetic}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {generatedPlan && (
            <div className="flex gap-3 mt-6 pt-6 border-t">
              <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500">
                <Play size={16} className="mr-2" />
                Use This Lesson Plan
              </Button>
              <Button variant="outline" className="flex-1">
                <Download size={16} className="mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={() => setGeneratedPlan(null)}>
                <Wand2 size={16} className="mr-2" />
                Generate New Plan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
