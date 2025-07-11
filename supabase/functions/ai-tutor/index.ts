import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, studentId, cefrLevel, sessionType = 'text' } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

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
          ai_model: 'gpt-4.1-2025-04-14',
          learning_objectives: ['conversational_practice', 'grammar_improvement', 'vocabulary_expansion']
        })
        .select()
        .single();
      
      if (error) throw error;
      session = data;
    }

    // Get recent conversation history
    const { data: messages } = await supabase
      .from('ai_conversation_messages')
      .select('*')
      .eq('session_id', session.id)
      .order('created_at', { ascending: true })
      .limit(20);

    // Build conversation context
    const conversationHistory = messages?.map(msg => ({
      role: msg.message_type.includes('user') ? 'user' : 'assistant',
      content: msg.content
    })) || [];

    const systemPrompt = `You are an AI English tutor specializing in ${cefrLevel} level instruction. 

Student Profile:
- CEFR Level: ${cefrLevel}
- Session Type: ${sessionType}
- Learning Objectives: ${session.learning_objectives?.join(', ')}

Guidelines:
- Adapt your language complexity to ${cefrLevel} level
- Be encouraging and supportive
- Correct mistakes gently with explanations
- Ask follow-up questions to encourage conversation
- Provide practical examples and context
- Track progress and celebrate improvements
- Keep responses conversational and engaging
- Limit responses to 2-3 sentences unless explaining complex concepts

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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: apiMessages,
        max_tokens: 300,
        temperature: 0.7,
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(data.error?.message || 'Failed to generate AI response');
    }

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

    console.log('AI tutor response generated successfully');

    return new Response(JSON.stringify({ 
      response: aiResponse,
      sessionId: session.id,
      tokensUsed,
      processingTime
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