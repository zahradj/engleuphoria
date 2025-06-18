import { supabase } from "@/lib/supabase";

export interface CurriculumLevel {
  id: string;
  name: string;
  cefrLevel: string;
  ageGroup: string;
  description: string;
  levelOrder: number;
  xpRequired: number;
  estimatedHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface CurriculumMaterial {
  id: string;
  title: string;
  description?: string;
  type: 'worksheet' | 'activity' | 'lesson_plan' | 'assessment' | 'game' | 'video' | 'audio' | 'reading' | 'song' | 'story' | 'exam_prep';
  levelId: string;
  cefrLevel: string;
  skillFocus: string[];
  theme?: string;
  duration: number;
  xpReward: number;
  difficultyRating: number;
  isAgeAppropriate: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  uploadedBy?: string;
  downloads: number;
  views: number;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  lastAccessed?: string;
}

export interface CurriculumSkill {
  id: string;
  name: string;
  category: 'listening' | 'speaking' | 'reading' | 'writing' | 'grammar' | 'vocabulary' | 'pronunciation' | 'songs' | 'games' | 'exam_prep';
  description?: string;
  isAgeAppropriate: boolean;
  createdAt: string;
}

class EnhancedESLCurriculumService {
  async getAllLevels(): Promise<CurriculumLevel[]> {
    const { data, error } = await supabase
      .from('curriculum_levels')
      .select('*')
      .order('level_order');

    if (error) {
      console.error('Error fetching curriculum levels:', error);
      return [];
    }

    return data?.map(level => ({
      id: level.id,
      name: level.name,
      cefrLevel: level.cefr_level,
      ageGroup: level.age_group,
      description: level.description,
      levelOrder: level.level_order,
      xpRequired: level.xp_required,
      estimatedHours: level.estimated_hours,
      createdAt: level.created_at,
      updatedAt: level.updated_at
    })) || [];
  }

  async getAllSkills(): Promise<CurriculumSkill[]> {
    const { data, error } = await supabase
      .from('curriculum_skills')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching skills:', error);
      return [];
    }

    return data?.map(skill => ({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      description: skill.description,
      isAgeAppropriate: skill.is_age_appropriate,
      createdAt: skill.created_at
    })) || [];
  }

  async getMaterialsByLevel(levelId: string): Promise<CurriculumMaterial[]> {
    const { data, error } = await supabase
      .from('curriculum_materials')
      .select('*')
      .eq('level_id', levelId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching materials by level:', error);
      return [];
    }

    return this.transformMaterialData(data || []);
  }

  async uploadMaterial(materialData: Omit<CurriculumMaterial, 'id' | 'createdAt' | 'updatedAt'>, file?: File): Promise<string | null> {
    try {
      let fileUrl = materialData.fileUrl;
      let fileName = materialData.fileName;
      let fileSize = materialData.fileSize;
      let fileType = materialData.fileType;

      // Upload file to storage if provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('curriculum-materials')
          .upload(filePath, file);

        if (uploadError) {
          console.error('File upload error:', uploadError);
          return null;
        }

        const { data: urlData } = supabase.storage
          .from('curriculum-materials')
          .getPublicUrl(filePath);

        fileUrl = urlData.publicUrl;
        fileName = file.name;
        fileSize = file.size;
        fileType = file.type;
      }

      const { data, error } = await supabase
        .from('curriculum_materials')
        .insert({
          title: materialData.title,
          description: materialData.description,
          type: materialData.type,
          level_id: materialData.levelId,
          cefr_level: materialData.cefrLevel,
          skill_focus: materialData.skillFocus,
          theme: materialData.theme,
          duration: materialData.duration,
          xp_reward: materialData.xpReward,
          difficulty_rating: materialData.difficultyRating,
          is_age_appropriate: materialData.isAgeAppropriate,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
          file_type: fileType,
          downloads: 0,
          views: 0,
          tags: materialData.tags,
          is_public: materialData.isPublic
        })
        .select()
        .single();

      if (error) {
        console.error('Error uploading material:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Upload material error:', error);
      return null;
    }
  }

  async deleteMaterial(materialId: string): Promise<boolean> {
    try {
      // Get material info first to delete file from storage
      const { data: material } = await supabase
        .from('curriculum_materials')
        .select('file_url')
        .eq('id', materialId)
        .single();

      // Delete file from storage if exists
      if (material?.file_url) {
        const filePath = material.file_url.split('/').pop();
        if (filePath) {
          await supabase.storage
            .from('curriculum-materials')
            .remove([filePath]);
        }
      }

      const { error } = await supabase
        .from('curriculum_materials')
        .delete()
        .eq('id', materialId);

      return !error;
    } catch (error) {
      console.error('Error deleting material:', error);
      return false;
    }
  }

  async incrementViews(materialId: string): Promise<void> {
    // Get current views count first
    const { data: currentMaterial } = await supabase
      .from('curriculum_materials')
      .select('views')
      .eq('id', materialId)
      .single();

    const currentViews = currentMaterial?.views || 0;

    await supabase
      .from('curriculum_materials')
      .update({ 
        views: currentViews + 1,
        last_accessed: new Date().toISOString()
      })
      .eq('id', materialId);
  }

  async incrementDownloads(materialId: string): Promise<void> {
    // Get current downloads count first
    const { data: currentMaterial } = await supabase
      .from('curriculum_materials')
      .select('downloads')
      .eq('id', materialId)
      .single();

    const currentDownloads = currentMaterial?.downloads || 0;

    await supabase
      .from('curriculum_materials')
      .update({ downloads: currentDownloads + 1 })
      .eq('id', materialId);
  }

  private transformMaterialData(data: any[]): CurriculumMaterial[] {
    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.type,
      levelId: item.level_id,
      cefrLevel: item.cefr_level,
      skillFocus: item.skill_focus || [],
      theme: item.theme,
      duration: item.duration,
      xpReward: item.xp_reward,
      difficultyRating: item.difficulty_rating,
      isAgeAppropriate: item.is_age_appropriate,
      fileUrl: item.file_url,
      fileName: item.file_name,
      fileSize: item.file_size,
      fileType: item.file_type,
      uploadedBy: item.uploaded_by,
      downloads: item.downloads,
      views: item.views,
      tags: item.tags || [],
      isPublic: item.is_public,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      lastAccessed: item.last_accessed
    }));
  }
}

export const enhancedESLCurriculumService = new EnhancedESLCurriculumService();
