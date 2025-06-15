
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Search, 
  Filter, 
  Eye, 
  Ear, 
  Hand, 
  Brain, 
  Target, 
  Sparkles,
  FileText,
  Image,
  Video,
  Headphones,
  Gamepad2,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MaterialLibraryIntegratedProps {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic';
  activePhase: number;
}

export const MaterialLibraryIntegrated = ({ learningStyle, activePhase }: MaterialLibraryIntegratedProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const materialTypes = {
    visual: [
      { type: 'infographic', icon: Image, color: 'bg-blue-100 text-blue-700', count: 24 },
      { type: 'mindmap', icon: Brain, color: 'bg-purple-100 text-purple-700', count: 18 },
      { type: 'diagram', icon: Target, color: 'bg-green-100 text-green-700', count: 32 }
    ],
    auditory: [
      { type: 'audio', icon: Headphones, color: 'bg-orange-100 text-orange-700', count: 28 },
      { type: 'rhythm', icon: Ear, color: 'bg-pink-100 text-pink-700', count: 15 },
      { type: 'pronunciation', icon: Video, color: 'bg-cyan-100 text-cyan-700', count: 22 }
    ],
    kinesthetic: [
      { type: 'interactive', icon: Gamepad2, color: 'bg-green-100 text-green-700', count: 19 },
      { type: 'gesture', icon: Hand, color: 'bg-yellow-100 text-yellow-700', count: 16 },
      { type: 'movement', icon: Target, color: 'bg-red-100 text-red-700', count: 12 }
    ]
  };

  const phaseMaterials = {
    1: [
      { title: 'Basic Sentence Builder - Visual', type: 'visual', phase: 1, nlpTechnique: 'Visual Anchoring', effectiveness: 92 },
      { title: 'Pronunciation Patterns', type: 'auditory', phase: 1, nlpTechnique: 'Rhythm Anchoring', effectiveness: 88 },
      { title: 'Word Building Blocks', type: 'kinesthetic', phase: 1, nlpTechnique: 'Physical Learning', effectiveness: 85 }
    ],
    2: [
      { title: 'Grammar Pattern Maps', type: 'visual', phase: 2, nlpTechnique: 'Pattern Recognition', effectiveness: 94 },
      { title: 'Musical Grammar Rules', type: 'auditory', phase: 2, nlpTechnique: 'Musical Mnemonics', effectiveness: 89 },
      { title: 'Grammar Construction Kit', type: 'kinesthetic', phase: 2, nlpTechnique: 'Tactile Learning', effectiveness: 87 }
    ],
    3: [
      { title: 'Context Scenario Cards', type: 'visual', phase: 3, nlpTechnique: 'Contextual Anchoring', effectiveness: 91 },
      { title: 'Conversation Flows', type: 'auditory', phase: 3, nlpTechnique: 'Dialogue Patterns', effectiveness: 93 },
      { title: 'Role-Play Activities', type: 'kinesthetic', phase: 3, nlpTechnique: 'Experiential Learning', effectiveness: 96 }
    ],
    4: [
      { title: 'Advanced Expression Tools', type: 'visual', phase: 4, nlpTechnique: 'Complex Visualization', effectiveness: 89 },
      { title: 'Fluency Practice Sessions', type: 'auditory', phase: 4, nlpTechnique: 'Flow States', effectiveness: 91 },
      { title: 'Presentation Frameworks', type: 'kinesthetic', phase: 4, nlpTechnique: 'Confidence Building', effectiveness: 88 }
    ]
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast({
            title: "Upload Complete!",
            description: `${file.name} has been analyzed and categorized using AI.`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const currentMaterials = phaseMaterials[activePhase as keyof typeof phaseMaterials] || [];
  const currentTypes = materialTypes[learningStyle];

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload />
            Smart Material Upload & AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block w-full">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png,.mp3,.mp4"
                />
                <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center cursor-pointer hover:border-white/50 transition-all">
                  <Upload className="mx-auto mb-2" size={32} />
                  <p className="font-medium">Drop files here or click to upload</p>
                  <p className="text-sm opacity-90 mt-1">AI will automatically categorize by NLP principles</p>
                </div>
              </label>
              {isUploading && (
                <div className="mt-4">
                  <div className="bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm mt-1">Analyzing content... {uploadProgress}%</p>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">AI-Powered Features:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  <span>Automatic NLP technique identification</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain size={16} />
                  <span>Learning style categorization</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target size={16} />
                  <span>Phase-appropriate tagging</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search materials by NLP technique, phase, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm border-white/20"
          />
        </div>
        <Button variant="outline" className="border-gray-300">
          <Filter className="mr-2" size={16} />
          Filters
        </Button>
      </div>

      {/* Material Type Overview */}
      <div className="grid grid-cols-3 gap-4">
        {currentTypes.map((type, index) => (
          <Card key={index} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 ${type.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <type.icon size={24} />
              </div>
              <h3 className="font-semibold capitalize">{type.type}</h3>
              <p className="text-2xl font-bold text-gray-800">{type.count}</p>
              <p className="text-sm text-gray-600">materials</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Materials for Current Phase */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-blue-500" />
            Phase {activePhase} Materials - {learningStyle.charAt(0).toUpperCase() + learningStyle.slice(1)} Focus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentMaterials.map((material, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    {material.type === 'visual' && <Eye className="text-white" size={20} />}
                    {material.type === 'auditory' && <Ear className="text-white" size={20} />}
                    {material.type === 'kinesthetic' && <Hand className="text-white" size={20} />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{material.title}</h4>
                    <p className="text-sm text-gray-600">NLP Technique: {material.nlpTechnique}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Phase {material.phase}
                      </Badge>
                      <Badge className="text-xs bg-green-100 text-green-700">
                        {material.effectiveness}% effective
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Preview
                  </Button>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    Use in Lesson
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Create Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg cursor-pointer hover:shadow-xl transition-all">
          <CardContent className="p-4 text-center">
            <Plus className="mx-auto mb-2" size={32} />
            <h3 className="font-semibold">Create Visual Aid</h3>
            <p className="text-sm opacity-90">AI-powered diagram generator</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg cursor-pointer hover:shadow-xl transition-all">
          <CardContent className="p-4 text-center">
            <Headphones className="mx-auto mb-2" size={32} />
            <h3 className="font-semibold">Audio Exercise</h3>
            <p className="text-sm opacity-90">Generate pronunciation practice</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg cursor-pointer hover:shadow-xl transition-all">
          <CardContent className="p-4 text-center">
            <Gamepad2 className="mx-auto mb-2" size={32} />
            <h3 className="font-semibold">Interactive Game</h3>
            <p className="text-sm opacity-90">Create engaging activities</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
