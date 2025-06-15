
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Brain, 
  Target, 
  Users, 
  Clock, 
  TrendingUp,
  Eye,
  Ear,
  Hand,
  Lightbulb,
  Zap
} from 'lucide-react';

interface AILessonRecommendationsProps {
  activePhase: number;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic';
}

export const AILessonRecommendations = ({ activePhase, learningStyle }: AILessonRecommendationsProps) => {
  const recommendations = {
    1: {
      visual: [
        {
          title: 'Color-Coded Sentence Building',
          description: 'Use visual anchoring with color patterns for basic sentence construction',
          nlpTechnique: 'Visual Anchoring + Pattern Recognition',
          duration: '45 min',
          effectiveness: 94,
          materials: ['Color cards', 'Sentence builder board', 'Visual timeline']
        },
        {
          title: 'Grammar Visualization Maps',
          description: 'Create mind maps that anchor grammar rules to visual memory',
          nlpTechnique: 'Spatial Anchoring + Visual Memory',
          duration: '30 min',
          effectiveness: 89,
          materials: ['Mind map templates', 'Grammar visual aids', 'Interactive board']
        }
      ],
      auditory: [
        {
          title: 'Rhythm-Based Pronunciation',
          description: 'Musical patterns to anchor correct pronunciation and intonation',
          nlpTechnique: 'Auditory Anchoring + Rhythm Patterns',
          duration: '40 min',
          effectiveness: 92,
          materials: ['Audio tracks', 'Rhythm instruments', 'Recording device']
        },
        {
          title: 'Phonetic Sound Anchoring',
          description: 'Create positive emotional anchors for challenging sounds',
          nlpTechnique: 'Emotional Anchoring + Repetition',
          duration: '35 min',
          effectiveness: 87,
          materials: ['Sound cards', 'Audio loops', 'Feedback system']
        }
      ],
      kinesthetic: [
        {
          title: 'Physical Word Building',
          description: 'Hands-on sentence construction with moveable word blocks',
          nlpTechnique: 'Kinesthetic Anchoring + Spatial Learning',
          duration: '50 min',
          effectiveness: 91,
          materials: ['Word blocks', 'Building mat', 'Action cards']
        },
        {
          title: 'Gesture-Based Grammar',
          description: 'Body movements to anchor grammatical concepts and rules',
          nlpTechnique: 'Body Anchoring + Movement Patterns',
          duration: '45 min',
          effectiveness: 88,
          materials: ['Gesture guide', 'Movement space', 'Mirror']
        }
      ]
    },
    2: {
      visual: [
        {
          title: 'Pattern Recognition Games',
          description: 'Advanced visual patterns for complex grammar structures',
          nlpTechnique: 'Pattern Anchoring + Visual Processing',
          duration: '40 min',
          effectiveness: 96,
          materials: ['Pattern cards', 'Digital board', 'Visual puzzles']
        }
      ],
      auditory: [
        {
          title: 'Musical Grammar Rules',
          description: 'Set grammar patterns to memorable musical compositions',
          nlpTechnique: 'Musical Mnemonics + Pattern Recognition',
          duration: '45 min',
          effectiveness: 93,
          materials: ['Music tracks', 'Lyric sheets', 'Recording tools']
        }
      ],
      kinesthetic: [
        {
          title: 'Grammar Construction Kit',
          description: 'Build complex sentences through physical manipulation',
          nlpTechnique: 'Tactile Learning + Systematic Building',
          duration: '55 min',
          effectiveness: 90,
          materials: ['Construction pieces', 'Rule templates', 'Building guide']
        }
      ]
    },
    3: {
      visual: [
        {
          title: 'Context Scenario Mapping',
          description: 'Visual storytelling with contextual language anchoring',
          nlpTechnique: 'Contextual Anchoring + Visual Narrative',
          duration: '50 min',
          effectiveness: 95,
          materials: ['Scenario cards', 'Visual stories', 'Context boards']
        }
      ],
      auditory: [
        {
          title: 'Conversation Flow Training',
          description: 'Audio-based dialogue patterns for natural communication',
          nlpTechnique: 'Dialogue Anchoring + Flow States',
          duration: '45 min',
          effectiveness: 94,
          materials: ['Dialogue tracks', 'Conversation cards', 'Audio recorder']
        }
      ],
      kinesthetic: [
        {
          title: 'Real-World Role Play',
          description: 'Immersive scenarios with physical interaction and movement',
          nlpTechnique: 'Experiential Anchoring + Physical Context',
          duration: '60 min',
          effectiveness: 97,
          materials: ['Role-play props', 'Scenario setup', 'Activity space']
        }
      ]
    },
    4: {
      visual: [
        {
          title: 'Advanced Expression Tools',
          description: 'Complex visual frameworks for sophisticated communication',
          nlpTechnique: 'Complex Visualization + Fluency Anchoring',
          duration: '45 min',
          effectiveness: 91,
          materials: ['Expression charts', 'Visual frameworks', 'Digital tools']
        }
      ],
      auditory: [
        {
          title: 'Fluency Flow Sessions',
          description: 'Advanced speaking patterns with confidence anchoring',
          nlpTechnique: 'Flow State Anchoring + Confidence Building',
          duration: '50 min',
          effectiveness: 93,
          materials: ['Flow recordings', 'Speaking prompts', 'Feedback system']
        }
      ],
      kinesthetic: [
        {
          title: 'Presentation Mastery',
          description: 'Physical presence and confident expression training',
          nlpTechnique: 'Confidence Anchoring + Body Language',
          duration: '55 min',
          effectiveness: 89,
          materials: ['Presentation space', 'Body language guide', 'Recording device']
        }
      ]
    }
  };

  const currentRecommendations = recommendations[activePhase as keyof typeof recommendations]?.[learningStyle] || [];

  const getStyleIcon = () => {
    switch (learningStyle) {
      case 'visual': return Eye;
      case 'auditory': return Ear;
      case 'kinesthetic': return Hand;
      default: return Brain;
    }
  };

  const StyleIcon = getStyleIcon();

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Sparkles size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">AI-Powered Lesson Recommendations</h2>
              <p className="opacity-90">
                Optimized for Phase {activePhase} • {learningStyle.charAt(0).toUpperCase() + learningStyle.slice(1)} Learning Style
              </p>
              <div className="flex items-center gap-2 mt-2">
                <StyleIcon size={16} />
                <span className="text-sm">Personalized NLP techniques included</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Lessons */}
      <div className="space-y-4">
        {currentRecommendations.map((lesson, index) => (
          <Card key={index} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Lightbulb className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{lesson.title}</h3>
                      <p className="text-gray-600">{lesson.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="bg-purple-100 text-purple-700">
                      <Brain size={12} className="mr-1" />
                      {lesson.nlpTechnique}
                    </Badge>
                    <Badge variant="outline" className="border-green-300 text-green-700">
                      <Target size={12} className="mr-1" />
                      {lesson.effectiveness}% effective
                    </Badge>
                    <Badge variant="outline" className="border-blue-300 text-blue-700">
                      <Clock size={12} className="mr-1" />
                      {lesson.duration}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Required Materials:</p>
                    <div className="flex flex-wrap gap-1">
                      {lesson.materials.map((material, matIndex) => (
                        <Badge key={matIndex} variant="outline" className="text-xs">
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                    <Zap className="mr-2" size={16} />
                    Use Lesson
                  </Button>
                  <Button variant="outline" size="sm">
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    Customize
                  </Button>
                </div>
              </div>
              
              {/* Effectiveness Indicator */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">AI Confidence Score</span>
                  <span className="text-sm font-bold text-green-600">{lesson.effectiveness}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${lesson.effectiveness}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Based on {learningStyle} learning patterns and Phase {activePhase} objectives
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Generate Section */}
      <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Need Something Custom?</h3>
              <p className="opacity-90">Let AI generate a personalized lesson based on your specific requirements</p>
            </div>
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              <Sparkles className="mr-2" size={16} />
              Generate Custom Lesson
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
