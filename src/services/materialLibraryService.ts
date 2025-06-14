
import { Material, MaterialFilter, AIGenerationRequest } from '@/types/materialLibrary';

class MaterialLibraryService {
  private materials: Material[] = [
    {
      id: 'mat_1',
      title: 'Animals Vocabulary Worksheet',
      description: 'Learn animal names with pictures and exercises',
      type: 'worksheet',
      level: 'beginner',
      subject: 'Vocabulary',
      topic: 'Animals',
      duration: 20,
      createdBy: 'teacher',
      createdAt: new Date('2024-01-15'),
      lastModified: new Date('2024-01-15'),
      tags: ['animals', 'vocabulary', 'pictures'],
      downloads: 45,
      rating: 4.5,
      isPublic: true
    },
    {
      id: 'mat_2',
      title: 'Daily Routines Speaking Activity',
      description: 'Interactive speaking practice about daily activities',
      type: 'activity',
      level: 'intermediate',
      subject: 'Speaking',
      topic: 'Daily Life',
      duration: 30,
      createdBy: 'teacher',
      createdAt: new Date('2024-01-20'),
      lastModified: new Date('2024-01-20'),
      tags: ['speaking', 'daily routines', 'interactive'],
      downloads: 32,
      rating: 4.8,
      isPublic: true
    }
  ];

  getAllMaterials(): Material[] {
    return this.materials;
  }

  getFilteredMaterials(filter: MaterialFilter): Material[] {
    return this.materials.filter(material => {
      if (filter.type && material.type !== filter.type) return false;
      if (filter.level && material.level !== filter.level) return false;
      if (filter.subject && material.subject !== filter.subject) return false;
      if (filter.createdBy && material.createdBy !== filter.createdBy) return false;
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return (
          material.title.toLowerCase().includes(searchLower) ||
          material.description.toLowerCase().includes(searchLower) ||
          material.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });
  }

  getMaterialById(id: string): Material | undefined {
    return this.materials.find(material => material.id === id);
  }

  addMaterial(material: Omit<Material, 'id' | 'createdAt' | 'lastModified' | 'downloads' | 'rating'>): Material {
    const newMaterial: Material = {
      ...material,
      id: `mat_${Date.now()}`,
      createdAt: new Date(),
      lastModified: new Date(),
      downloads: 0,
      rating: 0
    };
    
    this.materials.push(newMaterial);
    return newMaterial;
  }

  generateAIMaterial(request: AIGenerationRequest): Promise<Material> {
    return new Promise((resolve) => {
      // Simulate AI generation delay
      setTimeout(() => {
        const aiMaterial: Material = {
          id: `ai_${Date.now()}`,
          title: `AI-Generated ${request.type}: ${request.topic}`,
          description: `AI-created ${request.type} for ${request.level} level students about ${request.topic}`,
          type: request.type as any,
          level: request.level,
          subject: this.getSubjectFromTopic(request.topic),
          topic: request.topic,
          duration: request.duration,
          content: this.generateAIContent(request),
          createdBy: 'ai',
          createdAt: new Date(),
          lastModified: new Date(),
          tags: [request.topic, request.level, 'ai-generated'],
          downloads: 0,
          rating: 0,
          isPublic: false,
          isAIGenerated: true
        };
        
        this.materials.push(aiMaterial);
        resolve(aiMaterial);
      }, 2000);
    });
  }

  private getSubjectFromTopic(topic: string): string {
    const topicMappings: { [key: string]: string } = {
      'animals': 'Vocabulary',
      'food': 'Vocabulary',
      'family': 'Vocabulary',
      'colors': 'Vocabulary',
      'numbers': 'Mathematics',
      'daily routines': 'Speaking',
      'hobbies': 'Speaking',
      'travel': 'Speaking',
      'grammar': 'Grammar',
      'reading': 'Reading'
    };
    
    return topicMappings[topic.toLowerCase()] || 'General';
  }

  private generateAIContent(request: AIGenerationRequest) {
    switch (request.type) {
      case 'worksheet':
        return {
          exercises: [
            `Fill in the blanks about ${request.topic}`,
            `Match the ${request.topic} with their descriptions`,
            `Complete the sentences using ${request.topic} vocabulary`
          ],
          questions: 10,
          answerKey: true
        };
      case 'activity':
        return {
          instructions: `Interactive ${request.level} activity about ${request.topic}`,
          materials: ['Whiteboard', 'Cards', 'Audio'],
          steps: [
            'Warm-up discussion',
            'Main activity',
            'Practice phase',
            'Wrap-up and review'
          ]
        };
      case 'quiz':
        return {
          questions: [
            { type: 'multiple-choice', question: `What is related to ${request.topic}?`, options: ['A', 'B', 'C', 'D'] },
            { type: 'true-false', question: `${request.topic} statement`, answer: true },
            { type: 'fill-blank', question: `Complete: ${request.topic} is ____` }
          ]
        };
      case 'flashcards':
        return {
          cards: [
            { front: `${request.topic} term 1`, back: 'Definition 1' },
            { front: `${request.topic} term 2`, back: 'Definition 2' },
            { front: `${request.topic} term 3`, back: 'Definition 3' }
          ]
        };
      default:
        return { content: `Generated content for ${request.topic}` };
    }
  }

  deleteMaterial(id: string): boolean {
    const index = this.materials.findIndex(material => material.id === id);
    if (index !== -1) {
      this.materials.splice(index, 1);
      return true;
    }
    return false;
  }

  updateMaterial(id: string, updates: Partial<Material>): boolean {
    const index = this.materials.findIndex(material => material.id === id);
    if (index !== -1) {
      this.materials[index] = {
        ...this.materials[index],
        ...updates,
        lastModified: new Date()
      };
      return true;
    }
    return false;
  }
}

export const materialLibraryService = new MaterialLibraryService();
