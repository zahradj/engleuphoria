import { supabase } from '@/integrations/supabase/client';
import { generateFromTemplate, lessonTemplates, generateLessonFromTemplate, LessonTemplateConfig } from './lessonTemplateGenerator';

interface BulkLessonConfig {
  startModule: number;
  startLesson: number;
  lessonCount: number;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2';
  duration: number;
}

/**
 * Generates multiple lessons and saves them to the database
 */
export async function generateBulkLessons(config: BulkLessonConfig) {
  const templateNames = Object.keys(lessonTemplates) as (keyof typeof lessonTemplates)[];
  const results = [];
  
  console.log(`🚀 Starting bulk generation of ${config.lessonCount} lessons...`);
  
  for (let i = 0; i < config.lessonCount; i++) {
    const templateName = templateNames[i % templateNames.length];
    const moduleNumber = config.startModule + Math.floor(i / 4); // 4 lessons per module
    const lessonNumber = (i % 4) + 1;
    
    try {
      // Generate lesson slides
      const lessonSlides = generateFromTemplate(templateName, moduleNumber, lessonNumber, config.duration);
      
      // Create lesson content record
      const lessonContent = {
        title: lessonSlides.metadata.targets[0] ? 
          `${lessonSlides.metadata.targets[0].charAt(0).toUpperCase() + lessonSlides.metadata.targets[0].slice(1)} Adventures` :
          `Module ${moduleNumber} Lesson ${lessonNumber}`,
        topic: lessonSlides.metadata.targets[0] || 'General English',
        cefr_level: config.cefrLevel,
        module_number: moduleNumber,
        lesson_number: lessonNumber,
        duration_minutes: config.duration,
        learning_objectives: [
          `Learn vocabulary about ${lessonSlides.metadata.targets[0] || 'the topic'}`,
          `Practice speaking and listening skills`,
          `Complete interactive activities`
        ],
        vocabulary_focus: lessonSlides.metadata.targets.slice(1, 6),
        grammar_focus: [`Basic ${lessonSlides.metadata.targets[0] || 'topic'} grammar`],
        slides_content: lessonSlides,
        is_active: true
      };
      
      // Save to database
      const { data, error } = await supabase
        .from('lessons_content')
        .insert(lessonContent)
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Failed to save lesson ${moduleNumber}.${lessonNumber}:`, error);
        results.push({ success: false, error, lesson: `${moduleNumber}.${lessonNumber}` });
      } else {
        console.log(`✅ Saved lesson ${moduleNumber}.${lessonNumber}: ${lessonContent.title}`);
        results.push({ success: true, data, lesson: `${moduleNumber}.${lessonNumber}` });
      }
      
      // Add small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Failed to generate lesson ${moduleNumber}.${lessonNumber}:`, error);
      results.push({ success: false, error, lesson: `${moduleNumber}.${lessonNumber}` });
    }
  }
  
  const successCount = results.filter(r => r.success).length;
  console.log(`🎉 Bulk generation complete! ${successCount}/${config.lessonCount} lessons generated successfully.`);
  
  return results;
}

/**
 * Generate lessons for a full curriculum level
 */
export async function generateFullCurriculum(cefrLevel: 'A1' | 'A2' | 'B1' | 'B2') {
  const config: BulkLessonConfig = {
    startModule: 1,
    startLesson: 1,
    lessonCount: 20, // 5 modules x 4 lessons each
    cefrLevel,
    duration: 30
  };
  
  return generateBulkLessons(config);
}

/**
 * Generate custom lessons based on specific topics
 */
export async function generateCustomLessons(topics: string[], cefrLevel: 'A1' | 'A2' | 'B1' | 'B2', startModule: number = 1) {
  const results = [];
  
  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    const moduleNumber = startModule + Math.floor(i / 4);
    const lessonNumber = (i % 4) + 1;
    
    try {
      const customConfig: LessonTemplateConfig = {
        title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Adventures`,
        topic: topic,
        cefrLevel,
        module: moduleNumber,
        lesson: lessonNumber,
        duration: 30,
        learningObjectives: [
          `Learn vocabulary about ${topic}`,
          `Practice speaking about ${topic}`,
          `Complete interactive ${topic} activities`
        ],
        vocabularyFocus: generateTopicVocabulary(topic),
        grammarFocus: [`${topic} vocabulary`, `Simple present tense`, `Basic descriptions`]
      };
      
      const lessonSlides = generateLessonFromTemplate(customConfig);
      
      const lessonContent = {
        title: customConfig.title,
        topic: customConfig.topic,
        cefr_level: customConfig.cefrLevel,
        module_number: moduleNumber,
        lesson_number: lessonNumber,
        duration_minutes: customConfig.duration,
        learning_objectives: customConfig.learningObjectives,
        vocabulary_focus: customConfig.vocabularyFocus,
        grammar_focus: customConfig.grammarFocus,
        slides_content: lessonSlides,
        is_active: true
      };
      
      const { data, error } = await supabase
        .from('lessons_content')
        .insert(lessonContent)
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Failed to save custom lesson ${topic}:`, error);
        results.push({ success: false, error, topic });
      } else {
        console.log(`✅ Saved custom lesson: ${topic}`);
        results.push({ success: true, data, topic });
      }
      
    } catch (error) {
      console.error(`❌ Failed to generate custom lesson ${topic}:`, error);
      results.push({ success: false, error, topic });
    }
  }
  
  return results;
}

function generateTopicVocabulary(topic: string): string[] {
  // Basic vocabulary generation - in a real app, this would be more sophisticated
  const commonTopicWords: Record<string, string[]> = {
    weather: ['sunny', 'rainy', 'cloudy', 'windy', 'hot', 'cold', 'warm', 'snow'],
    sports: ['football', 'basketball', 'tennis', 'swimming', 'running', 'cycling', 'volleyball'],
    clothes: ['shirt', 'pants', 'dress', 'shoes', 'hat', 'jacket', 'socks', 'sweater'],
    house: ['kitchen', 'bedroom', 'living room', 'bathroom', 'garden', 'door', 'window'],
    school: ['teacher', 'student', 'book', 'pencil', 'desk', 'classroom', 'homework'],
    transportation: ['car', 'bus', 'train', 'bicycle', 'airplane', 'boat', 'taxi', 'walk'],
    body: ['head', 'eyes', 'nose', 'mouth', 'hands', 'feet', 'arms', 'legs'],
    time: ['morning', 'afternoon', 'evening', 'night', 'today', 'yesterday', 'tomorrow']
  };
  
  return commonTopicWords[topic.toLowerCase()] || [topic, `${topic} vocabulary`, 'practice', 'learning'];
}

/**
 * Quick function to generate a few sample lessons for testing
 */
export async function generateSampleLessons() {
  console.log('🎯 Generating sample lessons...');
  
  const sampleTopics = ['weather', 'sports', 'clothes', 'house'];
  
  return generateCustomLessons(sampleTopics, 'A1', 1);
}