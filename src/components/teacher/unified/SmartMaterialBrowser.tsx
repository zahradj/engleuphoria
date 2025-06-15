
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  FileText, 
  Eye, 
  Gamepad2, 
  Upload, 
  Search,
  Filter,
  Sparkles,
  Target,
  Download,
  Heart
} from 'lucide-react';

interface MaterialItem {
  id: string;
  title: string;
  type: 'lesson' | 'slide' | 'game' | 'worksheet' | 'video';
  level: string;
  skill: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic';
  rating: number;
  usage: number;
  lastUsed?: string;
  tags: string[];
}

interface SmartMaterialBrowserProps {
  selectedLevel: string;
  selectedSkill: string;
  selectedLearningStyle: 'visual' | 'auditory' | 'kinesthetic';
  onLevelChange: (level: string) => void;
  onSkillChange: (skill: string) => void;
  onLearningStyleChange: (style: 'visual' | 'auditory' | 'kinesthetic') => void;
  onMaterialSelect: (material: MaterialItem) => void;
}

export function SmartMaterialBrowser({
  selectedLevel,
  selectedSkill,
  selectedLearningStyle,
  onLevelChange,
  onSkillChange,
  onLearningStyleChange,
  onMaterialSelect
}: SmartMaterialBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  const levels = ['A1', 'A2', 'B1', 'B2'];
  const skills = ['Grammar', 'Vocabulary', 'Speaking', 'Listening', 'Reading', 'Writing'];
  const learningStyles = [
    { type: 'visual' as const, name: 'Visual', icon: Eye, color: 'bg-blue-100 text-blue-800' },
    { type: 'auditory' as const, name: 'Auditory', icon: require('lucide-react').Ear, color: 'bg-green-100 text-green-800' },
    { type: 'kinesthetic' as const, name: 'Kinesthetic', icon: require('lucide-react').Hand, color: 'bg-purple-100 text-purple-800' }
  ];

  // Mock material data - in real app this would come from API
  const materials: MaterialItem[] = [
    {
      id: '1',
      title: 'Past Tense Detective Game',
      type: 'game',
      level: selectedLevel,
      skill: 'Grammar',
      learningStyle: 'kinesthetic',
      rating: 4.8,
      usage: 156,
      lastUsed: '2 days ago',
      tags: ['interactive', 'past-tense', 'detective']
    },
    {
      id: '2',
      title: 'Animal Vocabulary Slides',
      type: 'slide',
      level: selectedLevel,
      skill: 'Vocabulary',
      learningStyle: 'visual',
      rating: 4.6,
      usage: 98,
      lastUsed: '1 week ago',
      tags: ['animals', 'vocabulary', 'colorful']
    },
    {
      id: '3',
      title: 'Conversation Starters Worksheet',
      type: 'worksheet',
      level: selectedLevel,
      skill: 'Speaking',
      learningStyle: 'auditory',
      rating: 4.5,
      usage: 89,
      tags: ['conversation', 'speaking', 'social']
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return FileText;
      case 'slide': return Eye;
      case 'game': return Gamepad2;
      case 'worksheet': return FileText;
      case 'video': return Eye;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'bg-blue-100 text-blue-800';
      case 'slide': return 'bg-green-100 text-green-800';
      case 'game': return 'bg-purple-100 text-purple-800';
      case 'worksheet': return 'bg-orange-100 text-orange-800';
      case 'video': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSkill = selectedSkill === 'All' || material.skill === selectedSkill;
    return matchesSearch && matchesSkill;
  });

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="text-purple-500" />
          Smart Material Browser
          <Badge className="bg-purple-100 text-purple-700">
            <Sparkles size={12} className="mr-1" />
            AI-Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Level Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Level</label>
            <select 
              value={selectedLevel} 
              onChange={(e) => onLevelChange(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Skill Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Skill Focus</label>
            <select 
              value={selectedSkill} 
              onChange={(e) => onSkillChange(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="All">All Skills</option>
              {skills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          {/* Learning Style */}
          <div>
            <label className="text-sm font-medium mb-2 block">Learning Style</label>
            <div className="flex gap-1">
              {learningStyles.map((style) => (
                <Button
                  key={style.type}
                  variant={selectedLearningStyle === style.type ? "default" : "outline"}
                  size="sm"
                  onClick={() => onLearningStyleChange(style.type)}
                  className="flex-1 text-xs"
                  title={style.name}
                >
                  <style.icon size={12} />
                </Button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="text-sm font-medium mb-2 block">Search</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant={showFavorites ? "default" : "outline"} 
            size="sm"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            <Heart size={14} className="mr-1" />
            Favorites
          </Button>
          <Button variant="outline" size="sm">
            <Filter size={14} className="mr-1" />
            Advanced Filters
          </Button>
          <Button variant="outline" size="sm">
            <Upload size={14} className="mr-1" />
            Upload Custom
          </Button>
        </div>

        {/* Material Results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-800">
              {filteredMaterials.length} materials found
            </h4>
            <Button variant="ghost" size="sm">
              <Target size={14} className="mr-1" />
              AI Suggest Best Match
            </Button>
          </div>

          {filteredMaterials.map((material) => {
            const TypeIcon = getTypeIcon(material.type);
            return (
              <div 
                key={material.id}
                className="group p-4 rounded-lg border hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 cursor-pointer"
                onClick={() => onMaterialSelect(material)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white">
                      <TypeIcon size={16} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-gray-800">{material.title}</h5>
                        <Badge className={getTypeColor(material.type)}>
                          {material.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>★ {material.rating}</span>
                        <span>Used {material.usage} times</span>
                        {material.lastUsed && <span>Last used: {material.lastUsed}</span>}
                      </div>
                      
                      <div className="flex gap-1 flex-wrap">
                        {material.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline">
                      <Eye size={14} className="mr-1" />
                      Preview
                    </Button>
                    <Button size="sm">
                      <Download size={14} className="mr-1" />
                      Use
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
            <p>No materials found for your criteria</p>
            <Button variant="outline" size="sm" className="mt-2">
              <Upload size={14} className="mr-1" />
              Upload New Material
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
