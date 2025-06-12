
import { PlannerRequest, PlannerResponse, CurriculumPlan, Resource } from '@/types/curriculum';

class AIPlannerService {
  private apiKey: string | null = null;

  constructor() {
    // Try to get API key from localStorage for now
    if (typeof window !== 'undefined') {
      this.apiKey = localStorage.getItem('openai_api_key');
    }
  }

  setApiKey(key: string) {
    this.apiKey = key;
    if (typeof window !== 'undefined') {
      localStorage.setItem('openai_api_key', key);
    }
  }

  private buildPrompt(request: PlannerRequest): string {
    const { studentProfile, availableResources } = request;
    
    const resourceSchema = availableResources.slice(0, 20).map(r => ({
      id: r.id,
      title: r.title,
      type: r.type,
      level: r.cefrLevel,
      theme: r.theme,
      duration: r.duration
    }));

    return `SYSTEM:
You are an expert ESL curriculum designer who follows CEFR, Bloom's taxonomy, and applies Neuro-Linguistic Programming (NLP) strategies to boost memory and motivation. Output valid JSON only.

USER:
Create a 6-week personalised learning plan.

Student profile:
  • Age: ${studentProfile.age}
  • Current level: ${studentProfile.cefrLevel}
  • Strengths: ${studentProfile.strengths.join(', ')}
  • Gaps: ${studentProfile.gaps.join(', ')}
  • Preferred channel: ${studentProfile.learningStyle}
  • Interests: ${studentProfile.interests.join(', ')}
  • Weekly lesson budget: ${studentProfile.weeklyMinutes} minutes

Resources available: ${JSON.stringify(resourceSchema, null, 2)}

Design rules:
1. Follow "PPP": Presentation-Practice-Production.
2. Map each week to one mini-theme that excites the learner.
3. For each lesson include:
   - Objective (measurable, CEFR link)
   - Warm-up with NLP anchor (visualisation / future-pacing)
   - Core input (vocab / grammar) and activity link from resource bank ID
   - Critical-thinking task (compare / infer / predict)
   - Homework suggestion
4. Reward triggers:
   - +10 XP for completing warm-up
   - +20 XP for 100% homework
   - Badge when XP ≥ 200 (name badge)
5. Output JSON schema:

{
  "weeks": [
    {
      "theme": "",
      "lessons": [
        {
          "objective": "",
          "resources": [ { "id": "", "type": "worksheet|game|video" } ],
          "nlp_anchor": "",
          "critical_thinking": "",
          "homework": "",
          "xp_reward": 30
        }
      ]
    }
  ],
  "badge_rule": "Grammar Guardian = 200 XP"
}`;
  }

  async generateCurriculum(request: PlannerRequest): Promise<PlannerResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'OpenAI API key not configured'
      };
    }

    try {
      const prompt = this.buildPrompt(request);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from API');
      }

      // Parse the JSON response
      const planData = JSON.parse(content);
      
      // Create curriculum plan object
      const plan: CurriculumPlan = {
        id: `plan_${Date.now()}`,
        studentId: request.studentProfile.id,
        weeks: planData.weeks,
        badgeRule: planData.badge_rule,
        createdAt: new Date(),
        status: 'draft'
      };

      return {
        success: true,
        plan
      };

    } catch (error) {
      console.error('AI Planner error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Mock function for demonstration when API key is not available
  generateMockCurriculum(request: PlannerRequest): PlannerResponse {
    const { studentProfile } = request;
    
    const mockPlan: CurriculumPlan = {
      id: `mock_plan_${Date.now()}`,
      studentId: studentProfile.id,
      weeks: [
        {
          theme: "Daily Routines & Family",
          lessons: [
            {
              objective: "Students will be able to describe their daily routine using present simple tense",
              resources: [{ id: "routine_worksheet_01", type: "worksheet" }],
              nlpAnchor: "Visualize your perfect morning routine in English",
              criticalThinking: "Compare your routine with a child from another country",
              homework: "Create a visual diary of your day with English labels",
              xpReward: 30
            },
            {
              objective: "Students will identify and name family members with possessive pronouns",
              resources: [{ id: "family_game_01", type: "game" }],
              nlpAnchor: "Imagine introducing your family to a new English-speaking friend",
              criticalThinking: "Predict which family member would enjoy learning English most",
              homework: "Draw your family tree with English descriptions",
              xpReward: 25
            }
          ]
        },
        {
          theme: "Food & Healthy Habits",
          lessons: [
            {
              objective: "Students will express food preferences using 'like/don't like' and food vocabulary",
              resources: [{ id: "food_video_01", type: "video" }],
              nlpAnchor: "Picture yourself ordering your favorite meal in English",
              criticalThinking: "Analyze why different cultures prefer different foods",
              homework: "Create a healthy meal plan with English food names",
              xpReward: 30
            }
          ]
        }
      ],
      badgeRule: "Routine Master = 200 XP",
      createdAt: new Date(),
      status: 'draft'
    };

    return {
      success: true,
      plan: mockPlan
    };
  }
}

export const aiPlannerService = new AIPlannerService();
