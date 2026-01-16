import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GenerateParams {
  topic: string;
  system: string;
  level: string;
  levelId?: string;
  cefrLevel: string;
}

interface GeneratedLesson {
  system: string;
  title: string;
  presentation: any;
  practice: any;
  production: any;
}

export const useN8nGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState<GeneratedLesson | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const generateLesson = async (params: GenerateParams) => {
    setIsGenerating(true);
    setGeneratedLesson(null);

    try {
      const { data, error } = await supabase.functions.invoke("n8n-bridge", {
        body: {
          action: "generate-lesson",
          topic: params.topic,
          system: params.system,
          level: params.level,
          level_id: params.levelId,
          cefr_level: params.cefrLevel,
        },
      });

      if (error) throw error;

      // Handle various response formats
      const lessonData = data?.data || data?.lesson || data;
      
      if (data?.status === "success" && lessonData) {
        setGeneratedLesson(lessonData);
        toast.success(data?.message || "Lesson generated successfully!");
        return lessonData;
      } else if (lessonData?.presentation || lessonData?.title) {
        setGeneratedLesson(lessonData);
        toast.success("Lesson generated successfully!");
        return lessonData;
      } else {
        console.error("Unexpected response format:", data);
        throw new Error(data?.error || "Failed to generate lesson - unexpected response format");
      }
    } catch (error: any) {
      console.error("Error generating lesson:", error);
      toast.error(error.message || "Failed to generate lesson");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const saveLesson = async (params: GenerateParams) => {
    if (!generatedLesson) {
      toast.error("No lesson to save");
      return null;
    }

    setIsSaving(true);

    try {
      const { data, error } = await supabase
        .from("curriculum_lessons")
        .insert({
          title: generatedLesson.title,
          description: `AI-generated ${params.system} lesson on ${params.topic}`,
          target_system: params.system,
          difficulty_level: params.level,
          content: generatedLesson as any,
          level_id: params.levelId || null,
          xp_reward: 100,
          is_published: false,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Lesson saved to curriculum!");
      setGeneratedLesson(null);
      return data;
    } catch (error: any) {
      console.error("Error saving lesson:", error);
      toast.error(error.message || "Failed to save lesson");
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const discardLesson = () => {
    setGeneratedLesson(null);
    toast.info("Lesson discarded");
  };

  return {
    isGenerating,
    generatedLesson,
    isSaving,
    generateLesson,
    saveLesson,
    discardLesson,
  };
};
