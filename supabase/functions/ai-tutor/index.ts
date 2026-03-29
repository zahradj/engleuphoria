import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, studentId, cefrLevel, sessionType = 'text' } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get or create tutoring session
    let session;
    if (sessionId) {
      const { data } = await supabase
        .from('ai_tutoring_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      session = data;
    } else {
      const { data, error } = await supabase
        .from('ai_tutoring_sessions')
        .insert({
          student_id: studentId,
          conversation_id: crypto.randomUUID(),
          session_type: sessionType,
          cefr_level: cefrLevel,
          ai_model: 'gemini-3-flash-preview',
          learning_objectives: ['conversational_practice', 'grammar_improvement', 'vocabulary_expansion']
        })
        .select()
        .single();
      if (error) throw error;
      session = data;
    }

    // ─── Gather Student Context ───
    let studentContext = '';
    try {
      // 1. Student skills
      const { data: skills } = await supabase
        .from('student_skills')
        .select('skill_name, skill_level')
        .eq('student_id', studentId)
        .limit(10);

      if (skills?.length) {
        studentContext += `\nSkill Scores: ${skills.map(s => `${s.skill_name} ${s.skill_level}/10`).join(', ')}`;
      }

      // 2. Recent lesson progress
      const { data: progress } = await supabase
        .from('interactive_lesson_progress')
        .select('lesson_title, progress_percentage, completed')
        .eq('student_id', studentId)
        .order('updated_at', { ascending: false })
        .limit(5);

      if (progress?.length) {
        studentContext += `\nRecent Lessons: ${progress.map(p => `"${p.lesson_title}" (${p.completed ? 'completed' : `${p.progress_percentage}%`})`).join(', ')}`;
      }

      // 3. Homework performance
      const { data: homework } = await supabase
        .from('homework_submissions')
        .select('status, score')
        .eq('student_id', studentId)
        .order('submitted_at', { ascending: false })
        .limit(10);

      if (homework?.length) {
        const pending = homework.filter(h => h.status === 'submitted').length;
        const graded = homework.filter(h => h.status === 'graded');
        const avgScore = graded.length > 0
          ? Math.round(graded.reduce((s, h) => s + (h.score || 0), 0) / graded.length)
          : null;
        studentContext += `\nHomework: ${pending} pending`;
        if (avgScore !== null) studentContext += `, avg score ${avgScore}%`;
      }

      // 4. Previous session patterns (mistake areas from past feedback)
      const { data: pastSessions } = await supabase
        .from('ai_tutoring_sessions')
        .select('feedback_notes, completed_objectives')
        .eq('student_id', studentId)
        .not('feedback_notes', 'is', null)
        .order('started_at', { ascending: false })
        .limit(3);

      if (pastSessions?.length) {
        const feedbacks = pastSessions.map(s => s.feedback_notes).filter(Boolean);
        if (feedbacks.length) {
          studentContext += `\nPast Session Notes: ${feedbacks.join('; ')}`;
        }
      }
    } catch (ctxErr) {
      console.error('Error fetching student context (non-fatal):', ctxErr);
    }

    // Get recent conversation history
    const { data: messages } = await supabase
      .from('ai_conversation_messages')
      .select('*')
      .eq('session_id', session.id)
      .order('created_at', { ascending: true })
      .limit(20);

    const conversationHistory = messages?.map(msg => ({
      role: msg.message_type.includes('user') ? 'user' : 'assistant',
      content: msg.content
    })) || [];

    const systemPrompt = `You are an AI English tutor specializing in ${cefrLevel} level instruction.

Student Profile:
- CEFR Level: ${cefrLevel}
- Session Type: ${sessionType}
- Learning Objectives: ${session.learning_objectives?.join(', ')}
${studentContext ? `\nStudent Context (use this to personalize your teaching):${studentContext}` : ''}

Guidelines:
- Adapt language complexity to ${cefrLevel} level
- Be encouraging and supportive
- Correct mistakes gently with explanations
- Ask follow-up questions to encourage conversation
- Provide practical examples and context
- Track progress and celebrate improvements
- Keep responses conversational and engaging
- Limit responses to 2-3 sentences unless explaining complex concepts
- If you know the student's weak areas from context, proactively practice those skills
- Reference their recent lessons when relevant

Focus Areas:
- Grammar accuracy appropriate for ${cefrLevel}
- Vocabulary expansion with context
- Pronunciation guidance (when applicable)
- Cultural context and natural expressions
- Confidence building through positive reinforcement`;

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const startTime = Date.now();
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: apiMessages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded, please try again later.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Credits exhausted. Please add funds.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const text = await response.text();
      console.error('AI gateway error:', response.status, text);
      throw new Error('AI gateway error');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    const processingTime = Date.now() - startTime;
    const tokensUsed = data.usage?.total_tokens || 0;

    // Save user message
    await supabase.from('ai_conversation_messages').insert({
      session_id: session.id,
      message_type: 'user_text',
      content: message,
      processing_time_ms: processingTime,
      tokens_used: tokensUsed
    });

    // Save AI response
    await supabase.from('ai_conversation_messages').insert({
      session_id: session.id,
      message_type: 'ai_text',
      content: aiResponse,
      processing_time_ms: processingTime,
      tokens_used: tokensUsed
    });

    // Update session stats
    await supabase
      .from('ai_tutoring_sessions')
      .update({
        messages_count: (session.messages_count || 0) + 2,
        duration_seconds: Math.floor((Date.now() - new Date(session.started_at).getTime()) / 1000)
      })
      .eq('id', session.id);

    return new Response(JSON.stringify({
      response: aiResponse,
      sessionId: session.id,
      tokensUsed,
      processingTime,
      hasContext: !!studentContext,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-tutor function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
