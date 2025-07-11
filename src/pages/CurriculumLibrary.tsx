import React, { useState } from 'react';
import { Header } from '@/components/index/Header';
import { Footer } from '@/components/index/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Download, 
  Eye, 
  Star, 
  Search,
  Filter,
  Clock,
  Users,
  FileText,
  Video,
  AudioLines,
  Image as ImageIcon
} from 'lucide-react';

const CurriculumLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const materials = [
    {
      id: 1,
      title: "Beginner Conversation Starters",
      description: "Essential phrases and conversation topics for A1-A2 students",
      level: "A1-A2",
      type: "worksheet",
      duration: "30 min",
      downloads: 1250,
      rating: 4.8,
      category: "Speaking",
      icon: FileText,
      featured: true
    },
    {
      id: 2,
      title: "Intermediate Grammar Bundle",
      description: "Comprehensive grammar exercises covering tenses and structures",
      level: "B1-B2",
      type: "bundle",
      duration: "90 min",
      downloads: 980,
      rating: 4.9,
      category: "Grammar",
      icon: BookOpen,
      featured: false
    },
    {
      id: 3,
      title: "Advanced Reading Comprehension",
      description: "Complex texts with analysis questions for advanced learners",
      level: "C1-C2",
      type: "worksheet",
      duration: "45 min",
      downloads: 756,
      rating: 4.7,
      category: "Reading",
      icon: FileText,
      featured: true
    },
    {
      id: 4,
      title: "Pronunciation Practice Videos",
      description: "Interactive video lessons for accent reduction and clarity",
      level: "A2-B2",
      type: "video",
      duration: "60 min",
      downloads: 2100,
      rating: 4.9,
      category: "Pronunciation",
      icon: Video,
      featured: true
    },
    {
      id: 5,
      title: "Business English Templates",
      description: "Email templates, presentations, and meeting phrases",
      level: "B2-C1",
      type: "template",
      duration: "40 min",
      downloads: 1450,
      rating: 4.6,
      category: "Business",
      icon: FileText,
      featured: false
    },
    {
      id: 6,
      title: "Listening Comprehension Audio",
      description: "Real-world audio scenarios with comprehension questions",
      level: "B1-B2",
      type: "audio",
      duration: "35 min",
      downloads: 890,
      rating: 4.8,
      category: "Listening",
      icon: AudioLines,
      featured: false
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return AudioLines;
      case 'template': return FileText;
      case 'bundle': return BookOpen;
      default: return FileText;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.charAt(0)) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || material.level.includes(levelFilter);
    const matchesType = typeFilter === 'all' || material.type === typeFilter;
    
    return matchesSearch && matchesLevel && matchesType;
  });

  const featuredMaterials = materials.filter(material => material.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="container max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Curriculum Library
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Discover thousands of high-quality teaching materials designed by experienced educators. 
              From beginner worksheets to advanced resources, find everything you need.
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 bg-muted/50">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search materials, topics, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-4">
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="A1">A1 (Beginner)</SelectItem>
                    <SelectItem value="A2">A2 (Elementary)</SelectItem>
                    <SelectItem value="B1">B1 (Intermediate)</SelectItem>
                    <SelectItem value="B2">B2 (Upper-Int.)</SelectItem>
                    <SelectItem value="C1">C1 (Advanced)</SelectItem>
                    <SelectItem value="C2">C2 (Proficient)</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="worksheet">Worksheets</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="template">Templates</SelectItem>
                    <SelectItem value="bundle">Bundles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Materials */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-foreground">Featured Materials</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredMaterials.map((material) => {
                const TypeIcon = getTypeIcon(material.type);
                return (
                  <Card key={material.id} className="hover:shadow-lg transition-shadow border-primary/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <TypeIcon className="h-8 w-8 text-primary mb-2" />
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Featured
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{material.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getLevelColor(material.level)}>
                          {material.level}
                        </Badge>
                        <Badge variant="outline">{material.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 text-sm">
                        {material.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {material.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {material.downloads}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {material.rating}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* All Materials */}
        <section className="py-16 bg-muted/50">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-foreground">
              All Materials ({filteredMaterials.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => {
                const TypeIcon = getTypeIcon(material.type);
                return (
                  <Card key={material.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <TypeIcon className="h-6 w-6 text-primary" />
                        {material.featured && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base">{material.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getLevelColor(material.level)} text-xs`}>
                          {material.level}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{material.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3 text-sm line-clamp-2">
                        {material.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {material.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {material.downloads}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {material.rating}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" className="flex-1 text-xs">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CurriculumLibrary;