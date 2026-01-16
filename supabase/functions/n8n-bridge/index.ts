import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const n8nWebhookUrl = Deno.env.get("N8N_WEBHOOK_URL");

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify admin auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userError || !userData || userData.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { action, topic, system, level, level_id, cefr_level } = body;

    console.log("n8n-bridge request:", { action, topic, system, level, cefr_level });

    if (action === "generate-lesson") {
      if (!n8nWebhookUrl) {
        // If n8n webhook is not configured, use the built-in AI lesson generator
        console.log("n8n webhook not configured, using built-in generator");
        
        const lesson = generateComprehensiveLesson(topic, system, level, cefr_level);
        
        return new Response(
          JSON.stringify({ 
            status: "success", 
            data: lesson,
            message: "Generated using built-in generator (n8n not configured)"
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Try to forward to n8n webhook
      console.log("Forwarding to n8n webhook:", n8nWebhookUrl);
      
      try {
        const n8nResponse = await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            system,
            level,
            level_id,
            cefr_level,
          }),
        });

        if (!n8nResponse.ok) {
          const errorText = await n8nResponse.text();
          console.warn("n8n webhook failed, falling back to built-in generator:", n8nResponse.status, errorText);
          
          // Fall back to built-in generator when n8n fails
          const lesson = generateComprehensiveLesson(topic, system, level, cefr_level);
          return new Response(
            JSON.stringify({ 
              status: "success", 
              data: lesson,
              message: `Generated using built-in generator (n8n returned ${n8nResponse.status})`
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const n8nData = await n8nResponse.json();
        console.log("n8n response:", n8nData);

        // Check if n8n returned actual lesson data or just an async confirmation
        if (n8nData.message === "Workflow was started" || !n8nData.presentation) {
          // n8n is async, fall back to built-in generator
          console.log("n8n webhook is async, using built-in generator as fallback");
          const lesson = generateComprehensiveLesson(topic, system, level, cefr_level);
          
          return new Response(
            JSON.stringify({ 
              status: "success", 
              data: lesson,
              message: "Generated using built-in generator (n8n workflow is async)"
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ status: "success", data: n8nData }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (n8nError) {
        console.warn("n8n webhook error, falling back to built-in generator:", n8nError);
        
        // Fall back to built-in generator when n8n is unreachable
        const lesson = generateComprehensiveLesson(topic, system, level, cefr_level);
        return new Response(
          JSON.stringify({ 
            status: "success", 
            data: lesson,
            message: "Generated using built-in generator (n8n unreachable)"
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("n8n-bridge error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Vocabulary banks by topic
const vocabularyBanks: Record<string, Array<{ word: string; ipa: string; definition: string; example: string }>> = {
  "present continuous": [
    { word: "happening", ipa: "/ˈhæp.ən.ɪŋ/", definition: "taking place at this moment", example: "Something exciting is happening right now." },
    { word: "currently", ipa: "/ˈkʌr.ənt.li/", definition: "at the present time", example: "I am currently studying for my exam." },
    { word: "temporary", ipa: "/ˈtem.pər.ər.i/", definition: "lasting for only a short time", example: "This is just a temporary situation." },
    { word: "progress", ipa: "/ˈprɒɡ.res/", definition: "movement towards a goal", example: "The project is making good progress." },
  ],
  "modal verbs": [
    { word: "ability", ipa: "/əˈbɪl.ə.ti/", definition: "the power or skill to do something", example: "She has the ability to speak three languages." },
    { word: "permission", ipa: "/pəˈmɪʃ.ən/", definition: "consent or authorization", example: "You need permission to enter this area." },
    { word: "obligation", ipa: "/ˌɒb.lɪˈɡeɪ.ʃən/", definition: "something you must do", example: "We have an obligation to help others." },
    { word: "possibility", ipa: "/ˌpɒs.əˈbɪl.ə.ti/", definition: "something that might happen", example: "There is a possibility of rain tomorrow." },
  ],
  "conditionals": [
    { word: "consequence", ipa: "/ˈkɒn.sɪ.kwəns/", definition: "a result of an action", example: "Every action has a consequence." },
    { word: "hypothetical", ipa: "/ˌhaɪ.pəˈθet.ɪ.kəl/", definition: "imagined or not real", example: "Let's consider a hypothetical situation." },
    { word: "unlikely", ipa: "/ʌnˈlaɪk.li/", definition: "probably not going to happen", example: "It's unlikely that it will snow in July." },
    { word: "regret", ipa: "/rɪˈɡret/", definition: "to feel sorry about something", example: "I regret not studying harder." },
  ],
};

// Grammar patterns by topic
const grammarPatterns: Record<string, { rule: string; pattern: string; examples: string[]; mistakes: string[] }> = {
  "present continuous": {
    rule: "Use the Present Continuous to describe actions happening now or temporary situations. It shows something is in progress at the moment of speaking.",
    pattern: "Subject + am/is/are + verb-ing",
    examples: [
      "I am reading a book right now.",
      "She is working from home today.",
      "They are playing football in the park.",
      "We are learning English this semester.",
    ],
    mistakes: [
      "I am work now. ✗ → I am working now. ✓",
      "She is have lunch. ✗ → She is having lunch. ✓",
      "He working hard. ✗ → He is working hard. ✓",
    ],
  },
  "modal verbs": {
    rule: "Modal verbs express ability, possibility, permission, or obligation. They do not change form and are followed by the base form of the main verb.",
    pattern: "Subject + modal (can/could/may/might/must/should) + base verb",
    examples: [
      "I can speak English fluently.",
      "You should study more.",
      "She must finish her homework.",
      "They might come to the party.",
    ],
    mistakes: [
      "He can to swim. ✗ → He can swim. ✓",
      "She must studies. ✗ → She must study. ✓",
      "I should to go. ✗ → I should go. ✓",
    ],
  },
  "conditionals": {
    rule: "Conditionals express hypothetical situations and their consequences. Different types express different levels of possibility or reality.",
    pattern: "If + condition clause, + result clause",
    examples: [
      "If it rains, I will stay home. (First Conditional - real possibility)",
      "If I had money, I would travel. (Second Conditional - unreal present)",
      "If I had studied, I would have passed. (Third Conditional - unreal past)",
    ],
    mistakes: [
      "If I will see him, I tell him. ✗ → If I see him, I will tell him. ✓",
      "If I would have money, I buy it. ✗ → If I had money, I would buy it. ✓",
    ],
  },
};

// System-specific contexts
const systemContexts: Record<string, { scenario: string; vocabulary: string[]; activities: string[] }> = {
  kids: {
    scenario: "playground, classroom, birthday party, zoo visit",
    vocabulary: ["fun", "play", "friend", "happy", "exciting"],
    activities: ["coloring", "matching pictures", "singing songs", "playing games", "acting out"],
  },
  teen: {
    scenario: "social media, school project, hanging out with friends, part-time job",
    vocabulary: ["cool", "awesome", "trending", "vibe", "literally"],
    activities: ["role-play", "debate", "create a TikTok script", "group discussion", "peer review"],
  },
  adult: {
    scenario: "business meeting, job interview, professional email, client presentation",
    vocabulary: ["professional", "deadline", "collaborate", "implement", "strategy"],
    activities: ["case study", "email drafting", "meeting simulation", "presentation", "negotiation"],
  },
};

interface Slide {
  id: string;
  type: string;
  title: string;
  phase: "presentation" | "practice" | "production";
  phaseLabel: string;
  content: Record<string, any>;
  imageUrl?: string;
  teacherNotes: string;
  durationSeconds: number;
}

function generateComprehensiveLesson(topic: string, system: string, level: string, cefrLevel: string) {
  const topicLower = topic.toLowerCase();
  const vocabulary = vocabularyBanks[topicLower] || vocabularyBanks["present continuous"];
  const grammar = grammarPatterns[topicLower] || grammarPatterns["present continuous"];
  const context = systemContexts[system] || systemContexts["teen"];
  
  const slides: Slide[] = [];
  let slideId = 1;

  // Helper to generate slide ID
  const nextId = () => `slide-${slideId++}`;

  // 1. Title/Warmup Slide
  slides.push({
    id: nextId(),
    type: "title",
    title: `${topic} - ${level.charAt(0).toUpperCase() + level.slice(1)} Level`,
    phase: "presentation",
    phaseLabel: "Presentation",
    content: {
      welcomeMessage: `Welcome to today's lesson on ${topic}! Get ready to learn something exciting.`,
      objectives: [
        `Understand when and how to use ${topic}`,
        `Practice using ${topic} in real conversations`,
        `Create your own sentences using ${topic}`,
      ],
      warmupQuestion: system === "kids" 
        ? `What are you doing right now? Can you show me?`
        : system === "teen"
        ? `Quick poll: What's everyone doing on their phones right now?`
        : `Think about your current work project. What are you working on?`,
    },
    teacherNotes: "Start with energy! Get students engaged with the warmup question. Allow 2-3 students to share their answers.",
    durationSeconds: 120,
  });

  // 2-5. Vocabulary Slides (4 slides)
  vocabulary.forEach((vocab, index) => {
    slides.push({
      id: nextId(),
      type: "vocabulary",
      title: `Vocabulary ${index + 1}: ${vocab.word}`,
      phase: "presentation",
      phaseLabel: "Presentation",
      content: {
        word: vocab.word,
        ipa: vocab.ipa,
        definition: vocab.definition,
        exampleSentence: vocab.example,
        imageKeyword: vocab.word,
      },
      teacherNotes: `Drill pronunciation: Say the word 3 times with students. Use gestures to demonstrate meaning. Ask: "Can you use this word in a sentence?"`,
      durationSeconds: 90,
    });
  });

  // 6. Grammar Focus Slide
  slides.push({
    id: nextId(),
    type: "grammar",
    title: `Grammar Focus: ${topic}`,
    phase: "presentation",
    phaseLabel: "Presentation",
    content: {
      rule: grammar.rule,
      pattern: grammar.pattern,
      examples: grammar.examples,
      commonMistakes: grammar.mistakes,
    },
    teacherNotes: "Write the pattern on the board. Have students repeat the examples. Highlight the common mistakes and explain why they're wrong.",
    durationSeconds: 180,
  });

  // 7. Controlled Practice Slide
  slides.push({
    id: nextId(),
    type: "practice",
    title: "Controlled Practice: Fill in the Blanks",
    phase: "practice",
    phaseLabel: "Practice",
    content: {
      exercises: [
        { 
          question: `She ____ (work) on a new project right now.`,
          answer: "is working",
          options: ["works", "is working", "worked", "working"]
        },
        { 
          question: `They ____ (not/watch) TV at the moment.`,
          answer: "aren't watching",
          options: ["don't watch", "aren't watching", "not watching", "didn't watch"]
        },
        { 
          question: `What ____ you ____ (do) these days?`,
          answer: "are...doing",
          options: ["do...do", "are...doing", "did...do", "have...done"]
        },
      ],
    },
    teacherNotes: "Give students 2 minutes to complete individually, then check answers as a class. For wrong answers, ask students to explain why their answer is incorrect.",
    durationSeconds: 180,
  });

  // 8. Dialogue Slide
  slides.push({
    id: nextId(),
    type: "dialogue",
    title: "Listen & Practice: Real Conversation",
    phase: "practice",
    phaseLabel: "Practice",
    content: {
      dialogue: system === "kids" ? [
        { speaker: "A", text: "Hey! What are you doing?" },
        { speaker: "B", text: "I'm drawing a picture of my family!" },
        { speaker: "A", text: "Cool! Can I see? Are you using crayons?" },
        { speaker: "B", text: "Yes, I am! I'm making the sky blue right now." },
      ] : system === "teen" ? [
        { speaker: "A", text: "Hey, what's up? What are you doing right now?" },
        { speaker: "B", text: "Not much, I'm just scrolling through TikTok. You?" },
        { speaker: "A", text: "I'm working on our group project. Are you coming to help?" },
        { speaker: "B", text: "Yeah, I'm leaving now. I'm bringing snacks!" },
      ] : [
        { speaker: "A", text: "Good morning. I'm calling about the project status." },
        { speaker: "B", text: "Of course. We're currently finalizing the proposal." },
        { speaker: "A", text: "Great. Is the team meeting the deadline?" },
        { speaker: "B", text: "Yes, everyone is working hard. We're making good progress." },
      ],
      comprehensionQuestions: [
        "What is Person B doing?",
        "What activity is mentioned?",
        "What is happening at the end of the dialogue?",
      ],
    },
    teacherNotes: "Play the dialogue twice. First time: just listen. Second time: students follow along. Then practice in pairs.",
    durationSeconds: 180,
  });

  // 9. Speaking Practice Slide
  slides.push({
    id: nextId(),
    type: "speaking",
    title: "Speaking Practice: Describe What's Happening",
    phase: "practice",
    phaseLabel: "Practice",
    content: {
      prompt: system === "kids"
        ? "Look around the classroom. What is everyone doing right now?"
        : system === "teen"
        ? "Describe what's happening in your life right now. What are you learning? What are your friends doing?"
        : "Describe a current project at work. What tasks are you handling? What challenges are you facing?",
      sentenceStarters: [
        "Right now, I am...",
        "My friend is...",
        "We are currently...",
        "At the moment...",
      ],
      partnerInstructions: "Work with a partner. Take turns describing what you and others are doing. Use at least 5 sentences each.",
    },
    teacherNotes: "Monitor pairs and note common errors for later feedback. Encourage students to use the new vocabulary.",
    durationSeconds: 240,
  });

  // 10. Interactive Game Slide
  slides.push({
    id: nextId(),
    type: "game",
    title: "Game Time: Matching Madness!",
    phase: "practice",
    phaseLabel: "Practice",
    content: {
      gameType: "Matching Pairs",
      instructions: "Match the sentence beginnings with the correct endings. Work in teams and race against the clock!",
      items: [
        { word: "She is currently...", match: "...studying for her exam." },
        { word: "They are always...", match: "...talking in class." },
        { word: "I am thinking about...", match: "...my summer vacation." },
        { word: "We are planning...", match: "...a surprise party." },
      ],
    },
    teacherNotes: "This is a team competition. Give points for correct matches. Play upbeat music to create energy!",
    durationSeconds: 180,
  });

  // 11. Quiz Slide
  slides.push({
    id: nextId(),
    type: "quiz",
    title: "Quick Quiz: Test Your Knowledge!",
    phase: "practice",
    phaseLabel: "Practice",
    content: {
      quizQuestion: `Which sentence correctly uses ${topic}?`,
      quizOptions: [
        { text: "She is work very hard today.", isCorrect: false },
        { text: "She is working very hard today.", isCorrect: true },
        { text: "She working very hard today.", isCorrect: false },
        { text: "She works very hard today now.", isCorrect: false },
      ],
      xpReward: 25,
    },
    teacherNotes: "Use this as a quick formative assessment. If most students get it wrong, review the grammar rule again.",
    durationSeconds: 90,
  });

  // 12. Production Task Slide
  slides.push({
    id: nextId(),
    type: "production",
    title: "Your Turn: Creative Production",
    phase: "production",
    phaseLabel: "Production",
    content: {
      scenario: system === "kids"
        ? "Draw a picture of your family doing different activities. Then describe what everyone is doing in your picture!"
        : system === "teen"
        ? "Create a short Instagram story or TikTok script describing a 'Day in My Life' using at least 8 examples of the present continuous."
        : "Write a professional email update to your manager describing the current status of a project. Include what you're working on, what challenges you're facing, and what you're planning next.",
      targetOutput: `Students should produce at least 8 correct sentences using ${topic} in context.`,
      peerReviewInstructions: "Exchange your work with a partner. Check: Are all the verbs correct? Does it make sense? Give feedback.",
    },
    teacherNotes: "Allow 10-15 minutes for this task. Walk around and provide individual feedback. Select 2-3 examples to share with the class.",
    durationSeconds: 600,
  });

  // 13. Summary/Review Slide
  slides.push({
    id: nextId(),
    type: "summary",
    title: "Lesson Summary & Homework",
    phase: "production",
    phaseLabel: "Production",
    content: {
      keyVocabulary: vocabulary.map(v => v.word),
      grammarReminder: grammar.pattern,
      homework: system === "kids"
        ? "Draw three pictures of people doing activities. Write one sentence for each picture using 'is/are + verb-ing'."
        : system === "teen"
        ? "Record a 30-second video describing what your family members are doing at home. Use at least 5 present continuous sentences."
        : "Write a status update email (150 words) for a real or imaginary project, using at least 10 present continuous structures.",
    },
    teacherNotes: "Review the key points. Answer any final questions. Remind students about the homework deadline.",
    durationSeconds: 120,
  });

  // Build the complete lesson object
  const baseLesson = {
    system,
    title: `${topic} - ${level.charAt(0).toUpperCase() + level.slice(1)} Level`,
    cefrLevel,
    slides,
    slideCount: slides.length,
    estimatedDuration: slides.reduce((acc, s) => acc + s.durationSeconds, 0) / 60,
  };

  // Also include the legacy PPP structure for backward compatibility
  if (system === "kids") {
    return {
      ...baseLesson,
      presentation: {
        hook_activity: `Show colorful flashcards with examples of ${topic}. Use puppets or toys to demonstrate the concept in a fun way. Ask: "${slides[0].content.warmupQuestion}"`,
        concept_check_questions: [
          `Can you show me an example of ${topic}?`,
          "What do you see in the picture?",
          "Can you point to the correct one?",
        ],
        vocabulary: vocabulary.map(v => ({ word: v.word, definition: v.definition })),
        grammar_rule: grammar.rule,
      },
      practice: {
        game_mechanic: `Drag-and-drop matching game where students match ${topic} examples with pictures. Include sound effects and star rewards for correct answers.`,
        drill_sentences: grammar.examples.slice(0, 3),
        exercises: slides.find(s => s.type === "practice")?.content.exercises || [],
      },
      production: {
        creative_task: slides.find(s => s.type === "production")?.content.scenario || `Draw a picture showing ${topic} and describe it to the class.`,
        target_output: `Students should be able to identify and use basic ${topic} structures in simple sentences.`,
      },
    };
  }

  if (system === "teen") {
    return {
      ...baseLesson,
      presentation: {
        context_scenario: `Imagine you're texting your friend about your plans. How would you use ${topic} in your messages? Look at this Instagram post example...`,
        grammar_rule: grammar.rule,
        vocabulary: vocabulary.map(v => ({ word: v.word, definition: v.definition, example: v.example })),
      },
      practice: {
        fill_in_the_blank: slides.find(s => s.type === "practice")?.content.exercises?.map((ex: any) => ({
          sentence: ex.question,
          answer: ex.answer,
        })) || [],
        error_correction: grammar.mistakes.map(m => {
          const parts = m.split(" → ");
          return { sentence: parts[0].replace(" ✗", ""), correction: parts[1]?.replace(" ✓", "") || "" };
        }),
      },
      production: {
        roleplay_prompt: slides.find(s => s.type === "production")?.content.scenario || `Create a social media post using ${topic}.`,
        challenge: `Create a short TikTok script using at least 8 examples of ${topic}.`,
      },
    };
  }

  // Adults/Business
  return {
    ...baseLesson,
    presentation: {
      business_case: `"Dear Team, I am writing to inform you about the upcoming changes... We are currently reviewing the proposals and will be implementing new procedures." - Notice how ${topic} is used professionally.`,
      function_explanation: grammar.rule,
      vocabulary: vocabulary.map(v => ({ word: v.word, definition: v.definition, example: v.example })),
    },
    practice: {
      sentence_transformation: [
        { original: "Send the report.", professional: "Could you please send the report at your earliest convenience?" },
        { original: "I need this now.", professional: "I would appreciate it if you could prioritize this request." },
        { original: "We're working on it.", professional: "We are currently addressing this matter and will update you shortly." },
      ],
      exercises: slides.find(s => s.type === "practice")?.content.exercises || [],
    },
    production: {
      simulation_task: slides.find(s => s.type === "production")?.content.scenario || `Draft a professional email using ${topic} to request a meeting with a potential client.`,
      discussion_questions: [
        `How does ${topic} change the tone of business communication?`,
        "When is it appropriate to use formal vs. informal language?",
        "How can you make your emails sound more professional?",
      ],
    },
  };
}
