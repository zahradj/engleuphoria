
import { AIContentRequest, AIGeneratedContent } from './types';
import { contentTemplateService } from './contentTemplateService';

export class MockContentService {
  generateMockContent(request: AIContentRequest): AIGeneratedContent {
    const template = contentTemplateService.generateFromTemplate(request.type, {
      topic: request.topic,
      level: request.level,
      duration: request.duration || 30
    });

    return {
      id: `mock_${Date.now()}`,
      title: `${request.type.charAt(0).toUpperCase() + request.type.slice(1).replace('_', ' ')}: ${request.topic}`,
      type: request.type,
      topic: request.topic,
      level: request.level,
      duration: request.duration || 30,
      content: template,
      metadata: {
        generatedAt: new Date().toISOString(),
        isAIGenerated: true,
        isMockData: true,
        generationTime: 500
      }
    };
  }
}

export const mockContentService = new MockContentService();
