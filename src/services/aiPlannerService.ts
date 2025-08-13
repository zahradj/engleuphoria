import { PlannerRequest, PlannerResponse, CurriculumPlan, Resource } from '@/types/curriculum';
import { nlefpCurriculumService, NLEFP_MODULES } from './nlefpCurriculumService';
import { supabase } from '@/integrations/supabase/client';

class AIPlannerService {
  // Remove client-side API key storage for security

  private buildNLEFPPrompt(request: PlannerRequest): string {
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
You are an expert ESL curriculum designer specializing in the Neuro-Linguistic English Fluency Program (NLEFP). 
You follow CEFR standards, Bloom's taxonomy, and apply Neuro-Linguistic Programming (NLP) strategies to boost memory and motivation. 
Output valid JSON only.

NLEFP Framework - 12 Core Modules:
${NLEFP_MODULES.map(m => `${m.id}. ${m.theme} - ${m.coreFocus} (NLP: ${m.nlpAnchor}, Thinking: ${m.thinkingSkill})`).join('\n')}

USER:
Create a personalized NLEFP curriculum plan.

Student profile:
  • Age: ${studentProfile.age}
  • Current level: ${studentProfile.cefrLevel}
  • Strengths: ${studentProfile.strengths.join(', ')}
  • Gaps: ${studentProfile.gaps.join(', ')}
  • Learning style: ${studentProfile.learningStyle}
  • Interests: ${studentProfile.interests.join(', ')}
  • Weekly minutes: ${studentProfile.weeklyMinutes}

Resources available: ${JSON.stringify(resourceSchema, null, 2)}

NLEFP Design Rules:
1. Use 6-part lesson structure: Welcome Ritual (5min) → Warm-Up & Hook (5min) → Presentation (10min) → Practice (20min) → Production (15min) → Review & Reflect (5min)
2. Every 4th week is a Progress Week (review, portfolio, video recording, certificates)
3. Include NLP anchors: visualization, future pacing, embedded commands, emotional anchors
4. Integrate critical thinking skills: categorization, sequencing, compare/contrast, cause/effect, etc.
5. VAK learning: Visual-Auditory-Kinesthetic elements in each lesson
6. Metacognitive elements: "Think about your thinking"
7. Reward system: XP (30-50 per lesson, 100 for progress weeks), badges, certificates

Output JSON schema:
{
  "weeks": [
    {
      "theme": "NLEFP Module Theme",
      "isProgressWeek": false,
      "lessons": [
        {
          "objective": "CEFR-aligned learning objective",
          "resources": [{"id": "", "type": "worksheet|game|video|interactive"}],
          "nlpAnchor": "Specific NLP technique with visualization/future pacing",
          "criticalThinking": "Higher-order thinking task",
          "homework": "Creative homework with reflection component",
          "xpReward": 50,
          "lessonStructure": {
            "welcomeRitual": "Confidence building + progress visualization",
            "warmUpHook": "Engaging game/activity with NLP element",
            "presentation": "VAK format introduction of target language",
            "practice": "Interactive practice with critical thinking",
            "production": "Student creation/performance task",
            "reviewReflect": "Self-assessment + metacognitive reflection"
          },
          "vakElements": {
            "visual": "Specific visual learning component",
            "auditory": "Specific auditory learning component", 
            "kinesthetic": "Specific kinesthetic learning component"
          }
        }
      ]
    }
  ],
  "badgeRule": "Module completion badge name = 300 XP",
  "progressTracking": {
    "skillsToTrack": ["listening", "speaking", "reading", "writing", "critical_thinking"],
    "nlpAnchorsUsed": ["visualization", "future_pacing", "emotional_anchors"],
    "metacognitionPrompts": ["reflection questions for student"]
  }
}`;
  }

  async generateCurriculum(request: PlannerRequest): Promise<PlannerResponse> {
    try {
      // Use secure server-side OpenAI integration
      const { data, error } = await supabase.functions.invoke('ai-curriculum-planner', {
        body: { plannerRequest: request }
      });

      if (error) {
        console.error('AI Planner error:', error);
        return this.generateNLEFPCurriculum(request);
      }

      if (data.success) {
        return { success: true, plan: data.plan };
      } else {
        console.error('AI Planner error:', data.error);
        return this.generateNLEFPCurriculum(request);
      }

    } catch (error) {
      console.error('AI Planner error:', error);
      return this.generateNLEFPCurriculum(request);
    }
  }

  generateNLEFPCurriculum(request: PlannerRequest): PlannerResponse {
    return nlefpCurriculumService.generateNLEFPCurriculum(request);
  }

  // Keep existing generateMockCurriculum method for backwards compatibility
  generateMockCurriculum(request: PlannerRequest): PlannerResponse {
    return this.generateNLEFPCurriculum(request);
  }
}

export const aiPlannerService = new AIPlannerService();
