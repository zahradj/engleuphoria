
export interface CurriculumContent {
  id: string;
  title: string;
  description: string;
  type: 'worksheet' | 'game' | 'video' | 'audio' | 'interactive' | 'image';
  cefrLevel: string;
  skillFocus: string[];
  theme: string;
  duration: number;
  framework: 'Traditional' | 'NLEFP';
  collection?: string;
  tags: string[];
  file?: File;
  fileUrl?: string;
  fileSize?: number;
  uploadedBy: string;
  uploadDate: Date;
  downloads: number;
  views: number;
  lastAccessed?: Date;
}

interface UploadContentRequest {
  title: string;
  description: string;
  type: 'worksheet' | 'game' | 'video' | 'audio' | 'interactive';
  cefrLevel: string;
  skillFocus: string;
  theme: string;
  duration: number;
  framework: 'Traditional' | 'NLEFP';
  collection?: string;
  tags: string[];
  file: File;
  uploadedBy: string;
  uploadDate: Date;
}

class CurriculumLibraryService {
  private content: CurriculumContent[] = [
    {
      id: "1",
      title: "Animal Vocabulary Worksheet",
      description: "Comprehensive worksheet covering domestic and wild animals with pictures and exercises",
      type: "worksheet",
      cefrLevel: "A1",
      skillFocus: ["vocabulary", "reading"],
      theme: "Animals",
      duration: 20,
      framework: "Traditional",
      tags: ["animals", "vocabulary", "pictures", "exercises"],
      fileUrl: "animals_worksheet.pdf",
      fileSize: 2.3,
      uploadedBy: "teacher",
      uploadDate: new Date("2024-01-15"),
      downloads: 87,
      views: 234,
      lastAccessed: new Date("2024-01-20")
    },
    {
      id: "2",
      title: "Family Tree Interactive Game",
      description: "Interactive game for learning family relationships and possessive pronouns",
      type: "game",
      cefrLevel: "A1",
      skillFocus: ["vocabulary", "grammar", "speaking"],
      theme: "Family",
      duration: 25,
      framework: "NLEFP",
      tags: ["family", "possessives", "interactive", "nlp"],
      fileUrl: "family_game.html",
      fileSize: 1.8,
      uploadedBy: "teacher",
      uploadDate: new Date("2024-01-18"),
      downloads: 76,
      views: 198,
      lastAccessed: new Date("2024-01-22")
    },
    {
      id: "3",
      title: "Weather Sounds Audio Collection",
      description: "Audio collection featuring various weather sounds for listening comprehension",
      type: "audio",
      cefrLevel: "A2",
      skillFocus: ["listening", "vocabulary"],
      theme: "Weather",
      duration: 15,
      framework: "Traditional",
      tags: ["weather", "sounds", "listening", "comprehension"],
      fileUrl: "weather_sounds.mp3",
      fileSize: 5.2,
      uploadedBy: "teacher",
      uploadDate: new Date("2024-01-20"),
      downloads: 65,
      views: 167,
      lastAccessed: new Date("2024-01-25")
    }
  ];

  getAllContent(): CurriculumContent[] {
    return this.content;
  }

  getContentById(id: string): CurriculumContent | undefined {
    return this.content.find(item => item.id === id);
  }

  async uploadContent(request: UploadContentRequest): Promise<CurriculumContent> {
    // Simulate file upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const fileType = this.getFileType(request.file);
    
    const newContent: CurriculumContent = {
      id: Date.now().toString(),
      title: request.title,
      description: request.description,
      type: fileType,
      cefrLevel: request.cefrLevel,
      skillFocus: request.skillFocus.split(",").map(s => s.trim()).filter(Boolean),
      theme: request.theme,
      duration: request.duration,
      framework: request.framework,
      collection: request.collection,
      tags: request.tags,
      file: request.file,
      fileUrl: URL.createObjectURL(request.file),
      fileSize: Number((request.file.size / 1024 / 1024).toFixed(1)),
      uploadedBy: request.uploadedBy,
      uploadDate: request.uploadDate,
      downloads: 0,
      views: 0
    };

    this.content.push(newContent);
    return newContent;
  }

  private getFileType(file: File): CurriculumContent['type'] {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) return 'worksheet';
    return 'interactive';
  }

  deleteContent(id: string): boolean {
    const index = this.content.findIndex(item => item.id === id);
    if (index !== -1) {
      this.content.splice(index, 1);
      return true;
    }
    return false;
  }

  updateContent(id: string, updates: Partial<CurriculumContent>): boolean {
    const index = this.content.findIndex(item => item.id === id);
    if (index !== -1) {
      this.content[index] = { ...this.content[index], ...updates };
      return true;
    }
    return false;
  }

  searchContent(query: string): CurriculumContent[] {
    const lowerQuery = query.toLowerCase();
    return this.content.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.theme.toLowerCase().includes(lowerQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  getContentByFramework(framework: 'Traditional' | 'NLEFP'): CurriculumContent[] {
    return this.content.filter(item => item.framework === framework);
  }

  getContentByLevel(cefrLevel: string): CurriculumContent[] {
    return this.content.filter(item => item.cefrLevel === cefrLevel);
  }

  getContentByTheme(theme: string): CurriculumContent[] {
    return this.content.filter(item => 
      item.theme.toLowerCase().includes(theme.toLowerCase())
    );
  }

  incrementViews(id: string): void {
    const item = this.getContentById(id);
    if (item) {
      item.views++;
      item.lastAccessed = new Date();
    }
  }

  incrementDownloads(id: string): void {
    const item = this.getContentById(id);
    if (item) {
      item.downloads++;
      item.lastAccessed = new Date();
    }
  }

  getUsageStats() {
    return {
      totalItems: this.content.length,
      totalDownloads: this.content.reduce((sum, item) => sum + item.downloads, 0),
      totalViews: this.content.reduce((sum, item) => sum + item.views, 0),
      byLevel: this.getStatsByLevel(),
      byType: this.getStatsByType(),
      topPerforming: this.getTopPerformingContent()
    };
  }

  private getStatsByLevel() {
    const levelCounts: Record<string, number> = {};
    this.content.forEach(item => {
      levelCounts[item.cefrLevel] = (levelCounts[item.cefrLevel] || 0) + 1;
    });
    return levelCounts;
  }

  private getStatsByType() {
    const typeCounts: Record<string, number> = {};
    this.content.forEach(item => {
      typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
    });
    return typeCounts;
  }

  private getTopPerformingContent(limit: number = 5) {
    return [...this.content]
      .sort((a, b) => (b.downloads + b.views) - (a.downloads + a.views))
      .slice(0, limit);
  }
}

export const curriculumLibraryService = new CurriculumLibraryService();
