
import { Resource } from '@/types/curriculum';

class ResourceBankService {
  private resources: Resource[] = [];

  constructor() {
    this.initializeMockResources();
  }

  private initializeMockResources() {
    this.resources = [
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
        description: "Match family members with descriptions",
        tags: ["family", "possessives", "vocabulary"],
        content: {
          gameType: "matching",
          pairs: [
            { term: "mother", definition: "your female parent" },
            { term: "brother", definition: "your male sibling" },
            { term: "grandmother", definition: "your mother's mother" }
          ]
        }
      },
      {
        id: "food_video_01",
        title: "Healthy Foods Around the World",
        type: "video",
        cefrLevel: "A2",
        skillFocus: ["listening", "vocabulary"],
        theme: "food",
        duration: 10,
        description: "Learn food vocabulary through cultural exploration",
        tags: ["food", "culture", "listening"],
        url: "https://example.com/food-video"
      },
      {
        id: "animals_interactive_01",
        title: "Animal Sounds Quiz",
        type: "interactive",
        cefrLevel: "A1",
        skillFocus: ["listening", "vocabulary"],
        theme: "animals",
        duration: 12,
        description: "Match animals with their sounds",
        tags: ["animals", "sounds", "quiz"],
        content: {
          questions: [
            { animal: "cow", sound: "moo", options: ["moo", "bark", "meow"] },
            { animal: "cat", sound: "meow", options: ["moo", "bark", "meow"] }
          ]
        }
      }
    ];
  }

  getAllResources(): Resource[] {
    return this.resources;
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

  // Search resources by similarity (simplified version)
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
