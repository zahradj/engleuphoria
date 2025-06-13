import { Resource } from '@/types/curriculum';
import { nlefpCurriculumService, NLEFP_MODULES } from './nlefpCurriculumService';

class ResourceBankService {
  private resources: Resource[] = [];

  constructor() {
    this.initializeNLEFPResources();
  }

  private initializeNLEFPResources() {
    // Add all NLEFP module resources
    const nlefpResources: Resource[] = [];
    
    NLEFP_MODULES.forEach(module => {
      nlefpResources.push(...nlefpCurriculumService.getNLEFPResources(module.id));
    });

    // Add traditional resources
    const traditionalResources: Resource[] = [
      {
        id: "routine_worksheet_01",
        title: "Daily Routine Fill-in-the-Blanks",
        type: "worksheet",
        cefrLevel: "A1",
        skillFocus: ["grammar", "vocabulary"],
        theme: "daily routines",
        duration: 15,
        description: "Practice present simple with daily activities",
        tags: ["present simple", "routines", "beginner"],
        content: {
          exercises: [
            "I _____ up at 7 AM every day. (wake)",
            "She _____ breakfast at 8 AM. (eat)",
            "We _____ to school by bus. (go)"
          ]
        }
      },
      {
        id: "family_game_01",
        title: "Family Tree Interactive Game",
        type: "game",
        cefrLevel: "A1",
        skillFocus: ["vocabulary", "speaking"],
        theme: "family",
        duration: 20,
        description: "Match family members with descriptions using NLP emotional anchors",
        tags: ["family", "possessives", "vocabulary", "nlp"],
        content: {
          gameType: "matching",
          nlpElement: "Emotional anchoring - connect family members to positive feelings",
          pairs: [
            { term: "mother", definition: "your female parent who loves you" },
            { term: "brother", definition: "your male sibling who plays with you" },
            { term: "grandmother", definition: "your mother's mother who tells stories" }
          ]
        }
      },
      {
        id: "weather_visualization_01",
        title: "Weather Visualization Activity",
        type: "interactive",
        cefrLevel: "A1",
        skillFocus: ["vocabulary", "speaking", "critical thinking"],
        theme: "weather",
        duration: 25,
        description: "Use visualization and inferring skills to predict weather",
        tags: ["weather", "visualization", "nlp", "inferring"],
        content: {
          nlpAnchor: "Close your eyes and feel different weather types",
          criticalThinking: "Infer what people wear based on weather clues",
          vakElements: {
            visual: "Weather pictures and clothing images",
            auditory: "Weather sounds (rain, wind, thunder)",
            kinesthetic: "Acting out weather-appropriate activities"
          }
        }
      }
    ];

    this.resources = [...nlefpResources, ...traditionalResources];
  }

  getAllResources(): Resource[] {
    return this.resources;
  }

  getResourcesByModule(moduleTheme: string): Resource[] {
    return this.resources.filter(r => 
      r.theme.toLowerCase().includes(moduleTheme.toLowerCase()) ||
      r.tags.some(tag => tag.toLowerCase().includes(moduleTheme.toLowerCase()))
    );
  }

  getNLEFPResources(): Resource[] {
    return this.resources.filter(r => 
      r.id.startsWith('nlefp_') || 
      r.tags.includes('nlp') ||
      r.content?.nlpAnchor ||
      r.content?.criticalThinking
    );
  }

  getResourcesByLevel(cefrLevel: string): Resource[] {
    return this.resources.filter(r => r.cefrLevel === cefrLevel);
  }

  getResourcesByTheme(theme: string): Resource[] {
    return this.resources.filter(r => 
      r.theme.toLowerCase().includes(theme.toLowerCase()) ||
      r.tags.some(tag => tag.toLowerCase().includes(theme.toLowerCase()))
    );
  }

  getResourceById(id: string): Resource | undefined {
    return this.resources.find(r => r.id === id);
  }

  addResource(resource: Resource): void {
    this.resources.push(resource);
  }

  updateResource(id: string, updates: Partial<Resource>): boolean {
    const index = this.resources.findIndex(r => r.id === id);
    if (index !== -1) {
      this.resources[index] = { ...this.resources[index], ...updates };
      return true;
    }
    return false;
  }

  deleteResource(id: string): boolean {
    const index = this.resources.findIndex(r => r.id === id);
    if (index !== -1) {
      this.resources.splice(index, 1);
      return true;
    }
    return false;
  }

  searchResources(query: string, limit: number = 10): Resource[] {
    const lowerQuery = query.toLowerCase();
    return this.resources
      .filter(r => 
        r.title.toLowerCase().includes(lowerQuery) ||
        r.description.toLowerCase().includes(lowerQuery) ||
        r.theme.toLowerCase().includes(lowerQuery) ||
        r.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
      .slice(0, limit);
  }
}

export const resourceBankService = new ResourceBankService();
