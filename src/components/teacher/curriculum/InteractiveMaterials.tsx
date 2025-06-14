
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Volume2, 
  Eye,
  Download,
  Share2,
  Shuffle,
  Timer
} from "lucide-react";

interface InteractiveMaterial {
  id: string;
  type: 'drag-drop' | 'matching' | 'fill-blank' | 'pronunciation' | 'timeline' | 'builder';
  title: string;
  description: string;
  content: any;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  instructions: string[];
}

interface InteractiveMaterialsProps {
  materials: InteractiveMaterial[];
  onComplete?: (materialId: string, score: number) => void;
}

export function InteractiveMaterials({ materials, onComplete }: InteractiveMaterialsProps) {
  const [activeMaterial, setActiveMaterial] = useState<InteractiveMaterial | null>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [completedMaterials, setCompletedMaterials] = useState<Set<string>>(new Set());

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'drag-drop': return '🧩';
      case 'matching': return '🔗';
      case 'fill-blank': return '📝';
      case 'pronunciation': return '🎤';
      case 'timeline': return '📅';
      case 'builder': return '🏗️';
      default: return '📚';
    }
  };

  const handleMaterialComplete = (materialId: string, score: number) => {
    setCompletedMaterials(prev => new Set([...prev, materialId]));
    onComplete?.(materialId, score);
  };

  const renderSentenceBuilder = (content: any) => {
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [availableWords] = useState(content.words || ['I', 'study', 'English', 'every', 'day']);
    
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg min-h-[80px] border-2 border-dashed border-blue-300">
          <div className="flex flex-wrap gap-2">
            {selectedWords.map((word, index) => (
              <Badge key={index} className="bg-blue-600 text-white cursor-pointer" 
                     onClick={() => setSelectedWords(prev => prev.filter((_, i) => i !== index))}>
                {word}
              </Badge>
            ))}
          </div>
          {selectedWords.length === 0 && (
            <p className="text-blue-400 text-center">Drag words here to build your sentence</p>
          )}
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {availableWords.filter(word => !selectedWords.includes(word)).map((word, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setSelectedWords(prev => [...prev, word])}
              className="hover:bg-blue-100"
            >
              {word}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setSelectedWords([])}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button 
            onClick={() => handleMaterialComplete(activeMaterial!.id, selectedWords.length * 10)}
            disabled={selectedWords.length === 0}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Check Sentence
          </Button>
        </div>
      </div>
    );
  };

  const renderDragDrop = (content: any) => {
    const [droppedItems, setDroppedItems] = useState<Record<string, string>>({});
    const items = content.items || [
      { id: 'subject1', text: 'I', category: 'subject' },
      { id: 'verb1', text: 'study', category: 'verb' },
      { id: 'object1', text: 'English', category: 'object' }
    ];
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {['subject', 'verb', 'object'].map(category => (
            <div key={category} className="space-y-2">
              <h4 className="font-medium capitalize text-center">{category}</h4>
              <div className="bg-gray-50 p-4 rounded-lg min-h-[100px] border-2 border-dashed">
                {Object.entries(droppedItems)
                  .filter(([_, cat]) => cat === category)
                  .map(([itemId]) => {
                    const item = items.find(i => i.id === itemId);
                    return item ? (
                      <Badge key={itemId} className="block mb-2">{item.text}</Badge>
                    ) : null;
                  })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
          {items.filter(item => !Object.keys(droppedItems).includes(item.id)).map(item => (
            <Button
              key={item.id}
              variant="outline"
              onClick={() => setDroppedItems(prev => ({ ...prev, [item.id]: item.category }))}
            >
              {item.text}
            </Button>
          ))}
        </div>
        
        <Button 
          onClick={() => handleMaterialComplete(activeMaterial!.id, Object.keys(droppedItems).length * 15)}
          className="w-full"
        >
          Check Answer
        </Button>
      </div>
    );
  };

  const renderPronunciationPractice = (content: any) => {
    const [isRecording, setIsRecording] = useState(false);
    const sentences = content.sentences || ['I study English every day', 'You speak very well'];
    
    return (
      <div className="space-y-4">
        {sentences.map((sentence, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <p className="text-lg font-medium text-center">{sentence}</p>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="sm">
                    <Volume2 className="h-4 w-4 mr-1" />
                    Listen
                  </Button>
                  <Button 
                    variant={isRecording ? "destructive" : "default"}
                    size="sm"
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    🎤 {isRecording ? 'Stop' : 'Record'}
                  </Button>
                </div>
                {isRecording && (
                  <div className="text-center">
                    <div className="animate-pulse text-red-600">🔴 Recording...</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button 
          onClick={() => handleMaterialComplete(activeMaterial!.id, 80)}
          className="w-full"
        >
          Complete Practice
        </Button>
      </div>
    );
  };

  const renderMaterialContent = (material: InteractiveMaterial) => {
    switch (material.type) {
      case 'builder':
        return renderSentenceBuilder(material.content);
      case 'drag-drop':
        return renderDragDrop(material.content);
      case 'pronunciation':
        return renderPronunciationPractice(material.content);
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Interactive material coming soon!</p>
            <Button 
              onClick={() => handleMaterialComplete(material.id, 50)}
              className="mt-4"
            >
              Mark as Completed
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((material) => (
          <Card 
            key={material.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeMaterial?.id === material.id ? 'ring-2 ring-blue-500' : ''
            } ${completedMaterials.has(material.id) ? 'bg-green-50 border-green-200' : ''}`}
            onClick={() => setActiveMaterial(material)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{getTypeIcon(material.type)}</span>
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(material.difficulty)}>
                      {material.difficulty}
                    </Badge>
                    {completedMaterials.has(material.id) && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>
                
                <h4 className="font-medium">{material.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{material.description}</p>
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Timer className="h-3 w-3" />
                  {material.estimatedTime} minutes
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Material */}
      {activeMaterial && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">{getTypeIcon(activeMaterial.type)}</span>
                {activeMaterial.title}
              </CardTitle>
              <div className="flex gap-2">
                <Badge className={getDifficultyColor(activeMaterial.difficulty)}>
                  {activeMaterial.difficulty}
                </Badge>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
            <p className="text-gray-600">{activeMaterial.description}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Instructions */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Instructions</h4>
                <ol className="text-sm space-y-1">
                  {activeMaterial.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 font-medium">{index + 1}.</span>
                      {instruction}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Material Content */}
              {renderMaterialContent(activeMaterial)}

              {/* Progress */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-600">
                    {completedMaterials.has(activeMaterial.id) ? 'Completed!' : 'In Progress'}
                  </span>
                </div>
                <Progress 
                  value={completedMaterials.has(activeMaterial.id) ? 100 : 0} 
                  className="h-2" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Summary */}
      {completedMaterials.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Session Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{completedMaterials.size}</div>
                <div className="text-sm text-gray-600">Materials Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{currentScore}</div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{timeSpent}</div>
                <div className="text-sm text-gray-600">Minutes Practiced</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round((completedMaterials.size / materials.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
