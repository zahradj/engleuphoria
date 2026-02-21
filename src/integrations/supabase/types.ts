export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievement_shares: {
        Row: {
          achievement_id: string
          achievement_tier_id: string | null
          comments_count: number
          id: string
          likes_count: number
          share_message: string | null
          share_platform: string
          shared_at: string
          student_id: string
        }
        Insert: {
          achievement_id: string
          achievement_tier_id?: string | null
          comments_count?: number
          id?: string
          likes_count?: number
          share_message?: string | null
          share_platform: string
          shared_at?: string
          student_id: string
        }
        Update: {
          achievement_id?: string
          achievement_tier_id?: string | null
          comments_count?: number
          id?: string
          likes_count?: number
          share_message?: string | null
          share_platform?: string
          shared_at?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievement_shares_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achievement_shares_achievement_tier_id_fkey"
            columns: ["achievement_tier_id"]
            isOneToOne: false
            referencedRelation: "achievement_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      achievement_tiers: {
        Row: {
          achievement_id: string
          coin_reward: number
          created_at: string
          id: string
          requirements: Json
          tier_level: number
          tier_name: string
          unlock_requirements: Json | null
          xp_reward: number
        }
        Insert: {
          achievement_id: string
          coin_reward?: number
          created_at?: string
          id?: string
          requirements?: Json
          tier_level: number
          tier_name: string
          unlock_requirements?: Json | null
          xp_reward?: number
        }
        Update: {
          achievement_id?: string
          coin_reward?: number
          created_at?: string
          id?: string
          requirements?: Json
          tier_level?: number
          tier_name?: string
          unlock_requirements?: Json | null
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "achievement_tiers_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      achievements: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          is_active: boolean
          name: string
          requirements: Json
          xp_reward: number
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          icon: string
          id?: string
          is_active?: boolean
          name: string
          requirements?: Json
          xp_reward?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          requirements?: Json
          xp_reward?: number
        }
        Relationships: []
      }
      adaptive_content: {
        Row: {
          ai_generated: boolean | null
          archived_at: string | null
          archived_reason: string | null
          avg_completion_time: number | null
          cefr_level: string
          content_data: Json
          content_type: string
          created_at: string | null
          created_by: string | null
          difficulty_level: number | null
          estimated_duration: number | null
          generation_prompt: string | null
          id: string
          is_active: boolean | null
          learning_objectives: string[]
          prerequisites: string[] | null
          success_rate: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          archived_at?: string | null
          archived_reason?: string | null
          avg_completion_time?: number | null
          cefr_level: string
          content_data: Json
          content_type: string
          created_at?: string | null
          created_by?: string | null
          difficulty_level?: number | null
          estimated_duration?: number | null
          generation_prompt?: string | null
          id?: string
          is_active?: boolean | null
          learning_objectives: string[]
          prerequisites?: string[] | null
          success_rate?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          archived_at?: string | null
          archived_reason?: string | null
          avg_completion_time?: number | null
          cefr_level?: string
          content_data?: Json
          content_type?: string
          created_at?: string | null
          created_by?: string | null
          difficulty_level?: number | null
          estimated_duration?: number | null
          generation_prompt?: string | null
          id?: string
          is_active?: boolean | null
          learning_objectives?: string[]
          prerequisites?: string[] | null
          success_rate?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adaptive_content_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_notifications: {
        Row: {
          admin_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          notification_type: string
          read_at: string | null
          title: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          notification_type: string
          read_at?: string | null
          title: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          notification_type?: string
          read_at?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_notifications_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_secrets: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          secret_hash: string
          used: boolean | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          secret_hash: string
          used?: boolean | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          secret_hash?: string
          used?: boolean | null
        }
        Relationships: []
      }
      ai_conversation_messages: {
        Row: {
          audio_duration: number | null
          audio_url: string | null
          content: string | null
          created_at: string | null
          id: string
          message_type: string
          metadata: Json | null
          processing_time_ms: number | null
          session_id: string
          tokens_used: number | null
        }
        Insert: {
          audio_duration?: number | null
          audio_url?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          message_type: string
          metadata?: Json | null
          processing_time_ms?: number | null
          session_id: string
          tokens_used?: number | null
        }
        Update: {
          audio_duration?: number | null
          audio_url?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          message_type?: string
          metadata?: Json | null
          processing_time_ms?: number | null
          session_id?: string
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversation_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_tutoring_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_generated_topics: {
        Row: {
          category: string
          cefr_level: string
          context_prompts: Json | null
          created_at: string | null
          difficulty_score: number | null
          id: string
          is_active: boolean | null
          keywords: string[] | null
          topic_text: string
          usage_count: number | null
        }
        Insert: {
          category: string
          cefr_level: string
          context_prompts?: Json | null
          created_at?: string | null
          difficulty_score?: number | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          topic_text: string
          usage_count?: number | null
        }
        Update: {
          category?: string
          cefr_level?: string
          context_prompts?: Json | null
          created_at?: string | null
          difficulty_score?: number | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          topic_text?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      ai_learning_events: {
        Row: {
          content_id: string | null
          created_at: string | null
          difficulty_rating: number | null
          event_data: Json
          event_type: string
          help_requested: boolean | null
          id: string
          performance_score: number | null
          session_id: string | null
          student_id: string
          time_spent_seconds: number | null
        }
        Insert: {
          content_id?: string | null
          created_at?: string | null
          difficulty_rating?: number | null
          event_data?: Json
          event_type: string
          help_requested?: boolean | null
          id?: string
          performance_score?: number | null
          session_id?: string | null
          student_id: string
          time_spent_seconds?: number | null
        }
        Update: {
          content_id?: string | null
          created_at?: string | null
          difficulty_rating?: number | null
          event_data?: Json
          event_type?: string
          help_requested?: boolean | null
          id?: string
          performance_score?: number | null
          session_id?: string | null
          student_id?: string
          time_spent_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_learning_events_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "adaptive_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_learning_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_tutoring_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_learning_events_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_learning_models: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          id: string
          last_updated_at: string | null
          model_data: Json
          model_type: string
          student_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          last_updated_at?: string | null
          model_data?: Json
          model_type: string
          student_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          last_updated_at?: string | null
          model_data?: Json
          model_type?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_learning_models_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_lesson_artifacts: {
        Row: {
          artifact_type: string
          created_at: string
          format: string
          id: string
          lesson_id: string
          metadata: Json | null
          public_url: string | null
          storage_path: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          artifact_type: string
          created_at?: string
          format: string
          id?: string
          lesson_id: string
          metadata?: Json | null
          public_url?: string | null
          storage_path?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          artifact_type?: string
          created_at?: string
          format?: string
          id?: string
          lesson_id?: string
          metadata?: Json | null
          public_url?: string | null
          storage_path?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_lesson_artifacts_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "ai_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_lesson_artifacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_lessons: {
        Row: {
          age_range: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          level: string
          objectives: string[] | null
          script: Json | null
          status: string | null
          title: string | null
          topic: string
          updated_at: string
          user_id: string
        }
        Insert: {
          age_range?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          level: string
          objectives?: string[] | null
          script?: Json | null
          status?: string | null
          title?: string | null
          topic: string
          updated_at?: string
          user_id: string
        }
        Update: {
          age_range?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          level?: string
          objectives?: string[] | null
          script?: Json | null
          status?: string | null
          title?: string | null
          topic?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_lessons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_lessons_ppp: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          level: string | null
          level_id: string | null
          ppp_content: Json
          status: string | null
          system_type: string
          topic: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          level?: string | null
          level_id?: string | null
          ppp_content: Json
          status?: string | null
          system_type: string
          topic: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          level?: string | null
          level_id?: string | null
          ppp_content?: Json
          status?: string | null
          system_type?: string
          topic?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_lessons_ppp_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_lessons_ppp_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "curriculum_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_tutoring_sessions: {
        Row: {
          ai_model: string | null
          cefr_level: string
          completed_objectives: string[] | null
          conversation_id: string
          created_at: string | null
          duration_seconds: number | null
          ended_at: string | null
          feedback_notes: string | null
          id: string
          learning_objectives: string[] | null
          messages_count: number | null
          session_data: Json | null
          session_rating: number | null
          session_type: string
          started_at: string | null
          student_id: string
          topic: string | null
          voice_model: string | null
        }
        Insert: {
          ai_model?: string | null
          cefr_level: string
          completed_objectives?: string[] | null
          conversation_id: string
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          feedback_notes?: string | null
          id?: string
          learning_objectives?: string[] | null
          messages_count?: number | null
          session_data?: Json | null
          session_rating?: number | null
          session_type: string
          started_at?: string | null
          student_id: string
          topic?: string | null
          voice_model?: string | null
        }
        Update: {
          ai_model?: string | null
          cefr_level?: string
          completed_objectives?: string[] | null
          conversation_id?: string
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          feedback_notes?: string | null
          id?: string
          learning_objectives?: string[] | null
          messages_count?: number | null
          session_data?: Json | null
          session_rating?: number | null
          session_type?: string
          started_at?: string | null
          student_id?: string
          topic?: string | null
          voice_model?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_tutoring_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown
          organization_id: string | null
          page_url: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown
          organization_id?: string | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown
          organization_id?: string | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_answers: {
        Row: {
          answer_audio_url: string | null
          answer_text: string | null
          created_at: string
          feedback: string | null
          graded_at: string | null
          graded_by: string | null
          id: string
          is_correct: boolean | null
          points_earned: number | null
          question_id: string
          submission_id: string
          updated_at: string
        }
        Insert: {
          answer_audio_url?: string | null
          answer_text?: string | null
          created_at?: string
          feedback?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          is_correct?: boolean | null
          points_earned?: number | null
          question_id: string
          submission_id: string
          updated_at?: string
        }
        Update: {
          answer_audio_url?: string | null
          answer_text?: string | null
          created_at?: string
          feedback?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          is_correct?: boolean | null
          points_earned?: number | null
          question_id?: string
          submission_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "assessment_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_answers_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "assessment_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_questions: {
        Row: {
          assessment_id: string
          audio_url: string | null
          correct_answer: string | null
          created_at: string
          id: string
          metadata: Json | null
          options: Json | null
          points: number
          question_order: number
          question_text: string
          question_type: string
          rubric: string | null
        }
        Insert: {
          assessment_id: string
          audio_url?: string | null
          correct_answer?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          options?: Json | null
          points?: number
          question_order: number
          question_text: string
          question_type: string
          rubric?: string | null
        }
        Update: {
          assessment_id?: string
          audio_url?: string | null
          correct_answer?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          options?: Json | null
          points?: number
          question_order?: number
          question_text?: string
          question_type?: string
          rubric?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_rubrics: {
        Row: {
          assessment_id: string | null
          created_at: string | null
          criteria: Json
          description: string | null
          id: string
          max_score: number
          rubric_data: Json | null
          rubric_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assessment_id?: string | null
          created_at?: string | null
          criteria?: Json
          description?: string | null
          id?: string
          max_score: number
          rubric_data?: Json | null
          rubric_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assessment_id?: string | null
          created_at?: string | null
          criteria?: Json
          description?: string | null
          id?: string
          max_score?: number
          rubric_data?: Json | null
          rubric_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_rubrics_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "eca_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_submissions: {
        Row: {
          assessment_id: string
          created_at: string
          graded_at: string | null
          id: string
          metadata: Json | null
          passed: boolean | null
          percentage: number | null
          started_at: string
          status: string
          student_id: string
          submitted_at: string | null
          time_taken_minutes: number | null
          total_score: number | null
          updated_at: string
        }
        Insert: {
          assessment_id: string
          created_at?: string
          graded_at?: string | null
          id?: string
          metadata?: Json | null
          passed?: boolean | null
          percentage?: number | null
          started_at?: string
          status?: string
          student_id: string
          submitted_at?: string | null
          time_taken_minutes?: number | null
          total_score?: number | null
          updated_at?: string
        }
        Update: {
          assessment_id?: string
          created_at?: string
          graded_at?: string | null
          id?: string
          metadata?: Json | null
          passed?: boolean | null
          percentage?: number | null
          started_at?: string
          status?: string
          student_id?: string
          submitted_at?: string | null
          time_taken_minutes?: number | null
          total_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_submissions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          assessment_type: string
          cefr_level: string
          created_at: string
          description: string | null
          due_date: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean | null
          metadata: Json | null
          passing_score: number
          published_at: string | null
          teacher_id: string
          title: string
          total_points: number
          updated_at: string
        }
        Insert: {
          assessment_type: string
          cefr_level: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          metadata?: Json | null
          passing_score?: number
          published_at?: string | null
          teacher_id: string
          title: string
          total_points?: number
          updated_at?: string
        }
        Update: {
          assessment_type?: string
          cefr_level?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          metadata?: Json | null
          passing_score?: number
          published_at?: string | null
          teacher_id?: string
          title?: string
          total_points?: number
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          organization_id: string | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      certificate_templates: {
        Row: {
          created_at: string
          description: string | null
          design_config: Json
          id: string
          is_active: boolean | null
          name: string
          template_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          design_config?: Json
          id?: string
          is_active?: boolean | null
          name: string
          template_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          design_config?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          template_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          cefr_level: string | null
          certificate_number: string
          certificate_type: string
          created_at: string
          description: string | null
          hours_completed: number | null
          id: string
          is_verified: boolean | null
          issue_date: string
          metadata: Json | null
          pdf_url: string | null
          score_achieved: number | null
          skills_demonstrated: string[] | null
          student_id: string
          teacher_id: string | null
          title: string
          updated_at: string
          verification_code: string
        }
        Insert: {
          cefr_level?: string | null
          certificate_number: string
          certificate_type: string
          created_at?: string
          description?: string | null
          hours_completed?: number | null
          id?: string
          is_verified?: boolean | null
          issue_date?: string
          metadata?: Json | null
          pdf_url?: string | null
          score_achieved?: number | null
          skills_demonstrated?: string[] | null
          student_id: string
          teacher_id?: string | null
          title: string
          updated_at?: string
          verification_code: string
        }
        Update: {
          cefr_level?: string | null
          certificate_number?: string
          certificate_type?: string
          created_at?: string
          description?: string | null
          hours_completed?: number | null
          id?: string
          is_verified?: boolean | null
          issue_date?: string
          metadata?: Json | null
          pdf_url?: string | null
          score_achieved?: number | null
          skills_demonstrated?: string[] | null
          student_id?: string
          teacher_id?: string | null
          title?: string
          updated_at?: string
          verification_code?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          file_name: string | null
          file_url: string | null
          id: string
          message_type: string | null
          room_id: string
          sender_id: string
          sender_name: string
          sender_role: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          message_type?: string | null
          room_id: string
          sender_id: string
          sender_name: string
          sender_role: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          message_type?: string | null
          room_id?: string
          sender_id?: string
          sender_name?: string
          sender_role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      class_bookings: {
        Row: {
          booking_type: string
          cancellation_reason: string | null
          cancelled_at: string | null
          created_at: string
          currency: string
          duration: number
          id: string
          lesson_id: string | null
          meeting_link: string | null
          notes: string | null
          price_paid: number
          scheduled_at: string
          session_id: string | null
          status: string
          student_id: string
          subscription_id: string | null
          teacher_id: string
          updated_at: string
        }
        Insert: {
          booking_type?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          duration?: number
          id?: string
          lesson_id?: string | null
          meeting_link?: string | null
          notes?: string | null
          price_paid?: number
          scheduled_at: string
          session_id?: string | null
          status?: string
          student_id: string
          subscription_id?: string | null
          teacher_id: string
          updated_at?: string
        }
        Update: {
          booking_type?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          duration?: number
          id?: string
          lesson_id?: string | null
          meeting_link?: string | null
          notes?: string | null
          price_paid?: number
          scheduled_at?: string
          session_id?: string | null
          status?: string
          student_id?: string
          subscription_id?: string | null
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_bookings_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_bookings_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_bookings_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_bookings_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      classroom_files: {
        Row: {
          category: string | null
          created_at: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          is_public: boolean | null
          room_id: string
          updated_at: string | null
          uploaded_by: string
          uploader_name: string
          uploader_role: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          is_public?: boolean | null
          room_id: string
          updated_at?: string | null
          uploaded_by: string
          uploader_name: string
          uploader_role: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          is_public?: boolean | null
          room_id?: string
          updated_at?: string | null
          uploaded_by?: string
          uploader_name?: string
          uploader_role?: string
        }
        Relationships: []
      }
      classroom_sessions: {
        Row: {
          active_canvas_tab: string | null
          active_tool: string | null
          created_at: string
          current_poll_slide_id: string | null
          current_quiz_slide_id: string | null
          current_slide_index: number | null
          dice_value: number | null
          embedded_url: string | null
          ended_at: string | null
          id: string
          is_milestone: boolean | null
          is_screen_sharing: boolean | null
          lesson_id: string | null
          lesson_slides: Json | null
          lesson_title: string | null
          poll_active: boolean | null
          poll_show_results: boolean | null
          quiz_active: boolean | null
          quiz_locked: boolean | null
          quiz_reveal_answer: boolean | null
          room_id: string
          session_context: Json | null
          session_status: string
          shared_notes: string | null
          show_star_celebration: boolean | null
          star_count: number | null
          started_at: string | null
          student_can_draw: boolean | null
          teacher_id: string
          timer_running: boolean | null
          timer_value: number | null
          updated_at: string
        }
        Insert: {
          active_canvas_tab?: string | null
          active_tool?: string | null
          created_at?: string
          current_poll_slide_id?: string | null
          current_quiz_slide_id?: string | null
          current_slide_index?: number | null
          dice_value?: number | null
          embedded_url?: string | null
          ended_at?: string | null
          id?: string
          is_milestone?: boolean | null
          is_screen_sharing?: boolean | null
          lesson_id?: string | null
          lesson_slides?: Json | null
          lesson_title?: string | null
          poll_active?: boolean | null
          poll_show_results?: boolean | null
          quiz_active?: boolean | null
          quiz_locked?: boolean | null
          quiz_reveal_answer?: boolean | null
          room_id: string
          session_context?: Json | null
          session_status?: string
          shared_notes?: string | null
          show_star_celebration?: boolean | null
          star_count?: number | null
          started_at?: string | null
          student_can_draw?: boolean | null
          teacher_id: string
          timer_running?: boolean | null
          timer_value?: number | null
          updated_at?: string
        }
        Update: {
          active_canvas_tab?: string | null
          active_tool?: string | null
          created_at?: string
          current_poll_slide_id?: string | null
          current_quiz_slide_id?: string | null
          current_slide_index?: number | null
          dice_value?: number | null
          embedded_url?: string | null
          ended_at?: string | null
          id?: string
          is_milestone?: boolean | null
          is_screen_sharing?: boolean | null
          lesson_id?: string | null
          lesson_slides?: Json | null
          lesson_title?: string | null
          poll_active?: boolean | null
          poll_show_results?: boolean | null
          quiz_active?: boolean | null
          quiz_locked?: boolean | null
          quiz_reveal_answer?: boolean | null
          room_id?: string
          session_context?: Json | null
          session_status?: string
          shared_notes?: string | null
          show_star_celebration?: boolean | null
          star_count?: number | null
          started_at?: string | null
          student_can_draw?: boolean | null
          teacher_id?: string
          timer_running?: boolean | null
          timer_value?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      communities: {
        Row: {
          banner_url: string | null
          category: Database["public"]["Enums"]["community_category"]
          cefr_level: string
          community_rules: string | null
          created_at: string | null
          created_by: string
          current_members: number | null
          description: string | null
          id: string
          is_active: boolean | null
          max_members: number | null
          name: string
          privacy_level: Database["public"]["Enums"]["community_privacy"] | null
          requires_approval: boolean | null
          tags: string[] | null
          updated_at: string | null
          weekly_goal_hours: number | null
        }
        Insert: {
          banner_url?: string | null
          category: Database["public"]["Enums"]["community_category"]
          cefr_level: string
          community_rules?: string | null
          created_at?: string | null
          created_by: string
          current_members?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_members?: number | null
          name: string
          privacy_level?:
            | Database["public"]["Enums"]["community_privacy"]
            | null
          requires_approval?: boolean | null
          tags?: string[] | null
          updated_at?: string | null
          weekly_goal_hours?: number | null
        }
        Update: {
          banner_url?: string | null
          category?: Database["public"]["Enums"]["community_category"]
          cefr_level?: string
          community_rules?: string | null
          created_at?: string | null
          created_by?: string
          current_members?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_members?: number | null
          name?: string
          privacy_level?:
            | Database["public"]["Enums"]["community_privacy"]
            | null
          requires_approval?: boolean | null
          tags?: string[] | null
          updated_at?: string | null
          weekly_goal_hours?: number | null
        }
        Relationships: []
      }
      community_challenge_participations: {
        Row: {
          challenge_id: string
          completed_at: string | null
          created_at: string | null
          id: string
          points_earned: number | null
          rank: number | null
          score: number | null
          submission_data: Json | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          points_earned?: number | null
          rank?: number | null
          score?: number | null
          submission_data?: Json | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          points_earned?: number | null
          rank?: number | null
          score?: number | null
          submission_data?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_challenge_participations_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "community_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      community_challenges: {
        Row: {
          challenge_data: Json | null
          challenge_type: string
          community_id: string
          created_at: string | null
          created_by: string
          current_participants: number | null
          description: string
          difficulty_level: number | null
          end_date: string
          id: string
          is_active: boolean | null
          max_participants: number | null
          reward_points: number | null
          start_date: string
          title: string
        }
        Insert: {
          challenge_data?: Json | null
          challenge_type: string
          community_id: string
          created_at?: string | null
          created_by: string
          current_participants?: number | null
          description: string
          difficulty_level?: number | null
          end_date: string
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          reward_points?: number | null
          start_date: string
          title: string
        }
        Update: {
          challenge_data?: Json | null
          challenge_type?: string
          community_id?: string
          created_at?: string | null
          created_by?: string
          current_participants?: number | null
          description?: string
          difficulty_level?: number | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          reward_points?: number | null
          start_date?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_challenges_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_event_participants: {
        Row: {
          attendance_status: string | null
          event_id: string
          feedback_notes: string | null
          feedback_rating: number | null
          id: string
          joined_at: string | null
          user_id: string
        }
        Insert: {
          attendance_status?: string | null
          event_id: string
          feedback_notes?: string | null
          feedback_rating?: number | null
          id?: string
          joined_at?: string | null
          user_id: string
        }
        Update: {
          attendance_status?: string | null
          event_id?: string
          feedback_notes?: string | null
          feedback_rating?: number | null
          id?: string
          joined_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "community_events"
            referencedColumns: ["id"]
          },
        ]
      }
      community_events: {
        Row: {
          community_id: string
          created_at: string | null
          current_participants: number | null
          description: string | null
          duration_minutes: number | null
          event_data: Json | null
          event_type: string
          id: string
          is_recurring: boolean | null
          max_participants: number | null
          organizer_id: string
          recurrence_pattern: Json | null
          requires_signup: boolean | null
          room_id: string | null
          scheduled_at: string
          status: string | null
          title: string
        }
        Insert: {
          community_id: string
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          duration_minutes?: number | null
          event_data?: Json | null
          event_type: string
          id?: string
          is_recurring?: boolean | null
          max_participants?: number | null
          organizer_id: string
          recurrence_pattern?: Json | null
          requires_signup?: boolean | null
          room_id?: string | null
          scheduled_at: string
          status?: string | null
          title: string
        }
        Update: {
          community_id?: string
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          duration_minutes?: number | null
          event_data?: Json | null
          event_type?: string
          id?: string
          is_recurring?: boolean | null
          max_participants?: number | null
          organizer_id?: string
          recurrence_pattern?: Json | null
          requires_signup?: boolean | null
          room_id?: string | null
          scheduled_at?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_events_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_likes: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      community_memberships: {
        Row: {
          community_id: string
          id: string
          joined_at: string | null
          last_active_at: string | null
          role: Database["public"]["Enums"]["community_role"] | null
          status: string | null
          total_contributions: number | null
          user_id: string
          weekly_hours_contributed: number | null
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string | null
          last_active_at?: string | null
          role?: Database["public"]["Enums"]["community_role"] | null
          status?: string | null
          total_contributions?: number | null
          user_id: string
          weekly_hours_contributed?: number | null
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string | null
          last_active_at?: string | null
          role?: Database["public"]["Enums"]["community_role"] | null
          status?: string | null
          total_contributions?: number | null
          user_id?: string
          weekly_hours_contributed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "community_memberships_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          parent_reply_id: string | null
          post_id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          parent_reply_id?: string | null
          post_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          parent_reply_id?: string | null
          post_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_post_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "community_post_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_post_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string
          community_id: string
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          likes_count: number | null
          post_type: string | null
          replies_count: number | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          author_id: string
          community_id: string
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          likes_count?: number | null
          post_type?: string | null
          replies_count?: number | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          community_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          likes_count?: number | null
          post_type?: string | null
          replies_count?: number | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      content_generation_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_details: string | null
          failed_items: number
          id: string
          job_type: string
          metadata: Json
          processed_items: number
          progress_percentage: number
          started_at: string | null
          status: string
          total_items: number
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_details?: string | null
          failed_items?: number
          id?: string
          job_type: string
          metadata?: Json
          processed_items?: number
          progress_percentage?: number
          started_at?: string | null
          status?: string
          total_items?: number
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_details?: string | null
          failed_items?: number
          id?: string
          job_type?: string
          metadata?: Json
          processed_items?: number
          progress_percentage?: number
          started_at?: string | null
          status?: string
          total_items?: number
          updated_at?: string
        }
        Relationships: []
      }
      credit_packs: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          original_price_eur: number
          price_eur: number
          savings_eur: number
          session_count: number
          sort_order: number
          student_level: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          original_price_eur: number
          price_eur: number
          savings_eur?: number
          session_count: number
          sort_order?: number
          student_level: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          original_price_eur?: number
          price_eur?: number
          savings_eur?: number
          session_count?: number
          sort_order?: number
          student_level?: string
          updated_at?: string
        }
        Relationships: []
      }
      credit_purchases: {
        Row: {
          amount_paid: number
          created_at: string
          credits_purchased: number
          currency: string
          expires_at: string
          id: string
          pack_id: string
          payment_method: string | null
          purchased_at: string
          student_id: string
        }
        Insert: {
          amount_paid: number
          created_at?: string
          credits_purchased: number
          currency?: string
          expires_at?: string
          id?: string
          pack_id: string
          payment_method?: string | null
          purchased_at?: string
          student_id: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          credits_purchased?: number
          currency?: string
          expires_at?: string
          id?: string
          pack_id?: string
          payment_method?: string | null
          purchased_at?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_purchases_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "credit_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_purchases_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_exports: {
        Row: {
          admin_id: string | null
          created_at: string | null
          expires_at: string | null
          file_name: string
          file_size_bytes: number | null
          format: string
          id: string
          lesson_count: number
          options: Json | null
          storage_path: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          file_name: string
          file_size_bytes?: number | null
          format: string
          id?: string
          lesson_count: number
          options?: Json | null
          storage_path: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          file_name?: string
          file_size_bytes?: number | null
          format?: string
          id?: string
          lesson_count?: number
          options?: Json | null
          storage_path?: string
        }
        Relationships: []
      }
      curriculum_lessons: {
        Row: {
          content: Json | null
          created_at: string | null
          description: string | null
          difficulty_level: string
          duration_minutes: number | null
          id: string
          is_published: boolean | null
          level_id: string | null
          order_index: number | null
          sequence_order: number | null
          target_system: string
          thumbnail_url: string | null
          title: string
          unit_id: string | null
          updated_at: string | null
          xp_reward: number | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty_level: string
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          level_id?: string | null
          order_index?: number | null
          sequence_order?: number | null
          target_system: string
          thumbnail_url?: string | null
          title: string
          unit_id?: string | null
          updated_at?: string | null
          xp_reward?: number | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          level_id?: string | null
          order_index?: number | null
          sequence_order?: number | null
          target_system?: string
          thumbnail_url?: string | null
          title?: string
          unit_id?: string | null
          updated_at?: string | null
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_lessons_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "curriculum_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "curriculum_lessons_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "curriculum_units"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_levels: {
        Row: {
          age_group: string
          cefr_level: string
          created_at: string | null
          description: string
          estimated_hours: number | null
          id: string
          level_order: number
          name: string
          sequence_order: number | null
          target_system: string | null
          thumbnail_url: string | null
          track_id: string | null
          updated_at: string | null
          xp_required: number | null
        }
        Insert: {
          age_group: string
          cefr_level: string
          created_at?: string | null
          description: string
          estimated_hours?: number | null
          id?: string
          level_order: number
          name: string
          sequence_order?: number | null
          target_system?: string | null
          thumbnail_url?: string | null
          track_id?: string | null
          updated_at?: string | null
          xp_required?: number | null
        }
        Update: {
          age_group?: string
          cefr_level?: string
          created_at?: string | null
          description?: string
          estimated_hours?: number | null
          id?: string
          level_order?: number
          name?: string
          sequence_order?: number | null
          target_system?: string | null
          thumbnail_url?: string | null
          track_id?: string | null
          updated_at?: string | null
          xp_required?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_levels_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_materials: {
        Row: {
          business_mode: boolean | null
          cefr_level: string
          created_at: string | null
          description: string | null
          difficulty_rating: number | null
          downloads: number | null
          duration: number | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_age_appropriate: boolean | null
          is_public: boolean | null
          last_accessed: string | null
          level_id: string | null
          skill_focus: string[] | null
          tags: string[] | null
          theme: string | null
          title: string
          type: string
          updated_at: string | null
          uploaded_by: string | null
          views: number | null
          visibility: string | null
          xp_reward: number | null
        }
        Insert: {
          business_mode?: boolean | null
          cefr_level: string
          created_at?: string | null
          description?: string | null
          difficulty_rating?: number | null
          downloads?: number | null
          duration?: number | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_age_appropriate?: boolean | null
          is_public?: boolean | null
          last_accessed?: string | null
          level_id?: string | null
          skill_focus?: string[] | null
          tags?: string[] | null
          theme?: string | null
          title: string
          type: string
          updated_at?: string | null
          uploaded_by?: string | null
          views?: number | null
          visibility?: string | null
          xp_reward?: number | null
        }
        Update: {
          business_mode?: boolean | null
          cefr_level?: string
          created_at?: string | null
          description?: string | null
          difficulty_rating?: number | null
          downloads?: number | null
          duration?: number | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_age_appropriate?: boolean | null
          is_public?: boolean | null
          last_accessed?: string | null
          level_id?: string | null
          skill_focus?: string[] | null
          tags?: string[] | null
          theme?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          uploaded_by?: string | null
          views?: number | null
          visibility?: string | null
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_materials_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "curriculum_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_programs: {
        Row: {
          age_group: string
          assessment_strategy: string | null
          cefr_level: string
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_weeks: number
          id: string
          is_published: boolean | null
          is_template: boolean | null
          learning_goals: string[] | null
          materials_overview: string | null
          program_data: Json | null
          program_type: string
          published_at: string | null
          target_students: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          age_group: string
          assessment_strategy?: string | null
          cefr_level: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_weeks?: number
          id?: string
          is_published?: boolean | null
          is_template?: boolean | null
          learning_goals?: string[] | null
          materials_overview?: string | null
          program_data?: Json | null
          program_type: string
          published_at?: string | null
          target_students?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          age_group?: string
          assessment_strategy?: string | null
          cefr_level?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_weeks?: number
          id?: string
          is_published?: boolean | null
          is_template?: boolean | null
          learning_goals?: string[] | null
          materials_overview?: string | null
          program_data?: Json | null
          program_type?: string
          published_at?: string | null
          target_students?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_programs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_quick_actions: {
        Row: {
          age_group: string
          button_label: string
          category: string
          icon: string | null
          id: string
          mode: string
          order_index: number
          prompt_text: string
        }
        Insert: {
          age_group: string
          button_label: string
          category: string
          icon?: string | null
          id?: string
          mode?: string
          order_index: number
          prompt_text: string
        }
        Update: {
          age_group?: string
          button_label?: string
          category?: string
          icon?: string | null
          id?: string
          mode?: string
          order_index?: number
          prompt_text?: string
        }
        Relationships: []
      }
      curriculum_skills: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_age_appropriate: boolean | null
          name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_age_appropriate?: boolean | null
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_age_appropriate?: boolean | null
          name?: string
        }
        Relationships: []
      }
      curriculum_units: {
        Row: {
          age_group: string
          assessment_methods: string[] | null
          cefr_level: string
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_weeks: number
          grammar_focus: string[] | null
          id: string
          is_published: boolean | null
          learning_objectives: string[]
          program_id: string | null
          skills_focus: string[] | null
          title: string
          unit_data: Json | null
          unit_number: number
          updated_at: string | null
          vocabulary_themes: string[] | null
        }
        Insert: {
          age_group: string
          assessment_methods?: string[] | null
          cefr_level: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_weeks?: number
          grammar_focus?: string[] | null
          id?: string
          is_published?: boolean | null
          learning_objectives: string[]
          program_id?: string | null
          skills_focus?: string[] | null
          title: string
          unit_data?: Json | null
          unit_number: number
          updated_at?: string | null
          vocabulary_themes?: string[] | null
        }
        Update: {
          age_group?: string
          assessment_methods?: string[] | null
          cefr_level?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_weeks?: number
          grammar_focus?: string[] | null
          id?: string
          is_published?: boolean | null
          learning_objectives?: string[]
          program_id?: string | null
          skills_focus?: string[] | null
          title?: string
          unit_data?: Json | null
          unit_number?: number
          updated_at?: string | null
          vocabulary_themes?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_units_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "curriculum_units_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "curriculum_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_lessons: {
        Row: {
          content: Json
          created_at: string
          email_sent: boolean
          email_sent_at: string | null
          generated_at: string
          id: string
          lesson_date: string
          student_id: string
          student_level: string
          title: string
        }
        Insert: {
          content?: Json
          created_at?: string
          email_sent?: boolean
          email_sent_at?: string | null
          generated_at?: string
          id?: string
          lesson_date?: string
          student_id: string
          student_level?: string
          title: string
        }
        Update: {
          content?: Json
          created_at?: string
          email_sent?: boolean
          email_sent_at?: string | null
          generated_at?: string
          id?: string
          lesson_date?: string
          student_id?: string
          student_level?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_lessons_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      early_learners_assets: {
        Row: {
          asset_type: string
          asset_url: string
          cache_key: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          prompt: string
        }
        Insert: {
          asset_type: string
          asset_url: string
          cache_key?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          prompt: string
        }
        Update: {
          asset_type?: string
          asset_url?: string
          cache_key?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          prompt?: string
        }
        Relationships: []
      }
      early_learners_lessons: {
        Row: {
          components: Json | null
          created_at: string | null
          created_by: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          gamification: Json | null
          id: string
          learning_objectives: Json
          lesson_number: number
          multimedia_manifest: Json | null
          phonics_focus: string
          status: string | null
          title: string
          topic: string
          updated_at: string | null
        }
        Insert: {
          components?: Json | null
          created_at?: string | null
          created_by?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          gamification?: Json | null
          id?: string
          learning_objectives?: Json
          lesson_number: number
          multimedia_manifest?: Json | null
          phonics_focus: string
          status?: string | null
          title: string
          topic: string
          updated_at?: string | null
        }
        Update: {
          components?: Json | null
          created_at?: string | null
          created_by?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          gamification?: Json | null
          id?: string
          learning_objectives?: Json
          lesson_number?: number
          multimedia_manifest?: Json | null
          phonics_focus?: string
          status?: string | null
          title?: string
          topic?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      early_learners_progress: {
        Row: {
          attempts: number | null
          badges_earned: Json | null
          completed_at: string | null
          created_at: string | null
          id: string
          lesson_id: string
          score: number | null
          slide_id: string | null
          stars_earned: number | null
          student_id: string
          time_spent_seconds: number | null
        }
        Insert: {
          attempts?: number | null
          badges_earned?: Json | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id: string
          score?: number | null
          slide_id?: string | null
          stars_earned?: number | null
          student_id: string
          time_spent_seconds?: number | null
        }
        Update: {
          attempts?: number | null
          badges_earned?: Json | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: string
          score?: number | null
          slide_id?: string | null
          stars_earned?: number | null
          student_id?: string
          time_spent_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "early_learners_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "early_learners_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "early_learners_progress_slide_id_fkey"
            columns: ["slide_id"]
            isOneToOne: false
            referencedRelation: "early_learners_slides"
            referencedColumns: ["id"]
          },
        ]
      }
      early_learners_slides: {
        Row: {
          audio_text: string | null
          audio_url: string | null
          content: Json
          created_at: string | null
          gamification: Json | null
          id: string
          image_prompt: string | null
          image_url: string | null
          interactive_elements: Json | null
          lesson_id: string
          phonics_sounds: Json | null
          slide_number: number
          slide_type: string
          title: string | null
        }
        Insert: {
          audio_text?: string | null
          audio_url?: string | null
          content?: Json
          created_at?: string | null
          gamification?: Json | null
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          interactive_elements?: Json | null
          lesson_id: string
          phonics_sounds?: Json | null
          slide_number: number
          slide_type: string
          title?: string | null
        }
        Update: {
          audio_text?: string | null
          audio_url?: string | null
          content?: Json
          created_at?: string | null
          gamification?: Json | null
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          interactive_elements?: Json | null
          lesson_id?: string
          phonics_sounds?: Json | null
          slide_number?: number
          slide_type?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "early_learners_slides_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "early_learners_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      eca_assessments: {
        Row: {
          age_group: string
          assessment_data: Json | null
          assessment_type: string
          cefr_level: string
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          instructions: string | null
          is_published: boolean | null
          is_template: boolean | null
          passing_score: number | null
          questions: Json
          skills_assessed: string[] | null
          title: string
          total_points: number | null
          updated_at: string | null
        }
        Insert: {
          age_group: string
          assessment_data?: Json | null
          assessment_type: string
          cefr_level: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          instructions?: string | null
          is_published?: boolean | null
          is_template?: boolean | null
          passing_score?: number | null
          questions?: Json
          skills_assessed?: string[] | null
          title: string
          total_points?: number | null
          updated_at?: string | null
        }
        Update: {
          age_group?: string
          assessment_data?: Json | null
          assessment_type?: string
          cefr_level?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          instructions?: string | null
          is_published?: boolean | null
          is_template?: boolean | null
          passing_score?: number | null
          questions?: Json
          skills_assessed?: string[] | null
          title?: string
          total_points?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eca_assessments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      eca_templates: {
        Row: {
          age_group: string
          category: string | null
          cefr_level: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          template_data: Json
          template_name: string
          template_type: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          age_group: string
          category?: string | null
          cefr_level: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          template_data?: Json
          template_name: string
          template_type: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          age_group?: string
          category?: string | null
          cefr_level?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          template_data?: Json
          template_name?: string
          template_type?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "eca_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          conditions: Json | null
          created_at: string | null
          flag_name: string
          id: string
          is_enabled: boolean | null
          organization_id: string | null
          updated_at: string | null
        }
        Insert: {
          conditions?: Json | null
          created_at?: string | null
          flag_name: string
          id?: string
          is_enabled?: boolean | null
          organization_id?: string | null
          updated_at?: string | null
        }
        Update: {
          conditions?: Json | null
          created_at?: string | null
          flag_name?: string
          id?: string
          is_enabled?: boolean | null
          organization_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_flags_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_curriculums: {
        Row: {
          created_at: string | null
          created_by: string | null
          curriculum_data: Json
          estimated_study_time: number
          id: string
          is_active: boolean | null
          level: string
          neuroscientific_features: string[]
          progression_map: Json
          total_pages: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          curriculum_data: Json
          estimated_study_time: number
          id: string
          is_active?: boolean | null
          level: string
          neuroscientific_features: string[]
          progression_map: Json
          total_pages: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          curriculum_data?: Json
          estimated_study_time?: number
          id?: string
          is_active?: boolean | null
          level?: string
          neuroscientific_features?: string[]
          progression_map?: Json
          total_pages?: number
        }
        Relationships: []
      }
      generation_history: {
        Row: {
          age_group: string | null
          cefr_level: string | null
          created_at: string | null
          duration_minutes: number | null
          duration_seconds: number | null
          error_message: string | null
          id: string
          lesson_id: string | null
          metadata: Json | null
          retry_count: number | null
          status: string
          system_type: string
          topic: string
          user_id: string | null
          validation_issues: Json | null
          validation_score: number | null
        }
        Insert: {
          age_group?: string | null
          cefr_level?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          duration_seconds?: number | null
          error_message?: string | null
          id?: string
          lesson_id?: string | null
          metadata?: Json | null
          retry_count?: number | null
          status: string
          system_type: string
          topic: string
          user_id?: string | null
          validation_issues?: Json | null
          validation_score?: number | null
        }
        Update: {
          age_group?: string | null
          cefr_level?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          duration_seconds?: number | null
          error_message?: string | null
          id?: string
          lesson_id?: string | null
          metadata?: Json | null
          retry_count?: number | null
          status?: string
          system_type?: string
          topic?: string
          user_id?: string | null
          validation_issues?: Json | null
          validation_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "generation_history_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "curriculum_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      grammar_progression: {
        Row: {
          age_range: string
          cefr_level: string
          created_at: string | null
          examples: Json
          grammar_points: Json
          id: string
        }
        Insert: {
          age_range: string
          cefr_level: string
          created_at?: string | null
          examples: Json
          grammar_points: Json
          id?: string
        }
        Update: {
          age_range?: string
          cefr_level?: string
          created_at?: string | null
          examples?: Json
          grammar_points?: Json
          id?: string
        }
        Relationships: []
      }
      homework: {
        Row: {
          created_at: string
          description: string | null
          due_date: string
          feedback: string | null
          grade: number | null
          id: string
          lesson_id: string | null
          status: string
          student_id: string
          teacher_id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date: string
          feedback?: string | null
          grade?: number | null
          id?: string
          lesson_id?: string | null
          status?: string
          student_id: string
          teacher_id: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string
          feedback?: string | null
          grade?: number | null
          id?: string
          lesson_id?: string | null
          status?: string
          student_id?: string
          teacher_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "homework_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homework_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homework_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      homework_assignment_students: {
        Row: {
          assignment_id: string
          created_at: string
          id: string
          student_id: string
        }
        Insert: {
          assignment_id: string
          created_at?: string
          id?: string
          student_id: string
        }
        Update: {
          assignment_id?: string
          created_at?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "homework_assignment_students_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "homework_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homework_assignment_students_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      homework_assignments: {
        Row: {
          attachment_urls: string[] | null
          created_at: string
          description: string
          due_date: string
          id: string
          instructions: string | null
          lesson_id: string | null
          points: number
          status: string
          teacher_id: string
          title: string
          updated_at: string
        }
        Insert: {
          attachment_urls?: string[] | null
          created_at?: string
          description: string
          due_date: string
          id?: string
          instructions?: string | null
          lesson_id?: string | null
          points?: number
          status?: string
          teacher_id: string
          title: string
          updated_at?: string
        }
        Update: {
          attachment_urls?: string[] | null
          created_at?: string
          description?: string
          due_date?: string
          id?: string
          instructions?: string | null
          lesson_id?: string | null
          points?: number
          status?: string
          teacher_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "homework_assignments_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homework_assignments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      homework_submissions: {
        Row: {
          assignment_id: string
          attachment_urls: string[] | null
          created_at: string
          graded_at: string | null
          id: string
          points_earned: number | null
          status: string
          student_id: string
          submitted_at: string | null
          teacher_feedback: string | null
          text_response: string | null
          updated_at: string
        }
        Insert: {
          assignment_id: string
          attachment_urls?: string[] | null
          created_at?: string
          graded_at?: string | null
          id?: string
          points_earned?: number | null
          status?: string
          student_id: string
          submitted_at?: string | null
          teacher_feedback?: string | null
          text_response?: string | null
          updated_at?: string
        }
        Update: {
          assignment_id?: string
          attachment_urls?: string[] | null
          created_at?: string
          graded_at?: string | null
          id?: string
          points_earned?: number | null
          status?: string
          student_id?: string
          submitted_at?: string | null
          teacher_feedback?: string | null
          text_response?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "homework_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "homework_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homework_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_configs: {
        Row: {
          config_data: Json
          created_at: string | null
          id: string
          integration_type: string
          is_active: boolean | null
          last_sync_at: string | null
          organization_id: string
          updated_at: string | null
        }
        Insert: {
          config_data: Json
          created_at?: string | null
          id?: string
          integration_type: string
          is_active?: boolean | null
          last_sync_at?: string | null
          organization_id: string
          updated_at?: string | null
        }
        Update: {
          config_data?: Json
          created_at?: string | null
          id?: string
          integration_type?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          organization_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_configs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      interactive_lesson_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          due_date: string | null
          id: string
          is_unlocked: boolean
          lesson_id: string
          notes: string | null
          order_in_sequence: number | null
          status: string
          student_id: string
          unlock_condition: Json | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          due_date?: string | null
          id?: string
          is_unlocked?: boolean
          lesson_id: string
          notes?: string | null
          order_in_sequence?: number | null
          status?: string
          student_id: string
          unlock_condition?: Json | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          due_date?: string | null
          id?: string
          is_unlocked?: boolean
          lesson_id?: string
          notes?: string | null
          order_in_sequence?: number | null
          status?: string
          student_id?: string
          unlock_condition?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "interactive_lesson_assignments_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "interactive_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactive_lesson_assignments_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lesson_library_view"
            referencedColumns: ["id"]
          },
        ]
      }
      interactive_lesson_progress: {
        Row: {
          completed_at: string | null
          completed_slides: number
          completion_percentage: number
          current_slide_index: number
          id: string
          last_slide_completed: number | null
          lesson_id: string
          lesson_status: string
          session_data: Json | null
          stars_earned: number
          started_at: string | null
          student_id: string
          total_slides: number
          updated_at: string | null
          xp_earned: number
        }
        Insert: {
          completed_at?: string | null
          completed_slides?: number
          completion_percentage?: number
          current_slide_index?: number
          id?: string
          last_slide_completed?: number | null
          lesson_id: string
          lesson_status?: string
          session_data?: Json | null
          stars_earned?: number
          started_at?: string | null
          student_id: string
          total_slides?: number
          updated_at?: string | null
          xp_earned?: number
        }
        Update: {
          completed_at?: string | null
          completed_slides?: number
          completion_percentage?: number
          current_slide_index?: number
          id?: string
          last_slide_completed?: number | null
          lesson_id?: string
          lesson_status?: string
          session_data?: Json | null
          stars_earned?: number
          started_at?: string | null
          student_id?: string
          total_slides?: number
          updated_at?: string | null
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "interactive_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "interactive_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactive_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lesson_library_view"
            referencedColumns: ["id"]
          },
        ]
      }
      interactive_lessons: {
        Row: {
          age_group: string
          audio_manifest: Json
          badges_available: string[]
          cefr_level: string
          created_at: string
          created_by: string | null
          duration_minutes: number
          grammar_focus: string[]
          id: string
          intro_screen_data: Json | null
          learning_objectives: string[]
          screens_data: Json
          selected_activities: string[]
          sequence_number: number | null
          status: string
          title: string
          topic: string
          total_xp: number
          updated_at: string
          usage_count: number
          vocabulary_list: string[]
        }
        Insert: {
          age_group: string
          audio_manifest?: Json
          badges_available?: string[]
          cefr_level: string
          created_at?: string
          created_by?: string | null
          duration_minutes?: number
          grammar_focus?: string[]
          id?: string
          intro_screen_data?: Json | null
          learning_objectives?: string[]
          screens_data?: Json
          selected_activities?: string[]
          sequence_number?: number | null
          status?: string
          title: string
          topic: string
          total_xp?: number
          updated_at?: string
          usage_count?: number
          vocabulary_list?: string[]
        }
        Update: {
          age_group?: string
          audio_manifest?: Json
          badges_available?: string[]
          cefr_level?: string
          created_at?: string
          created_by?: string | null
          duration_minutes?: number
          grammar_focus?: string[]
          id?: string
          intro_screen_data?: Json | null
          learning_objectives?: string[]
          screens_data?: Json
          selected_activities?: string[]
          sequence_number?: number | null
          status?: string
          title?: string
          topic?: string
          total_xp?: number
          updated_at?: string
          usage_count?: number
          vocabulary_list?: string[]
        }
        Relationships: []
      }
      iron_curriculums: {
        Row: {
          cefr_level: string
          created_at: string
          created_by: string | null
          id: string
          levels: Json
          target_audience: string
          topic: string
          updated_at: string
        }
        Insert: {
          cefr_level: string
          created_at?: string
          created_by?: string | null
          id?: string
          levels?: Json
          target_audience: string
          topic: string
          updated_at?: string
        }
        Update: {
          cefr_level?: string
          created_at?: string
          created_by?: string | null
          id?: string
          levels?: Json
          target_audience?: string
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      iron_games: {
        Row: {
          cefr_level: string | null
          created_at: string | null
          created_by: string | null
          game_data: Json
          game_mode: string
          id: string
          status: string | null
          target_group: string
          title: string
          topic: string
          updated_at: string | null
        }
        Insert: {
          cefr_level?: string | null
          created_at?: string | null
          created_by?: string | null
          game_data: Json
          game_mode: string
          id?: string
          status?: string | null
          target_group: string
          title: string
          topic: string
          updated_at?: string | null
        }
        Update: {
          cefr_level?: string | null
          created_at?: string | null
          created_by?: string | null
          game_data?: Json
          game_mode?: string
          id?: string
          status?: string | null
          target_group?: string
          title?: string
          topic?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      iron_lesson_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_phase: string | null
          id: string
          lesson_id: string
          practice_completion: Json | null
          presentation_completed: boolean | null
          production_response: string | null
          production_submitted: boolean | null
          started_at: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_phase?: string | null
          id?: string
          lesson_id: string
          practice_completion?: Json | null
          presentation_completed?: boolean | null
          production_response?: string | null
          production_submitted?: boolean | null
          started_at?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_phase?: string | null
          id?: string
          lesson_id?: string
          practice_completion?: Json | null
          presentation_completed?: boolean | null
          production_response?: string | null
          production_submitted?: boolean | null
          started_at?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "iron_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "iron_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      iron_lessons: {
        Row: {
          cefr_level: string | null
          cohort_group: string
          created_at: string | null
          created_by: string | null
          id: string
          module_id: string | null
          practice_content: Json
          presentation_content: Json
          production_content: Json
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          cefr_level?: string | null
          cohort_group: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          module_id?: string | null
          practice_content?: Json
          presentation_content?: Json
          production_content?: Json
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          cefr_level?: string | null
          cohort_group?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          module_id?: string | null
          practice_content?: Json
          presentation_content?: Json
          production_content?: Json
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "iron_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "iron_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      iron_modules: {
        Row: {
          cohort_group: string
          created_at: string | null
          description: string | null
          id: string
          module_name: string
          module_number: number
          updated_at: string | null
        }
        Insert: {
          cohort_group: string
          created_at?: string | null
          description?: string | null
          id?: string
          module_name: string
          module_number: number
          updated_at?: string | null
        }
        Update: {
          cohort_group?: string
          created_at?: string | null
          description?: string | null
          id?: string
          module_name?: string
          module_number?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      iron_student_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          current_lesson: number
          current_level: number
          current_phase: string
          curriculum_id: string
          id: string
          practice_completion: Json | null
          production_attempts: number
          production_passed: boolean
          started_at: string
          student_id: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_lesson?: number
          current_level?: number
          current_phase?: string
          curriculum_id: string
          id?: string
          practice_completion?: Json | null
          production_attempts?: number
          production_passed?: boolean
          started_at?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_lesson?: number
          current_level?: number
          current_phase?: string
          curriculum_id?: string
          id?: string
          practice_completion?: Json | null
          production_attempts?: number
          production_passed?: boolean
          started_at?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iron_student_progress_curriculum_id_fkey"
            columns: ["curriculum_id"]
            isOneToOne: false
            referencedRelation: "iron_curriculums"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_entries: {
        Row: {
          additional_data: Json | null
          id: string
          leaderboard_id: string
          rank_position: number
          recorded_at: string
          score: number
          student_id: string
        }
        Insert: {
          additional_data?: Json | null
          id?: string
          leaderboard_id: string
          rank_position: number
          recorded_at?: string
          score: number
          student_id: string
        }
        Update: {
          additional_data?: Json | null
          id?: string
          leaderboard_id?: string
          rank_position?: number
          recorded_at?: string
          score?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_entries_leaderboard_id_fkey"
            columns: ["leaderboard_id"]
            isOneToOne: false
            referencedRelation: "leaderboards"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboards: {
        Row: {
          calculation_period: string
          created_at: string
          id: string
          leaderboard_type: string
          scope_identifier: string | null
          updated_at: string
        }
        Insert: {
          calculation_period: string
          created_at?: string
          id?: string
          leaderboard_type: string
          scope_identifier?: string | null
          updated_at?: string
        }
        Update: {
          calculation_period?: string
          created_at?: string
          id?: string
          leaderboard_type?: string
          scope_identifier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      learning_analytics: {
        Row: {
          accuracy_score: number | null
          activity_type: string
          completion_rate: number | null
          id: string
          metadata: Json | null
          recorded_at: string
          session_duration: number
          skill_area: string
          student_id: string
          xp_earned: number
        }
        Insert: {
          accuracy_score?: number | null
          activity_type: string
          completion_rate?: number | null
          id?: string
          metadata?: Json | null
          recorded_at?: string
          session_duration?: number
          skill_area: string
          student_id: string
          xp_earned?: number
        }
        Update: {
          accuracy_score?: number | null
          activity_type?: string
          completion_rate?: number | null
          id?: string
          metadata?: Json | null
          recorded_at?: string
          session_duration?: number
          skill_area?: string
          student_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      learning_challenges: {
        Row: {
          challenge_type: string
          created_at: string
          current_participants: number | null
          description: string
          difficulty_level: number
          end_date: string
          id: string
          is_active: boolean
          max_participants: number | null
          requirements: Json
          rewards: Json
          start_date: string
          title: string
        }
        Insert: {
          challenge_type: string
          created_at?: string
          current_participants?: number | null
          description: string
          difficulty_level?: number
          end_date: string
          id?: string
          is_active?: boolean
          max_participants?: number | null
          requirements?: Json
          rewards?: Json
          start_date: string
          title: string
        }
        Update: {
          challenge_type?: string
          created_at?: string
          current_participants?: number | null
          description?: string
          difficulty_level?: number
          end_date?: string
          id?: string
          is_active?: boolean
          max_participants?: number | null
          requirements?: Json
          rewards?: Json
          start_date?: string
          title?: string
        }
        Relationships: []
      }
      learning_currency: {
        Row: {
          achievement_bonus_coins: number
          coins_spent: number
          created_at: string
          id: string
          streak_bonus_coins: number
          student_id: string
          total_coins: number
          updated_at: string
        }
        Insert: {
          achievement_bonus_coins?: number
          coins_spent?: number
          created_at?: string
          id?: string
          streak_bonus_coins?: number
          student_id: string
          total_coins?: number
          updated_at?: string
        }
        Update: {
          achievement_bonus_coins?: number
          coins_spent?: number
          created_at?: string
          id?: string
          streak_bonus_coins?: number
          student_id?: string
          total_coins?: number
          updated_at?: string
        }
        Relationships: []
      }
      learning_missions: {
        Row: {
          age_group: string
          badge_reward: string | null
          cefr_level: string
          coin_reward: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty_level: number | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          is_template: boolean | null
          learning_objectives: string[] | null
          mission_data: Json | null
          mission_type: string
          prerequisites: string[] | null
          tasks: Json
          title: string
          updated_at: string | null
          xp_reward: number | null
        }
        Insert: {
          age_group: string
          badge_reward?: string | null
          cefr_level: string
          coin_reward?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          is_template?: boolean | null
          learning_objectives?: string[] | null
          mission_data?: Json | null
          mission_type: string
          prerequisites?: string[] | null
          tasks?: Json
          title: string
          updated_at?: string | null
          xp_reward?: number | null
        }
        Update: {
          age_group?: string
          badge_reward?: string | null
          cefr_level?: string
          coin_reward?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          is_template?: boolean | null
          learning_objectives?: string[] | null
          mission_data?: Json | null
          mission_type?: string
          prerequisites?: string[] | null
          tasks?: Json
          title?: string
          updated_at?: string | null
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_missions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          streak_type: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          streak_type?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          streak_type?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lesson_completions: {
        Row: {
          attention_optimization_score: number | null
          completed_at: string | null
          completion_data: Json | null
          conversation_time_seconds: number | null
          curriculum_id: string
          grammar_practiced: string[] | null
          id: string
          lesson_id: string
          lesson_number: number
          memory_consolidation_score: number | null
          neuroscience_engagement_score: number | null
          pages_completed: number | null
          shared_notes: string | null
          student_id: string
          total_pages: number | null
          vocabulary_learned: string[] | null
          week_number: number
        }
        Insert: {
          attention_optimization_score?: number | null
          completed_at?: string | null
          completion_data?: Json | null
          conversation_time_seconds?: number | null
          curriculum_id: string
          grammar_practiced?: string[] | null
          id?: string
          lesson_id: string
          lesson_number: number
          memory_consolidation_score?: number | null
          neuroscience_engagement_score?: number | null
          pages_completed?: number | null
          shared_notes?: string | null
          student_id: string
          total_pages?: number | null
          vocabulary_learned?: string[] | null
          week_number: number
        }
        Update: {
          attention_optimization_score?: number | null
          completed_at?: string | null
          completion_data?: Json | null
          conversation_time_seconds?: number | null
          curriculum_id?: string
          grammar_practiced?: string[] | null
          id?: string
          lesson_id?: string
          lesson_number?: number
          memory_consolidation_score?: number | null
          neuroscience_engagement_score?: number | null
          pages_completed?: number | null
          shared_notes?: string | null
          student_id?: string
          total_pages?: number | null
          vocabulary_learned?: string[] | null
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_completions_curriculum_id_fkey"
            columns: ["curriculum_id"]
            isOneToOne: false
            referencedRelation: "generated_curriculums"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_feedback_submissions: {
        Row: {
          feedback_content: string
          homework_assigned: string | null
          id: string
          lesson_id: string
          lesson_objectives_met: boolean | null
          parent_communication_notes: string | null
          payment_unlocked: boolean | null
          student_id: string
          student_performance_rating: number | null
          submitted_at: string | null
          teacher_id: string
        }
        Insert: {
          feedback_content: string
          homework_assigned?: string | null
          id?: string
          lesson_id: string
          lesson_objectives_met?: boolean | null
          parent_communication_notes?: string | null
          payment_unlocked?: boolean | null
          student_id: string
          student_performance_rating?: number | null
          submitted_at?: string | null
          teacher_id: string
        }
        Update: {
          feedback_content?: string
          homework_assigned?: string | null
          id?: string
          lesson_id?: string
          lesson_objectives_met?: boolean | null
          parent_communication_notes?: string | null
          payment_unlocked?: boolean | null
          student_id?: string
          student_performance_rating?: number | null
          submitted_at?: string | null
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_feedback_submissions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_materials: {
        Row: {
          asset_id: string
          created_at: string | null
          display_order: number | null
          id: string
          is_mandatory: boolean | null
          lesson_id: string
        }
        Insert: {
          asset_id: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_mandatory?: boolean | null
          lesson_id: string
        }
        Update: {
          asset_id?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_mandatory?: boolean | null
          lesson_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_materials_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "library_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_materials_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "curriculum_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_packages: {
        Row: {
          created_at: string
          duration_minutes: number
          id: string
          is_active: boolean
          lesson_count: number
          name: string
          savings_amount: number | null
          total_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_minutes: number
          id?: string
          is_active?: boolean
          lesson_count: number
          name: string
          savings_amount?: number | null
          total_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          id?: string
          is_active?: boolean
          lesson_count?: number
          name?: string
          savings_amount?: number | null
          total_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      lesson_participants: {
        Row: {
          id: string
          joined_at: string | null
          left_at: string | null
          lesson_id: string | null
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          left_at?: string | null
          lesson_id?: string | null
          role: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          left_at?: string | null
          lesson_id?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_participants_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_payments: {
        Row: {
          amount_charged: number
          created_at: string | null
          id: string
          lesson_id: string
          payment_method: string | null
          platform_profit: number
          refund_amount: number | null
          refund_reason: string | null
          refunded_at: string | null
          stripe_payment_intent_id: string | null
          student_id: string
          teacher_id: string
          teacher_payout: number
          transaction_date: string | null
        }
        Insert: {
          amount_charged: number
          created_at?: string | null
          id?: string
          lesson_id: string
          payment_method?: string | null
          platform_profit: number
          refund_amount?: number | null
          refund_reason?: string | null
          refunded_at?: string | null
          stripe_payment_intent_id?: string | null
          student_id: string
          teacher_id: string
          teacher_payout: number
          transaction_date?: string | null
        }
        Update: {
          amount_charged?: number
          created_at?: string | null
          id?: string
          lesson_id?: string
          payment_method?: string | null
          platform_profit?: number
          refund_amount?: number | null
          refund_reason?: string | null
          refunded_at?: string | null
          stripe_payment_intent_id?: string | null
          student_id?: string
          teacher_id?: string
          teacher_payout?: number
          transaction_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_payments_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress_tracking: {
        Row: {
          created_at: string | null
          current_slide_index: number | null
          id: string
          last_accessed_at: string | null
          lesson_content_id: string
          slides_completed: number[] | null
          started_at: string | null
          status: string | null
          student_id: string
          total_slides: number | null
          updated_at: string | null
          xp_earned: number | null
        }
        Insert: {
          created_at?: string | null
          current_slide_index?: number | null
          id?: string
          last_accessed_at?: string | null
          lesson_content_id: string
          slides_completed?: number[] | null
          started_at?: string | null
          status?: string | null
          student_id: string
          total_slides?: number | null
          updated_at?: string | null
          xp_earned?: number | null
        }
        Update: {
          created_at?: string | null
          current_slide_index?: number | null
          id?: string
          last_accessed_at?: string | null
          lesson_content_id?: string
          slides_completed?: number[] | null
          started_at?: string | null
          status?: string | null
          student_id?: string
          total_slides?: number | null
          updated_at?: string | null
          xp_earned?: number | null
        }
        Relationships: []
      }
      lesson_reminders: {
        Row: {
          created_at: string
          email_status: string | null
          error_message: string | null
          id: string
          lesson_id: string
          recipient_id: string
          recipient_type: string
          reminder_type: string
          sent_at: string | null
        }
        Insert: {
          created_at?: string
          email_status?: string | null
          error_message?: string | null
          id?: string
          lesson_id: string
          recipient_id: string
          recipient_type: string
          reminder_type: string
          sent_at?: string | null
        }
        Update: {
          created_at?: string
          email_status?: string | null
          error_message?: string | null
          id?: string
          lesson_id?: string
          recipient_id?: string
          recipient_type?: string
          reminder_type?: string
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_reminders_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          cancellation_reason: string | null
          completed_at: string | null
          cost: number | null
          created_at: string
          curriculum_lesson_id: string | null
          duration: number
          duration_minutes: number | null
          feedback_required: boolean | null
          feedback_submitted: boolean | null
          id: string
          lesson_objectives: Json | null
          lesson_plan_notes: string | null
          lesson_price: number | null
          payment_status: string | null
          platform_profit_amount: number | null
          prep_materials_sent: boolean | null
          quality_rating: number | null
          reschedule_count: number | null
          reschedule_history: Json | null
          room_id: string | null
          room_link: string | null
          scheduled_at: string
          status: string
          student_charged_amount: number | null
          student_id: string
          teacher_id: string
          teacher_payout_amount: number | null
          title: string
        }
        Insert: {
          cancellation_reason?: string | null
          completed_at?: string | null
          cost?: number | null
          created_at?: string
          curriculum_lesson_id?: string | null
          duration?: number
          duration_minutes?: number | null
          feedback_required?: boolean | null
          feedback_submitted?: boolean | null
          id?: string
          lesson_objectives?: Json | null
          lesson_plan_notes?: string | null
          lesson_price?: number | null
          payment_status?: string | null
          platform_profit_amount?: number | null
          prep_materials_sent?: boolean | null
          quality_rating?: number | null
          reschedule_count?: number | null
          reschedule_history?: Json | null
          room_id?: string | null
          room_link?: string | null
          scheduled_at: string
          status?: string
          student_charged_amount?: number | null
          student_id: string
          teacher_id: string
          teacher_payout_amount?: number | null
          title: string
        }
        Update: {
          cancellation_reason?: string | null
          completed_at?: string | null
          cost?: number | null
          created_at?: string
          curriculum_lesson_id?: string | null
          duration?: number
          duration_minutes?: number | null
          feedback_required?: boolean | null
          feedback_submitted?: boolean | null
          id?: string
          lesson_objectives?: Json | null
          lesson_plan_notes?: string | null
          lesson_price?: number | null
          payment_status?: string | null
          platform_profit_amount?: number | null
          prep_materials_sent?: boolean | null
          quality_rating?: number | null
          reschedule_count?: number | null
          reschedule_history?: Json | null
          room_id?: string | null
          room_link?: string | null
          scheduled_at?: string
          status?: string
          student_charged_amount?: number | null
          student_id?: string
          teacher_id?: string
          teacher_payout_amount?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_curriculum_lesson_id_fkey"
            columns: ["curriculum_lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons_content: {
        Row: {
          canva_url: string | null
          cefr_level: string
          created_at: string | null
          created_by: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          grammar_focus: string[] | null
          id: string
          is_active: boolean | null
          learning_objectives: string[] | null
          lesson_number: number
          metadata: Json | null
          module_number: number
          slide_order: number[] | null
          slides_content: Json
          title: string
          topic: string
          updated_at: string | null
          vocabulary_focus: string[] | null
        }
        Insert: {
          canva_url?: string | null
          cefr_level?: string
          created_at?: string | null
          created_by?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          grammar_focus?: string[] | null
          id?: string
          is_active?: boolean | null
          learning_objectives?: string[] | null
          lesson_number?: number
          metadata?: Json | null
          module_number?: number
          slide_order?: number[] | null
          slides_content?: Json
          title: string
          topic: string
          updated_at?: string | null
          vocabulary_focus?: string[] | null
        }
        Update: {
          canva_url?: string | null
          cefr_level?: string
          created_at?: string | null
          created_by?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          grammar_focus?: string[] | null
          id?: string
          is_active?: boolean | null
          learning_objectives?: string[] | null
          lesson_number?: number
          metadata?: Json | null
          module_number?: number
          slide_order?: number[] | null
          slides_content?: Json
          title?: string
          topic?: string
          updated_at?: string | null
          vocabulary_focus?: string[] | null
        }
        Relationships: []
      }
      library_assets: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_seconds: number | null
          file_size_bytes: number | null
          file_type: string
          file_url: string
          id: string
          is_teacher_only: boolean | null
          max_age: number | null
          min_age: number | null
          system_tag: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_seconds?: number | null
          file_size_bytes?: number | null
          file_type: string
          file_url: string
          id?: string
          is_teacher_only?: boolean | null
          max_age?: number | null
          min_age?: number | null
          system_tag: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_seconds?: number | null
          file_size_bytes?: number | null
          file_type?: string
          file_url?: string
          id?: string
          is_teacher_only?: boolean | null
          max_age?: number | null
          min_age?: number | null
          system_tag?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "library_assets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      material_skills: {
        Row: {
          id: string
          material_id: string | null
          skill_id: string | null
        }
        Insert: {
          id?: string
          material_id?: string | null
          skill_id?: string | null
        }
        Update: {
          id?: string
          material_id?: string | null
          skill_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_skills_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "curriculum_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "curriculum_skills"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          booking_id: string | null
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          message_type: string
          receiver_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          booking_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string
          receiver_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string
          receiver_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "class_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_lessons: {
        Row: {
          created_at: string | null
          id: string
          lesson_id: string | null
          mission_id: string | null
          task_order: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          mission_id?: string | null
          task_order: number
        }
        Update: {
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          mission_id?: string | null
          task_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "mission_lessons_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "systematic_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_lessons_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "learning_missions"
            referencedColumns: ["id"]
          },
        ]
      }
      ml_predictions: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          expires_at: string | null
          features_used: Json | null
          id: string
          model_version: string | null
          prediction_type: string
          prediction_value: Json
          student_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          expires_at?: string | null
          features_used?: Json | null
          id?: string
          model_version?: string | null
          prediction_type: string
          prediction_value: Json
          student_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          expires_at?: string | null
          features_used?: Json | null
          id?: string
          model_version?: string | null
          prediction_type?: string
          prediction_value?: Json
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ml_predictions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      multimedia_generation_queue: {
        Row: {
          asset_purpose: string
          asset_type: string
          created_at: string | null
          error_message: string | null
          id: string
          lesson_id: string
          prompt: string
          result_url: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          asset_purpose: string
          asset_type: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          lesson_id: string
          prompt: string
          result_url?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          asset_purpose?: string
          asset_type?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          lesson_id?: string
          prompt?: string
          result_url?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "multimedia_generation_queue_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "early_learners_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          body_html: string
          body_text: string | null
          created_at: string
          id: string
          is_active: boolean | null
          subject: string | null
          template_name: string
          template_type: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          body_html: string
          body_text?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          subject?: string | null
          template_name: string
          template_type: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          body_html?: string
          body_text?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          subject?: string | null
          template_name?: string
          template_type?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          scheduled_for: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          scheduled_for?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          scheduled_for?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          id: string
          invited_by: string | null
          joined_at: string | null
          organization_id: string
          permissions: Json | null
          role: string
          status: string | null
          user_id: string
        }
        Insert: {
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          organization_id: string
          permissions?: Json | null
          role?: string
          status?: string | null
          user_id: string
        }
        Update: {
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          organization_id?: string
          permissions?: Json | null
          role?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          branding_config: Json | null
          created_at: string | null
          domain: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          primary_color: string | null
          secondary_color: string | null
          settings: Json | null
          slug: string
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          branding_config?: Json | null
          created_at?: string | null
          domain?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          primary_color?: string | null
          secondary_color?: string | null
          settings?: Json | null
          slug: string
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          branding_config?: Json | null
          created_at?: string | null
          domain?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          secondary_color?: string | null
          settings?: Json | null
          slug?: string
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      package_lesson_redemptions: {
        Row: {
          id: string
          lesson_id: string
          package_purchase_id: string
          redeemed_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          package_purchase_id: string
          redeemed_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          package_purchase_id?: string
          redeemed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_lesson_redemptions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_lesson_redemptions_package_purchase_id_fkey"
            columns: ["package_purchase_id"]
            isOneToOne: false
            referencedRelation: "student_package_purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_notification_preferences: {
        Row: {
          attendance_alerts: boolean | null
          created_at: string
          homework_notifications: boolean | null
          id: string
          lesson_reminders: boolean | null
          parent_id: string
          payment_reminders: boolean | null
          progress_reports: boolean | null
          teacher_messages: boolean | null
          updated_at: string
          weekly_summary: boolean | null
        }
        Insert: {
          attendance_alerts?: boolean | null
          created_at?: string
          homework_notifications?: boolean | null
          id?: string
          lesson_reminders?: boolean | null
          parent_id: string
          payment_reminders?: boolean | null
          progress_reports?: boolean | null
          teacher_messages?: boolean | null
          updated_at?: string
          weekly_summary?: boolean | null
        }
        Update: {
          attendance_alerts?: boolean | null
          created_at?: string
          homework_notifications?: boolean | null
          id?: string
          lesson_reminders?: boolean | null
          parent_id?: string
          payment_reminders?: boolean | null
          progress_reports?: boolean | null
          teacher_messages?: boolean | null
          updated_at?: string
          weekly_summary?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "parent_notification_preferences_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: true
            referencedRelation: "parent_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      parent_profiles: {
        Row: {
          created_at: string
          emergency_contact: string | null
          full_name: string
          id: string
          notifications_enabled: boolean | null
          phone: string | null
          preferred_contact_method: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emergency_contact?: string | null
          full_name: string
          id?: string
          notifications_enabled?: boolean | null
          phone?: string | null
          preferred_contact_method?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emergency_contact?: string | null
          full_name?: string
          id?: string
          notifications_enabled?: boolean | null
          phone?: string | null
          preferred_contact_method?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      parent_teacher_messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          parent_email: string | null
          parent_id: string
          read_at: string | null
          sender_type: string
          student_id: string
          subject: string
          teacher_email: string | null
          teacher_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          parent_email?: string | null
          parent_id: string
          read_at?: string | null
          sender_type: string
          student_id: string
          subject: string
          teacher_email?: string | null
          teacher_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          parent_email?: string | null
          parent_id?: string
          read_at?: string | null
          sender_type?: string
          student_id?: string
          subject?: string
          teacher_email?: string | null
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_teacher_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parent_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "parent_teacher_messages_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_teacher_messages_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          feedback_completion_required: boolean | null
          id: string
          kpi_threshold_met: boolean | null
          lesson_id: string
          payment_method: string
          platform_amount: number | null
          revenue_split_id: string | null
          status: string
          student_id: string
          teacher_amount: number | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          feedback_completion_required?: boolean | null
          id?: string
          kpi_threshold_met?: boolean | null
          lesson_id: string
          payment_method: string
          platform_amount?: number | null
          revenue_split_id?: string | null
          status?: string
          student_id: string
          teacher_amount?: number | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          feedback_completion_required?: boolean | null
          id?: string
          kpi_threshold_met?: boolean | null
          lesson_id?: string
          payment_method?: string
          platform_amount?: number | null
          revenue_split_id?: string | null
          status?: string
          student_id?: string
          teacher_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_revenue_split_id_fkey"
            columns: ["revenue_split_id"]
            isOneToOne: false
            referencedRelation: "revenue_splits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_alerts: {
        Row: {
          alert_message: string
          alert_type: string
          created_at: string | null
          id: string
          is_read: boolean | null
          teacher_id: string
        }
        Insert: {
          alert_message: string
          alert_type: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          teacher_id: string
        }
        Update: {
          alert_message?: string
          alert_type?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          teacher_id?: string
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          created_at: string
          date_recorded: string
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
          student_id: string
          time_period: string
        }
        Insert: {
          created_at?: string
          date_recorded?: string
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
          student_id: string
          time_period: string
        }
        Update: {
          created_at?: string
          date_recorded?: string
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          student_id?: string
          time_period?: string
        }
        Relationships: []
      }
      personalized_learning_paths: {
        Row: {
          actual_completion_days: number | null
          ai_generated: boolean | null
          completed_at: string | null
          completion_percentage: number | null
          created_at: string | null
          current_step: number | null
          difficulty_preference: string | null
          estimated_completion_days: number | null
          id: string
          last_activity_at: string | null
          learning_style: string | null
          path_data: Json
          path_name: string
          student_id: string
          total_steps: number
          updated_at: string | null
        }
        Insert: {
          actual_completion_days?: number | null
          ai_generated?: boolean | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          current_step?: number | null
          difficulty_preference?: string | null
          estimated_completion_days?: number | null
          id?: string
          last_activity_at?: string | null
          learning_style?: string | null
          path_data: Json
          path_name: string
          student_id: string
          total_steps: number
          updated_at?: string | null
        }
        Update: {
          actual_completion_days?: number | null
          ai_generated?: boolean | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          current_step?: number | null
          difficulty_preference?: string | null
          estimated_completion_days?: number | null
          id?: string
          last_activity_at?: string | null
          learning_style?: string | null
          path_data?: Json
          path_name?: string
          student_id?: string
          total_steps?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personalized_learning_paths_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_responses: {
        Row: {
          created_at: string | null
          id: string
          response_time_ms: number | null
          selected_option_id: string
          session_id: string
          slide_id: string
          student_id: string
          student_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          response_time_ms?: number | null
          selected_option_id: string
          session_id: string
          slide_id: string
          student_id: string
          student_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          response_time_ms?: number | null
          selected_option_id?: string
          session_id?: string
          slide_id?: string
          student_id?: string
          student_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "classroom_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_responses: {
        Row: {
          created_at: string | null
          id: string
          is_correct: boolean
          response_time_ms: number | null
          selected_option_id: string
          session_id: string
          slide_id: string
          student_id: string
          student_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_correct: boolean
          response_time_ms?: number | null
          selected_option_id: string
          session_id: string
          slide_id: string
          student_id: string
          student_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_correct?: boolean
          response_time_ms?: number | null
          selected_option_id?: string
          session_id?: string
          slide_id?: string
          student_id?: string
          student_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "classroom_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_library: {
        Row: {
          age_group: string
          cefr_level: string
          content_data: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          downloads_count: number | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_public: boolean | null
          is_template: boolean | null
          resource_type: string
          skills: string[] | null
          title: string
          topics: string[] | null
          updated_at: string | null
        }
        Insert: {
          age_group: string
          cefr_level: string
          content_data?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          downloads_count?: number | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          is_template?: boolean | null
          resource_type: string
          skills?: string[] | null
          title: string
          topics?: string[] | null
          updated_at?: string | null
        }
        Update: {
          age_group?: string
          cefr_level?: string
          content_data?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          downloads_count?: number | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          is_template?: boolean | null
          resource_type?: string
          skills?: string[] | null
          title?: string
          topics?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_library_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_splits: {
        Row: {
          applies_to: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          platform_percentage: number
          teacher_percentage: number
          updated_at: string | null
        }
        Insert: {
          applies_to?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          platform_percentage: number
          teacher_percentage: number
          updated_at?: string | null
        }
        Update: {
          applies_to?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          platform_percentage?: number
          teacher_percentage?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      seasonal_events: {
        Row: {
          created_at: string
          description: string
          end_date: string
          id: string
          is_active: boolean
          name: string
          participation_requirements: Json | null
          special_rewards: Json
          start_date: string
          theme_data: Json
        }
        Insert: {
          created_at?: string
          description: string
          end_date: string
          id?: string
          is_active?: boolean
          name: string
          participation_requirements?: Json | null
          special_rewards?: Json
          start_date: string
          theme_data?: Json
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string
          id?: string
          is_active?: boolean
          name?: string
          participation_requirements?: Json | null
          special_rewards?: Json
          start_date?: string
          theme_data?: Json
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_audit_logs: {
        Row: {
          action: string
          id: string
          ip_address: unknown
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      speaking_classroom_sessions: {
        Row: {
          avg_response_time: number | null
          created_at: string | null
          difficulty_level: string | null
          ended_at: string | null
          generated_topic: string | null
          group_id: string | null
          id: string
          questions_answered: number | null
          session_metadata: Json | null
          session_type: string | null
          started_at: string | null
          student_id: string | null
          topic_id: string | null
          total_questions: number | null
          vocabulary_used: Json | null
        }
        Insert: {
          avg_response_time?: number | null
          created_at?: string | null
          difficulty_level?: string | null
          ended_at?: string | null
          generated_topic?: string | null
          group_id?: string | null
          id?: string
          questions_answered?: number | null
          session_metadata?: Json | null
          session_type?: string | null
          started_at?: string | null
          student_id?: string | null
          topic_id?: string | null
          total_questions?: number | null
          vocabulary_used?: Json | null
        }
        Update: {
          avg_response_time?: number | null
          created_at?: string | null
          difficulty_level?: string | null
          ended_at?: string | null
          generated_topic?: string | null
          group_id?: string | null
          id?: string
          questions_answered?: number | null
          session_metadata?: Json | null
          session_type?: string | null
          started_at?: string | null
          student_id?: string | null
          topic_id?: string | null
          total_questions?: number | null
          vocabulary_used?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "speaking_classroom_sessions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "speaking_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "speaking_classroom_sessions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "ai_generated_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      speaking_group_participants: {
        Row: {
          ai_feedback: Json | null
          group_id: string
          id: string
          joined_at: string | null
          left_at: string | null
          participation_score: number | null
          questions_answered: number | null
          questions_asked: number | null
          session_id: string | null
          speaking_time_seconds: number | null
          student_id: string
        }
        Insert: {
          ai_feedback?: Json | null
          group_id: string
          id?: string
          joined_at?: string | null
          left_at?: string | null
          participation_score?: number | null
          questions_answered?: number | null
          questions_asked?: number | null
          session_id?: string | null
          speaking_time_seconds?: number | null
          student_id: string
        }
        Update: {
          ai_feedback?: Json | null
          group_id?: string
          id?: string
          joined_at?: string | null
          left_at?: string | null
          participation_score?: number | null
          questions_answered?: number | null
          questions_asked?: number | null
          session_id?: string | null
          speaking_time_seconds?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "speaking_group_participants_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "speaking_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "speaking_group_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "speaking_group_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      speaking_group_sessions: {
        Row: {
          ai_facilitator_prompt: string | null
          created_at: string | null
          ended_at: string | null
          group_id: string
          id: string
          participant_count: number | null
          scheduled_at: string | null
          session_metadata: Json | null
          session_status: string | null
          session_topic: string
          started_at: string | null
        }
        Insert: {
          ai_facilitator_prompt?: string | null
          created_at?: string | null
          ended_at?: string | null
          group_id: string
          id?: string
          participant_count?: number | null
          scheduled_at?: string | null
          session_metadata?: Json | null
          session_status?: string | null
          session_topic: string
          started_at?: string | null
        }
        Update: {
          ai_facilitator_prompt?: string | null
          created_at?: string | null
          ended_at?: string | null
          group_id?: string
          id?: string
          participant_count?: number | null
          scheduled_at?: string | null
          session_metadata?: Json | null
          session_status?: string | null
          session_topic?: string
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "speaking_group_sessions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "speaking_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      speaking_groups: {
        Row: {
          cefr_level: string
          created_at: string | null
          created_by: string | null
          current_participants: number | null
          group_name: string
          id: string
          is_active: boolean | null
          max_participants: number | null
          session_duration: number | null
          topic_category: string | null
          updated_at: string | null
        }
        Insert: {
          cefr_level: string
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          group_name: string
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          session_duration?: number | null
          topic_category?: string | null
          updated_at?: string | null
        }
        Update: {
          cefr_level?: string
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          group_name?: string
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          session_duration?: number | null
          topic_category?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      speaking_progress: {
        Row: {
          badges_earned: string[] | null
          created_at: string | null
          current_cefr_level: string
          current_streak: number
          id: string
          last_practice_date: string | null
          longest_streak: number
          speaking_xp: number
          student_id: string
          total_sessions: number
          total_speaking_time: number
          updated_at: string | null
        }
        Insert: {
          badges_earned?: string[] | null
          created_at?: string | null
          current_cefr_level?: string
          current_streak?: number
          id?: string
          last_practice_date?: string | null
          longest_streak?: number
          speaking_xp?: number
          student_id: string
          total_sessions?: number
          total_speaking_time?: number
          updated_at?: string | null
        }
        Update: {
          badges_earned?: string[] | null
          created_at?: string | null
          current_cefr_level?: string
          current_streak?: number
          id?: string
          last_practice_date?: string | null
          longest_streak?: number
          speaking_xp?: number
          student_id?: string
          total_sessions?: number
          total_speaking_time?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      speaking_questions: {
        Row: {
          ai_analysis: Json | null
          created_at: string | null
          group_session_id: string | null
          id: string
          question_text: string
          question_type: string | null
          response_time_seconds: number | null
          session_id: string | null
          student_response: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          created_at?: string | null
          group_session_id?: string | null
          id?: string
          question_text: string
          question_type?: string | null
          response_time_seconds?: number | null
          session_id?: string | null
          student_response?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          created_at?: string | null
          group_session_id?: string | null
          id?: string
          question_text?: string
          question_type?: string | null
          response_time_seconds?: number | null
          session_id?: string | null
          student_response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "speaking_questions_group_session_id_fkey"
            columns: ["group_session_id"]
            isOneToOne: false
            referencedRelation: "speaking_group_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "speaking_questions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "speaking_classroom_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      speaking_scenarios: {
        Row: {
          cefr_level: string
          context_instructions: string | null
          created_at: string | null
          description: string
          difficulty_rating: number | null
          expected_duration: number
          id: string
          is_active: boolean | null
          name: string
          prompt: string
          tags: string[] | null
          type: string
        }
        Insert: {
          cefr_level: string
          context_instructions?: string | null
          created_at?: string | null
          description: string
          difficulty_rating?: number | null
          expected_duration?: number
          id?: string
          is_active?: boolean | null
          name: string
          prompt: string
          tags?: string[] | null
          type: string
        }
        Update: {
          cefr_level?: string
          context_instructions?: string | null
          created_at?: string | null
          description?: string
          difficulty_rating?: number | null
          expected_duration?: number
          id?: string
          is_active?: boolean | null
          name?: string
          prompt?: string
          tags?: string[] | null
          type?: string
        }
        Relationships: []
      }
      speaking_sessions: {
        Row: {
          cefr_level: string
          completed_at: string | null
          created_at: string | null
          duration_seconds: number
          feedback_notes: string | null
          fluency_score: number | null
          grammar_score: number | null
          id: string
          overall_rating: number | null
          pronunciation_score: number | null
          scenario_name: string
          session_type: string
          student_id: string
          xp_earned: number
        }
        Insert: {
          cefr_level: string
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number
          feedback_notes?: string | null
          fluency_score?: number | null
          grammar_score?: number | null
          id?: string
          overall_rating?: number | null
          pronunciation_score?: number | null
          scenario_name: string
          session_type: string
          student_id: string
          xp_earned?: number
        }
        Update: {
          cefr_level?: string
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number
          feedback_notes?: string | null
          fluency_score?: number | null
          grammar_score?: number | null
          id?: string
          overall_rating?: number | null
          pronunciation_score?: number | null
          scenario_name?: string
          session_type?: string
          student_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      student_achievement_tiers: {
        Row: {
          achievement_tier_id: string
          created_at: string
          id: string
          is_unlocked: boolean
          progress_data: Json
          student_id: string
          unlocked_at: string | null
        }
        Insert: {
          achievement_tier_id: string
          created_at?: string
          id?: string
          is_unlocked?: boolean
          progress_data?: Json
          student_id: string
          unlocked_at?: string | null
        }
        Update: {
          achievement_tier_id?: string
          created_at?: string
          id?: string
          is_unlocked?: boolean
          progress_data?: Json
          student_id?: string
          unlocked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_achievement_tiers_achievement_tier_id_fkey"
            columns: ["achievement_tier_id"]
            isOneToOne: false
            referencedRelation: "achievement_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      student_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          progress: Json | null
          student_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          progress?: Json | null
          student_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          progress?: Json | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      student_badges: {
        Row: {
          badge_description: string | null
          badge_icon: string | null
          badge_name: string
          created_at: string | null
          criteria_met: Json | null
          id: string
          student_id: string
          unlocked_at: string | null
        }
        Insert: {
          badge_description?: string | null
          badge_icon?: string | null
          badge_name: string
          created_at?: string | null
          criteria_met?: Json | null
          id?: string
          student_id: string
          unlocked_at?: string | null
        }
        Update: {
          badge_description?: string | null
          badge_icon?: string | null
          badge_name?: string
          created_at?: string | null
          criteria_met?: Json | null
          id?: string
          student_id?: string
          unlocked_at?: string | null
        }
        Relationships: []
      }
      student_challenge_progress: {
        Row: {
          challenge_id: string
          completed_at: string | null
          completion_percentage: number
          id: string
          is_completed: boolean
          progress_data: Json
          started_at: string
          student_id: string
          updated_at: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          completion_percentage?: number
          id?: string
          is_completed?: boolean
          progress_data?: Json
          started_at?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          completion_percentage?: number
          id?: string
          is_completed?: boolean
          progress_data?: Json
          started_at?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "learning_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      student_credits: {
        Row: {
          created_at: string
          expired_credits: number
          id: string
          student_id: string
          total_credits: number
          updated_at: string
          used_credits: number
        }
        Insert: {
          created_at?: string
          expired_credits?: number
          id?: string
          student_id: string
          total_credits?: number
          updated_at?: string
          used_credits?: number
        }
        Update: {
          created_at?: string
          expired_credits?: number
          id?: string
          student_id?: string
          total_credits?: number
          updated_at?: string
          used_credits?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_credits_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      student_curriculum_assignments: {
        Row: {
          assigned_at: string | null
          created_at: string | null
          current_lesson_number: number | null
          id: string
          lessons_completed: string[] | null
          stage_id: number
          stage_name: string
          status: string | null
          student_id: string
          total_lessons_in_unit: number
          unit_id: string
          unit_name: string
          updated_at: string | null
        }
        Insert: {
          assigned_at?: string | null
          created_at?: string | null
          current_lesson_number?: number | null
          id?: string
          lessons_completed?: string[] | null
          stage_id: number
          stage_name: string
          status?: string | null
          student_id: string
          total_lessons_in_unit: number
          unit_id: string
          unit_name: string
          updated_at?: string | null
        }
        Update: {
          assigned_at?: string | null
          created_at?: string | null
          current_lesson_number?: number | null
          id?: string
          lessons_completed?: string[] | null
          stage_id?: number
          stage_name?: string
          status?: string | null
          student_id?: string
          total_lessons_in_unit?: number
          unit_id?: string
          unit_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      student_curriculum_progress: {
        Row: {
          completion_percentage: number | null
          conversation_milestones_achieved: string[] | null
          current_lesson: number | null
          current_lesson_id: string | null
          current_week: number | null
          curriculum_id: string
          grammar_patterns_learned: string[] | null
          id: string
          last_activity_at: string | null
          neuroscience_scores: Json | null
          next_lesson_id: string | null
          placement_test_completed: boolean | null
          recommended_stage_id: number | null
          started_at: string | null
          student_id: string
          vocabulary_mastered: string[] | null
        }
        Insert: {
          completion_percentage?: number | null
          conversation_milestones_achieved?: string[] | null
          current_lesson?: number | null
          current_lesson_id?: string | null
          current_week?: number | null
          curriculum_id: string
          grammar_patterns_learned?: string[] | null
          id?: string
          last_activity_at?: string | null
          neuroscience_scores?: Json | null
          next_lesson_id?: string | null
          placement_test_completed?: boolean | null
          recommended_stage_id?: number | null
          started_at?: string | null
          student_id: string
          vocabulary_mastered?: string[] | null
        }
        Update: {
          completion_percentage?: number | null
          conversation_milestones_achieved?: string[] | null
          current_lesson?: number | null
          current_lesson_id?: string | null
          current_week?: number | null
          curriculum_id?: string
          grammar_patterns_learned?: string[] | null
          id?: string
          last_activity_at?: string | null
          neuroscience_scores?: Json | null
          next_lesson_id?: string | null
          placement_test_completed?: boolean | null
          recommended_stage_id?: number | null
          started_at?: string | null
          student_id?: string
          vocabulary_mastered?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "student_curriculum_progress_current_lesson_id_fkey"
            columns: ["current_lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_curriculum_progress_curriculum_id_fkey"
            columns: ["curriculum_id"]
            isOneToOne: false
            referencedRelation: "generated_curriculums"
            referencedColumns: ["id"]
          },
        ]
      }
      student_learning_streaks: {
        Row: {
          bonus_coins_earned: number
          created_at: string
          current_streak: number
          id: string
          last_activity_date: string
          longest_streak: number
          streak_multiplier: number
          streak_type: string
          student_id: string
          updated_at: string
        }
        Insert: {
          bonus_coins_earned?: number
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string
          longest_streak?: number
          streak_multiplier?: number
          streak_type: string
          student_id: string
          updated_at?: string
        }
        Update: {
          bonus_coins_earned?: number
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string
          longest_streak?: number
          streak_multiplier?: number
          streak_type?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_lesson_progress: {
        Row: {
          attempts: number | null
          completed_at: string | null
          created_at: string | null
          id: string
          lesson_id: string
          score: number | null
          started_at: string | null
          status: string
          time_spent_seconds: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id: string
          score?: number | null
          started_at?: string | null
          status?: string
          time_spent_seconds?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: string
          score?: number | null
          started_at?: string | null
          status?: string
          time_spent_seconds?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "curriculum_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      student_package_purchases: {
        Row: {
          expires_at: string | null
          id: string
          lessons_remaining: number
          package_id: string
          payment_id: string | null
          purchased_at: string
          student_id: string
          total_lessons: number
        }
        Insert: {
          expires_at?: string | null
          id?: string
          lessons_remaining: number
          package_id: string
          payment_id?: string | null
          purchased_at?: string
          student_id: string
          total_lessons: number
        }
        Update: {
          expires_at?: string | null
          id?: string
          lessons_remaining?: number
          package_id?: string
          payment_id?: string | null
          purchased_at?: string
          student_id?: string
          total_lessons?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_package_purchases_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "lesson_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      student_parent_relationships: {
        Row: {
          approved_at: string | null
          can_book_lessons: boolean | null
          can_communicate_teachers: boolean | null
          can_view_progress: boolean | null
          created_at: string
          id: string
          is_primary_contact: boolean | null
          parent_id: string
          relationship_type: string
          student_id: string
        }
        Insert: {
          approved_at?: string | null
          can_book_lessons?: boolean | null
          can_communicate_teachers?: boolean | null
          can_view_progress?: boolean | null
          created_at?: string
          id?: string
          is_primary_contact?: boolean | null
          parent_id: string
          relationship_type: string
          student_id: string
        }
        Update: {
          approved_at?: string | null
          can_book_lessons?: boolean | null
          can_communicate_teachers?: boolean | null
          can_view_progress?: boolean | null
          created_at?: string
          id?: string
          is_primary_contact?: boolean | null
          parent_id?: string
          relationship_type?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_parent_relationships_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parent_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "student_parent_relationships_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          cefr_level: string
          created_at: string
          current_streak: number | null
          daily_streak: number | null
          date_of_birth: string | null
          emergency_contact: string | null
          final_cefr_level: string | null
          fluency_score: number
          gaps: string[] | null
          grade_level: string | null
          id: string
          interests: string[] | null
          last_activity_date: string | null
          last_completed_sequence_a1: number | null
          last_completed_sequence_a2: number | null
          last_completed_sequence_b1: number | null
          last_completed_sequence_b2: number | null
          last_completed_sequence_prea1: number | null
          last_streak_date: string | null
          learning_style: string | null
          long_term_goal: string | null
          longest_streak: number | null
          mistake_history: Json | null
          onboarding_completed: boolean | null
          parent_email: string | null
          pet_happiness: number | null
          pet_type: string | null
          placement_test_2_completed_at: string | null
          placement_test_2_score: number | null
          placement_test_2_total: number | null
          placement_test_completed_at: string | null
          placement_test_score: number | null
          placement_test_total: number | null
          preferred_lesson_time: string | null
          profile_image_url: string | null
          school_name: string | null
          strengths: string[] | null
          student_level: Database["public"]["Enums"]["student_level"] | null
          timezone: string | null
          updated_at: string
          user_id: string
          weekly_goal: string | null
          weekly_goal_set_at: string | null
          weekly_minutes: number | null
          words_learned_today: number | null
        }
        Insert: {
          cefr_level?: string
          created_at?: string
          current_streak?: number | null
          daily_streak?: number | null
          date_of_birth?: string | null
          emergency_contact?: string | null
          final_cefr_level?: string | null
          fluency_score?: number
          gaps?: string[] | null
          grade_level?: string | null
          id?: string
          interests?: string[] | null
          last_activity_date?: string | null
          last_completed_sequence_a1?: number | null
          last_completed_sequence_a2?: number | null
          last_completed_sequence_b1?: number | null
          last_completed_sequence_b2?: number | null
          last_completed_sequence_prea1?: number | null
          last_streak_date?: string | null
          learning_style?: string | null
          long_term_goal?: string | null
          longest_streak?: number | null
          mistake_history?: Json | null
          onboarding_completed?: boolean | null
          parent_email?: string | null
          pet_happiness?: number | null
          pet_type?: string | null
          placement_test_2_completed_at?: string | null
          placement_test_2_score?: number | null
          placement_test_2_total?: number | null
          placement_test_completed_at?: string | null
          placement_test_score?: number | null
          placement_test_total?: number | null
          preferred_lesson_time?: string | null
          profile_image_url?: string | null
          school_name?: string | null
          strengths?: string[] | null
          student_level?: Database["public"]["Enums"]["student_level"] | null
          timezone?: string | null
          updated_at?: string
          user_id: string
          weekly_goal?: string | null
          weekly_goal_set_at?: string | null
          weekly_minutes?: number | null
          words_learned_today?: number | null
        }
        Update: {
          cefr_level?: string
          created_at?: string
          current_streak?: number | null
          daily_streak?: number | null
          date_of_birth?: string | null
          emergency_contact?: string | null
          final_cefr_level?: string | null
          fluency_score?: number
          gaps?: string[] | null
          grade_level?: string | null
          id?: string
          interests?: string[] | null
          last_activity_date?: string | null
          last_completed_sequence_a1?: number | null
          last_completed_sequence_a2?: number | null
          last_completed_sequence_b1?: number | null
          last_completed_sequence_b2?: number | null
          last_completed_sequence_prea1?: number | null
          last_streak_date?: string | null
          learning_style?: string | null
          long_term_goal?: string | null
          longest_streak?: number | null
          mistake_history?: Json | null
          onboarding_completed?: boolean | null
          parent_email?: string | null
          pet_happiness?: number | null
          pet_type?: string | null
          placement_test_2_completed_at?: string | null
          placement_test_2_score?: number | null
          placement_test_2_total?: number | null
          placement_test_completed_at?: string | null
          placement_test_score?: number | null
          placement_test_total?: number | null
          preferred_lesson_time?: string | null
          profile_image_url?: string | null
          school_name?: string | null
          strengths?: string[] | null
          student_level?: Database["public"]["Enums"]["student_level"] | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
          weekly_goal?: string | null
          weekly_goal_set_at?: string | null
          weekly_minutes?: number | null
          words_learned_today?: number | null
        }
        Relationships: []
      }
      student_reward_purchases: {
        Row: {
          coins_spent: number
          id: string
          is_active: boolean
          purchased_at: string
          reward_id: string
          student_id: string
        }
        Insert: {
          coins_spent: number
          id?: string
          is_active?: boolean
          purchased_at?: string
          reward_id: string
          student_id: string
        }
        Update: {
          coins_spent?: number
          id?: string
          is_active?: boolean
          purchased_at?: string
          reward_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_reward_purchases_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "virtual_rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      student_slide_progress: {
        Row: {
          accuracy_score: number | null
          attempts: number | null
          completed_at: string | null
          created_at: string | null
          id: string
          lesson_id: string
          slide_id: string
          student_id: string
          time_spent_seconds: number | null
          updated_at: string | null
          xp_earned: number | null
        }
        Insert: {
          accuracy_score?: number | null
          attempts?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id: string
          slide_id: string
          student_id: string
          time_spent_seconds?: number | null
          updated_at?: string | null
          xp_earned?: number | null
        }
        Update: {
          accuracy_score?: number | null
          attempts?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: string
          slide_id?: string
          student_id?: string
          time_spent_seconds?: number | null
          updated_at?: string | null
          xp_earned?: number | null
        }
        Relationships: []
      }
      student_speaking_profiles: {
        Row: {
          availability_schedule: Json | null
          confidence_level: string | null
          created_at: string | null
          current_cefr_level: string
          id: string
          learning_style: string | null
          personality_type: string | null
          preferred_topics: string[] | null
          speaking_goals: string[] | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          availability_schedule?: Json | null
          confidence_level?: string | null
          created_at?: string | null
          current_cefr_level?: string
          id?: string
          learning_style?: string | null
          personality_type?: string | null
          preferred_topics?: string[] | null
          speaking_goals?: string[] | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          availability_schedule?: Json | null
          confidence_level?: string | null
          created_at?: string | null
          current_cefr_level?: string
          id?: string
          learning_style?: string | null
          personality_type?: string | null
          preferred_topics?: string[] | null
          speaking_goals?: string[] | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      student_xp: {
        Row: {
          created_at: string
          current_level: number
          id: string
          last_activity_date: string | null
          student_id: string
          total_xp: number
          updated_at: string
          xp_in_current_level: number
        }
        Insert: {
          created_at?: string
          current_level?: number
          id?: string
          last_activity_date?: string | null
          student_id: string
          total_xp?: number
          updated_at?: string
          xp_in_current_level?: number
        }
        Update: {
          created_at?: string
          current_level?: number
          id?: string
          last_activity_date?: string | null
          student_id?: string
          total_xp?: number
          updated_at?: string
          xp_in_current_level?: number
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          currency: string
          features: Json
          id: string
          interval_type: string
          is_active: boolean
          is_trial: boolean
          max_classes_per_month: number | null
          name: string
          price_dzd: number
          price_eur: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          features?: Json
          id?: string
          interval_type?: string
          is_active?: boolean
          is_trial?: boolean
          max_classes_per_month?: number | null
          name: string
          price_dzd?: number
          price_eur?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          features?: Json
          id?: string
          interval_type?: string
          is_active?: boolean
          is_trial?: boolean
          max_classes_per_month?: number | null
          name?: string
          price_dzd?: number
          price_eur?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      system_transitions: {
        Row: {
          from_system: string | null
          id: string
          metadata: Json | null
          to_system: string
          transition_date: string | null
          trigger_reason: string
          triggered_by: string | null
          user_id: string
        }
        Insert: {
          from_system?: string | null
          id?: string
          metadata?: Json | null
          to_system: string
          transition_date?: string | null
          trigger_reason: string
          triggered_by?: string | null
          user_id: string
        }
        Update: {
          from_system?: string | null
          id?: string
          metadata?: Json | null
          to_system?: string
          transition_date?: string | null
          trigger_reason?: string
          triggered_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_transitions_triggered_by_fkey"
            columns: ["triggered_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_transitions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      systematic_lessons: {
        Row: {
          activities: Json | null
          archived_at: string | null
          archived_reason: string | null
          communication_outcome: string | null
          created_at: string | null
          curriculum_level_id: string
          difficulty_level: number | null
          estimated_duration: number | null
          gamified_elements: Json | null
          grammar_focus: string | null
          id: string
          is_review_lesson: boolean | null
          lesson_number: number
          lesson_objectives: Json | null
          prerequisite_lessons: string[] | null
          slides_content: Json | null
          status: string | null
          title: string
          topic: string
          updated_at: string | null
          vocabulary_set: Json | null
        }
        Insert: {
          activities?: Json | null
          archived_at?: string | null
          archived_reason?: string | null
          communication_outcome?: string | null
          created_at?: string | null
          curriculum_level_id: string
          difficulty_level?: number | null
          estimated_duration?: number | null
          gamified_elements?: Json | null
          grammar_focus?: string | null
          id?: string
          is_review_lesson?: boolean | null
          lesson_number: number
          lesson_objectives?: Json | null
          prerequisite_lessons?: string[] | null
          slides_content?: Json | null
          status?: string | null
          title: string
          topic: string
          updated_at?: string | null
          vocabulary_set?: Json | null
        }
        Update: {
          activities?: Json | null
          archived_at?: string | null
          archived_reason?: string | null
          communication_outcome?: string | null
          created_at?: string | null
          curriculum_level_id?: string
          difficulty_level?: number | null
          estimated_duration?: number | null
          gamified_elements?: Json | null
          grammar_focus?: string | null
          id?: string
          is_review_lesson?: boolean | null
          lesson_number?: number
          lesson_objectives?: Json | null
          prerequisite_lessons?: string[] | null
          slides_content?: Json | null
          status?: string | null
          title?: string
          topic?: string
          updated_at?: string | null
          vocabulary_set?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "systematic_lessons_curriculum_level_id_fkey"
            columns: ["curriculum_level_id"]
            isOneToOne: false
            referencedRelation: "curriculum_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_absences: {
        Row: {
          absence_date: string
          absence_type: string
          created_at: string | null
          id: string
          lesson_id: string | null
          penalty_applied: boolean | null
          suspension_applied: boolean | null
          teacher_id: string
          warning_given: boolean | null
        }
        Insert: {
          absence_date: string
          absence_type: string
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          penalty_applied?: boolean | null
          suspension_applied?: boolean | null
          teacher_id: string
          warning_given?: boolean | null
        }
        Update: {
          absence_date?: string
          absence_type?: string
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          penalty_applied?: boolean | null
          suspension_applied?: boolean | null
          teacher_id?: string
          warning_given?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_absences_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_achievements: {
        Row: {
          achievement_description: string | null
          achievement_name: string
          achievement_type: string
          earned_at: string | null
          id: string
          points_awarded: number | null
          teacher_id: string
        }
        Insert: {
          achievement_description?: string | null
          achievement_name: string
          achievement_type: string
          earned_at?: string | null
          id?: string
          points_awarded?: number | null
          teacher_id: string
        }
        Update: {
          achievement_description?: string | null
          achievement_name?: string
          achievement_type?: string
          earned_at?: string | null
          id?: string
          points_awarded?: number | null
          teacher_id?: string
        }
        Relationships: []
      }
      teacher_applications: {
        Row: {
          address: string | null
          admin_notes: string | null
          age_groups_experience: string[] | null
          availability: string | null
          bio: string | null
          certifications: string[] | null
          classroom_management: string | null
          contact_notes: string | null
          cover_letter: string | null
          created_at: string | null
          current_stage: string | null
          cv_url: string | null
          date_of_birth: string | null
          documents_approved: boolean | null
          education: string | null
          email: string
          equipment_test_passed: boolean | null
          esl_certification: string | null
          first_name: string
          id: string
          interview_feedback: string | null
          interview_passed: boolean | null
          interview_scheduled_at: string | null
          interviewed_by: string | null
          intro_video_approved: boolean | null
          languages_spoken: string[] | null
          last_contact_date: string | null
          last_name: string
          nationality: string | null
          phone: string | null
          portfolio_url: string | null
          preferred_age_groups: string[] | null
          preferred_schedule: string | null
          previous_roles: string | null
          professional_references: Json | null
          rejection_reason: string | null
          salary_expectation: number | null
          skills: string[] | null
          status: string | null
          teaching_experience_years: number | null
          teaching_methodology: string | null
          teaching_philosophy: string | null
          updated_at: string | null
          user_id: string | null
          video_description: string | null
        }
        Insert: {
          address?: string | null
          admin_notes?: string | null
          age_groups_experience?: string[] | null
          availability?: string | null
          bio?: string | null
          certifications?: string[] | null
          classroom_management?: string | null
          contact_notes?: string | null
          cover_letter?: string | null
          created_at?: string | null
          current_stage?: string | null
          cv_url?: string | null
          date_of_birth?: string | null
          documents_approved?: boolean | null
          education?: string | null
          email: string
          equipment_test_passed?: boolean | null
          esl_certification?: string | null
          first_name: string
          id?: string
          interview_feedback?: string | null
          interview_passed?: boolean | null
          interview_scheduled_at?: string | null
          interviewed_by?: string | null
          intro_video_approved?: boolean | null
          languages_spoken?: string[] | null
          last_contact_date?: string | null
          last_name: string
          nationality?: string | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_age_groups?: string[] | null
          preferred_schedule?: string | null
          previous_roles?: string | null
          professional_references?: Json | null
          rejection_reason?: string | null
          salary_expectation?: number | null
          skills?: string[] | null
          status?: string | null
          teaching_experience_years?: number | null
          teaching_methodology?: string | null
          teaching_philosophy?: string | null
          updated_at?: string | null
          user_id?: string | null
          video_description?: string | null
        }
        Update: {
          address?: string | null
          admin_notes?: string | null
          age_groups_experience?: string[] | null
          availability?: string | null
          bio?: string | null
          certifications?: string[] | null
          classroom_management?: string | null
          contact_notes?: string | null
          cover_letter?: string | null
          created_at?: string | null
          current_stage?: string | null
          cv_url?: string | null
          date_of_birth?: string | null
          documents_approved?: boolean | null
          education?: string | null
          email?: string
          equipment_test_passed?: boolean | null
          esl_certification?: string | null
          first_name?: string
          id?: string
          interview_feedback?: string | null
          interview_passed?: boolean | null
          interview_scheduled_at?: string | null
          interviewed_by?: string | null
          intro_video_approved?: boolean | null
          languages_spoken?: string[] | null
          last_contact_date?: string | null
          last_name?: string
          nationality?: string | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_age_groups?: string[] | null
          preferred_schedule?: string | null
          previous_roles?: string | null
          professional_references?: Json | null
          rejection_reason?: string | null
          salary_expectation?: number | null
          skills?: string[] | null
          status?: string | null
          teaching_experience_years?: number | null
          teaching_methodology?: string | null
          teaching_philosophy?: string | null
          updated_at?: string | null
          user_id?: string | null
          video_description?: string | null
        }
        Relationships: []
      }
      teacher_availability: {
        Row: {
          created_at: string
          duration: number
          end_time: string
          id: string
          is_available: boolean
          is_booked: boolean
          lesson_id: string | null
          lesson_title: string | null
          lesson_type: string
          notes: string | null
          price_per_hour: number
          recurring_pattern: Json | null
          start_time: string
          student_id: string | null
          teacher_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration?: number
          end_time: string
          id?: string
          is_available?: boolean
          is_booked?: boolean
          lesson_id?: string | null
          lesson_title?: string | null
          lesson_type?: string
          notes?: string | null
          price_per_hour?: number
          recurring_pattern?: Json | null
          start_time: string
          student_id?: string | null
          teacher_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration?: number
          end_time?: string
          id?: string
          is_available?: boolean
          is_booked?: boolean
          lesson_id?: string | null
          lesson_title?: string | null
          lesson_type?: string
          notes?: string | null
          price_per_hour?: number
          recurring_pattern?: Json | null
          start_time?: string
          student_id?: string | null
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_availability_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_earnings: {
        Row: {
          created_at: string | null
          earned_at: string | null
          gross_amount: number
          id: string
          lesson_id: string
          paid_at: string | null
          payment_id: string | null
          platform_amount: number
          revenue_split_id: string | null
          split_percentage: number
          status: string | null
          teacher_amount: number
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          earned_at?: string | null
          gross_amount: number
          id?: string
          lesson_id: string
          paid_at?: string | null
          payment_id?: string | null
          platform_amount: number
          revenue_split_id?: string | null
          split_percentage: number
          status?: string | null
          teacher_amount: number
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          earned_at?: string | null
          gross_amount?: number
          id?: string
          lesson_id?: string
          paid_at?: string | null
          payment_id?: string | null
          platform_amount?: number
          revenue_split_id?: string | null
          split_percentage?: number
          status?: string | null
          teacher_amount?: number
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_earnings_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_earnings_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_earnings_revenue_split_id_fkey"
            columns: ["revenue_split_id"]
            isOneToOne: false
            referencedRelation: "revenue_splits"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_equipment_tests: {
        Row: {
          application_id: string | null
          created_at: string | null
          download_speed: number | null
          id: string
          microphone_test: boolean | null
          overall_passed: boolean | null
          ping_latency: number | null
          screen_sharing_test: boolean | null
          speaker_test: boolean | null
          test_completed_at: string | null
          upload_speed: number | null
          webcam_test: boolean | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          download_speed?: number | null
          id?: string
          microphone_test?: boolean | null
          overall_passed?: boolean | null
          ping_latency?: number | null
          screen_sharing_test?: boolean | null
          speaker_test?: boolean | null
          test_completed_at?: string | null
          upload_speed?: number | null
          webcam_test?: boolean | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          download_speed?: number | null
          id?: string
          microphone_test?: boolean | null
          overall_passed?: boolean | null
          ping_latency?: number | null
          screen_sharing_test?: boolean | null
          speaker_test?: boolean | null
          test_completed_at?: string | null
          upload_speed?: number | null
          webcam_test?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_equipment_tests_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "teacher_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_interviews: {
        Row: {
          application_id: string | null
          approved: boolean | null
          created_at: string | null
          duration: number | null
          id: string
          interview_notes: string | null
          interview_type: string | null
          interviewer_id: string | null
          rating: number | null
          scheduled_at: string
          status: string | null
          updated_at: string | null
          zoom_link: string | null
        }
        Insert: {
          application_id?: string | null
          approved?: boolean | null
          created_at?: string | null
          duration?: number | null
          id?: string
          interview_notes?: string | null
          interview_type?: string | null
          interviewer_id?: string | null
          rating?: number | null
          scheduled_at: string
          status?: string | null
          updated_at?: string | null
          zoom_link?: string | null
        }
        Update: {
          application_id?: string | null
          approved?: boolean | null
          created_at?: string | null
          duration?: number | null
          id?: string
          interview_notes?: string | null
          interview_type?: string | null
          interviewer_id?: string | null
          rating?: number | null
          scheduled_at?: string
          status?: string | null
          updated_at?: string | null
          zoom_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "teacher_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_interviews_interviewer_id_fkey"
            columns: ["interviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_onboarding_progress: {
        Row: {
          application_id: string | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          data: Json | null
          id: string
          step_name: string
        }
        Insert: {
          application_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          step_name: string
        }
        Update: {
          application_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          step_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_onboarding_progress_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "teacher_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_payouts: {
        Row: {
          created_at: string | null
          id: string
          paid_at: string | null
          payment_method: string | null
          payment_reference: string | null
          payout_period_end: string
          payout_period_start: string
          status: string | null
          teacher_id: string
          total_earnings: number
          total_lessons: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payout_period_end: string
          payout_period_start: string
          status?: string | null
          teacher_id: string
          total_earnings?: number
          total_lessons?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payout_period_end?: string
          payout_period_start?: string
          status?: string | null
          teacher_id?: string
          total_earnings?: number
          total_lessons?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      teacher_penalties: {
        Row: {
          created_at: string | null
          id: string
          lesson_id: string | null
          notes: string | null
          penalty_amount: number | null
          penalty_date: string | null
          penalty_type: string
          resolved: boolean | null
          teacher_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          notes?: string | null
          penalty_amount?: number | null
          penalty_date?: string | null
          penalty_type: string
          resolved?: boolean | null
          teacher_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          notes?: string | null
          penalty_amount?: number | null
          penalty_date?: string | null
          penalty_type?: string
          resolved?: boolean | null
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_penalties_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_performance_metrics: {
        Row: {
          attendance_rate: number | null
          created_at: string | null
          curriculum_coverage: number | null
          feedback_completion_rate: number | null
          id: string
          lesson_quality_score: number | null
          overall_kpi_score: number | null
          response_time_score: number | null
          student_progress_impact: number | null
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          attendance_rate?: number | null
          created_at?: string | null
          curriculum_coverage?: number | null
          feedback_completion_rate?: number | null
          id?: string
          lesson_quality_score?: number | null
          overall_kpi_score?: number | null
          response_time_score?: number | null
          student_progress_impact?: number | null
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          attendance_rate?: number | null
          created_at?: string | null
          curriculum_coverage?: number | null
          feedback_completion_rate?: number | null
          id?: string
          lesson_quality_score?: number | null
          overall_kpi_score?: number | null
          response_time_score?: number | null
          student_progress_impact?: number | null
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      teacher_profiles: {
        Row: {
          accent: string | null
          availability_schedule: Json | null
          bio: string | null
          can_teach: boolean | null
          certificate_urls: string[] | null
          created_at: string
          hourly_rate_dzd: number | null
          hourly_rate_eur: number | null
          id: string
          intro_video_url: string | null
          is_available: boolean | null
          languages_spoken: string[] | null
          payoneer_account_email: string | null
          profile_approved_by_admin: boolean | null
          profile_complete: boolean | null
          profile_image_url: string | null
          rating: number | null
          specializations: string[] | null
          timezone: string | null
          total_reviews: number | null
          updated_at: string
          user_id: string
          video_url: string | null
          years_experience: number | null
        }
        Insert: {
          accent?: string | null
          availability_schedule?: Json | null
          bio?: string | null
          can_teach?: boolean | null
          certificate_urls?: string[] | null
          created_at?: string
          hourly_rate_dzd?: number | null
          hourly_rate_eur?: number | null
          id?: string
          intro_video_url?: string | null
          is_available?: boolean | null
          languages_spoken?: string[] | null
          payoneer_account_email?: string | null
          profile_approved_by_admin?: boolean | null
          profile_complete?: boolean | null
          profile_image_url?: string | null
          rating?: number | null
          specializations?: string[] | null
          timezone?: string | null
          total_reviews?: number | null
          updated_at?: string
          user_id: string
          video_url?: string | null
          years_experience?: number | null
        }
        Update: {
          accent?: string | null
          availability_schedule?: Json | null
          bio?: string | null
          can_teach?: boolean | null
          certificate_urls?: string[] | null
          created_at?: string
          hourly_rate_dzd?: number | null
          hourly_rate_eur?: number | null
          id?: string
          intro_video_url?: string | null
          is_available?: boolean | null
          languages_spoken?: string[] | null
          payoneer_account_email?: string | null
          profile_approved_by_admin?: boolean | null
          profile_complete?: boolean | null
          profile_image_url?: string | null
          rating?: number | null
          specializations?: string[] | null
          timezone?: string | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string
          video_url?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_reviews: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          is_public: boolean | null
          rating: number
          review_text: string | null
          student_id: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          rating: number
          review_text?: string | null
          student_id: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          rating?: number
          review_text?: string | null
          student_id?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "class_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_reviews_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_reviews_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_withdrawals: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string
          id: string
          payoneer_account_email: string
          processed_at: string | null
          rejection_reason: string | null
          requested_at: string
          status: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string
          id?: string
          payoneer_account_email: string
          processed_at?: string | null
          rejection_reason?: string | null
          requested_at?: string
          status?: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string
          id?: string
          payoneer_account_email?: string
          processed_at?: string | null
          rejection_reason?: string | null
          requested_at?: string
          status?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tracks: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_published: boolean | null
          name: string
          order_index: number | null
          target_system: string
          thumbnail_url: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          name: string
          order_index?: number | null
          target_system: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          name?: string
          order_index?: number | null
          target_system?: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      unit_lessons: {
        Row: {
          created_at: string | null
          id: string
          lesson_id: string | null
          lesson_order: number
          unit_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          lesson_order: number
          unit_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          lesson_order?: number
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unit_lessons_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "systematic_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unit_lessons_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "curriculum_units"
            referencedColumns: ["id"]
          },
        ]
      }
      user_community_stats: {
        Row: {
          badges_earned: string[] | null
          community_points: number | null
          created_at: string | null
          id: string
          last_activity_date: string | null
          reputation_score: number | null
          streak_days: number | null
          total_challenges_completed: number | null
          total_communities: number | null
          total_events_attended: number | null
          total_likes_received: number | null
          total_posts: number | null
          total_replies: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          badges_earned?: string[] | null
          community_points?: number | null
          created_at?: string | null
          id?: string
          last_activity_date?: string | null
          reputation_score?: number | null
          streak_days?: number | null
          total_challenges_completed?: number | null
          total_communities?: number | null
          total_events_attended?: number | null
          total_likes_received?: number | null
          total_posts?: number | null
          total_replies?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          badges_earned?: string[] | null
          community_points?: number | null
          created_at?: string | null
          id?: string
          last_activity_date?: string | null
          reputation_score?: number | null
          streak_days?: number | null
          total_challenges_completed?: number | null
          total_communities?: number | null
          total_events_attended?: number | null
          total_likes_received?: number | null
          total_posts?: number | null
          total_replies?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          classes_used_this_month: number
          created_at: string
          id: string
          payment_method: string | null
          plan_id: string
          status: string
          stripe_subscription_id: string | null
          subscription_end: string | null
          subscription_start: string
          trial_end_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          classes_used_this_month?: number
          created_at?: string
          id?: string
          payment_method?: string | null
          plan_id: string
          status?: string
          stripe_subscription_id?: string | null
          subscription_end?: string | null
          subscription_start?: string
          trial_end_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          classes_used_this_month?: number
          created_at?: string
          id?: string
          payment_method?: string | null
          plan_id?: string
          status?: string
          stripe_subscription_id?: string | null
          subscription_end?: string | null
          subscription_start?: string
          trial_end_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_id: number | null
          cohort_group: string | null
          created_at: string
          current_level_id: string | null
          current_system: string | null
          email: string
          full_name: string
          id: string
          payment_locked: boolean | null
          primary_organization_id: string | null
          role: string
          teacher_level: string | null
          teacher_points: number | null
          updated_at: string
        }
        Insert: {
          avatar_id?: number | null
          cohort_group?: string | null
          created_at?: string
          current_level_id?: string | null
          current_system?: string | null
          email: string
          full_name: string
          id: string
          payment_locked?: boolean | null
          primary_organization_id?: string | null
          role: string
          teacher_level?: string | null
          teacher_points?: number | null
          updated_at?: string
        }
        Update: {
          avatar_id?: number | null
          cohort_group?: string | null
          created_at?: string
          current_level_id?: string | null
          current_system?: string | null
          email?: string
          full_name?: string
          id?: string
          payment_locked?: boolean | null
          primary_organization_id?: string | null
          role?: string
          teacher_level?: string | null
          teacher_points?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_current_level_id_fkey"
            columns: ["current_level_id"]
            isOneToOne: false
            referencedRelation: "curriculum_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_primary_organization_id_fkey"
            columns: ["primary_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      virtual_rewards: {
        Row: {
          category: string
          cost_coins: number
          created_at: string
          description: string
          id: string
          is_available: boolean
          limited_quantity: number | null
          metadata: Json
          name: string
          purchased_count: number
          rarity: string
        }
        Insert: {
          category: string
          cost_coins: number
          created_at?: string
          description: string
          id?: string
          is_available?: boolean
          limited_quantity?: number | null
          metadata?: Json
          name: string
          purchased_count?: number
          rarity?: string
        }
        Update: {
          category?: string
          cost_coins?: number
          created_at?: string
          description?: string
          id?: string
          is_available?: boolean
          limited_quantity?: number | null
          metadata?: Json
          name?: string
          purchased_count?: number
          rarity?: string
        }
        Relationships: []
      }
      vocabulary_progression: {
        Row: {
          age_range: string
          cefr_level: string
          created_at: string | null
          id: string
          themes: Json
          word_lists: Json
        }
        Insert: {
          age_range: string
          cefr_level: string
          created_at?: string | null
          id?: string
          themes: Json
          word_lists: Json
        }
        Update: {
          age_range?: string
          cefr_level?: string
          created_at?: string | null
          id?: string
          themes?: Json
          word_lists?: Json
        }
        Relationships: []
      }
      weekly_assessments: {
        Row: {
          assessment_data: Json | null
          completed_at: string | null
          conversation_duration_seconds: number | null
          conversation_fluency_score: number | null
          curriculum_id: string
          grammar_accuracy_percentage: number | null
          id: string
          neuroscience_retention_score: number | null
          sentence_construction_score: number | null
          student_id: string
          theme: string
          vocabulary_accuracy_percentage: number | null
          week_number: number
        }
        Insert: {
          assessment_data?: Json | null
          completed_at?: string | null
          conversation_duration_seconds?: number | null
          conversation_fluency_score?: number | null
          curriculum_id: string
          grammar_accuracy_percentage?: number | null
          id?: string
          neuroscience_retention_score?: number | null
          sentence_construction_score?: number | null
          student_id: string
          theme: string
          vocabulary_accuracy_percentage?: number | null
          week_number: number
        }
        Update: {
          assessment_data?: Json | null
          completed_at?: string | null
          conversation_duration_seconds?: number | null
          conversation_fluency_score?: number | null
          curriculum_id?: string
          grammar_accuracy_percentage?: number | null
          id?: string
          neuroscience_retention_score?: number | null
          sentence_construction_score?: number | null
          student_id?: string
          theme?: string
          vocabulary_accuracy_percentage?: number | null
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "weekly_assessments_curriculum_id_fkey"
            columns: ["curriculum_id"]
            isOneToOne: false
            referencedRelation: "generated_curriculums"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      lesson_library_view: {
        Row: {
          age_group: string | null
          cefr_level: string | null
          created_at: string | null
          creator_name: string | null
          duration_minutes: number | null
          id: string | null
          learning_objectives: string[] | null
          screens_data: Json | null
          sequence_number: number | null
          status: string | null
          title: string | null
          topic: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_access_booking_session: {
        Args: { p_session_id: string; p_user_id: string }
        Returns: boolean
      }
      can_access_lesson: {
        Args: { room_uuid: string; user_uuid: string }
        Returns: boolean
      }
      check_achievements: {
        Args: { activity_data: Json; student_uuid: string }
        Returns: Json[]
      }
      check_teacher_penalties: {
        Args: { teacher_uuid: string }
        Returns: undefined
      }
      cleanup_stale_classroom_sessions: { Args: never; Returns: number }
      consume_credit: { Args: { p_student_id: string }; Returns: boolean }
      create_admin_notification: {
        Args: {
          p_message: string
          p_metadata?: Json
          p_notification_type: string
          p_title: string
        }
        Returns: undefined
      }
      generate_adaptive_learning_path: {
        Args: {
          difficulty_pref?: string
          learning_style_param?: string
          student_uuid: string
          target_cefr_level: string
        }
        Returns: string
      }
      generate_room_id: { Args: never; Returns: string }
      get_admin_dashboard_stats: {
        Args: never
        Returns: {
          lessons_booked_week: number
          new_students_week: number
          new_teachers_week: number
          total_lessons_completed: number
          total_students: number
          total_teachers: number
          upcoming_lessons: number
        }[]
      }
      get_approved_teachers: {
        Args: never
        Returns: {
          accent: string
          bio: string
          full_name: string
          hourly_rate_dzd: number
          hourly_rate_eur: number
          id: string
          languages_spoken: string[]
          profile_image_url: string
          rating: number
          specializations: string[]
          timezone: string
          total_reviews: number
          user_id: string
          video_url: string
          years_experience: number
        }[]
      }
      get_current_user_role: { Args: never; Returns: string }
      get_organization_analytics: { Args: { org_uuid: string }; Returns: Json }
      get_pending_reminders: {
        Args: never
        Returns: {
          lesson_date: string
          lesson_id: string
          lesson_title: string
          recipient_email: string
          recipient_name: string
          recipient_type: string
          reminder_id: string
          reminder_type: string
          room_link: string
          student_name: string
          teacher_name: string
        }[]
      }
      get_security_dashboard: { Args: never; Returns: Json }
      get_security_metrics: { Args: never; Returns: Json }
      get_security_status: { Args: never; Returns: Json }
      get_student_curriculum_analytics: {
        Args: { p_curriculum_id: string; p_student_id: string }
        Returns: Json
      }
      get_student_lesson_stats: {
        Args: { student_uuid: string }
        Returns: Json
      }
      get_student_progress_for_parent: {
        Args: { p_parent_id: string; p_student_id: string }
        Returns: Json
      }
      get_student_success_prediction: {
        Args: { student_uuid: string }
        Returns: Json
      }
      get_student_upcoming_lessons: {
        Args: { student_uuid: string }
        Returns: {
          duration: number
          id: string
          room_id: string
          room_link: string
          scheduled_at: string
          status: string
          teacher_id: string
          teacher_name: string
          title: string
        }[]
      }
      get_teacher_available_balance: {
        Args: { teacher_uuid: string }
        Returns: number
      }
      get_teacher_earnings_summary: {
        Args: { teacher_uuid: string }
        Returns: Json
      }
      get_teacher_profile_with_payment: {
        Args: { teacher_user_id: string }
        Returns: {
          accent: string
          bio: string
          full_name: string
          hourly_rate_dzd: number
          hourly_rate_eur: number
          id: string
          is_available: boolean
          languages_spoken: string[]
          payoneer_account_email: string
          profile_image_url: string
          rating: number
          specializations: string[]
          timezone: string
          total_reviews: number
          user_id: string
          video_url: string
          years_experience: number
        }[]
      }
      get_teacher_upcoming_lessons: {
        Args: { teacher_uuid: string }
        Returns: {
          duration: number
          id: string
          room_id: string
          room_link: string
          scheduled_at: string
          status: string
          student_id: string
          student_name: string
          title: string
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      handle_security_incident: {
        Args: {
          affected_user_id?: string
          description?: string
          incident_type: string
          severity?: string
        }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_user_admin: { Args: never; Returns: boolean }
      is_user_teacher: { Args: never; Returns: boolean }
      jsonb_array_append: {
        Args: { new_value: Json; target: Json }
        Returns: Json
      }
      log_security_event: {
        Args: {
          p_action: string
          p_metadata?: Json
          p_resource_id?: string
          p_resource_type: string
        }
        Returns: undefined
      }
      process_lesson_completion: {
        Args: {
          failure_reason?: string
          lesson_status: string
          lesson_uuid: string
        }
        Returns: Json
      }
      purchase_virtual_reward: {
        Args: { reward_uuid: string; student_uuid: string }
        Returns: Json
      }
      refund_credit: { Args: { p_student_id: string }; Returns: undefined }
      reset_monthly_class_usage: { Args: never; Returns: undefined }
      save_placement_test_result: {
        Args: {
          p_cefr_level: string
          p_score: number
          p_total: number
          p_user_id: string
        }
        Returns: boolean
      }
      schedule_lesson_reminders: {
        Args: { p_lesson_id: string }
        Returns: undefined
      }
      submit_teacher_application: {
        Args: {
          p_address?: string
          p_certifications?: string[]
          p_cover_letter?: string
          p_cv_url?: string
          p_education?: string
          p_email: string
          p_first_name: string
          p_languages_spoken?: string[]
          p_last_name: string
          p_phone?: string
          p_teaching_experience_years?: number
        }
        Returns: string
      }
      update_learning_currency: {
        Args: {
          coins_to_add: number
          currency_source?: string
          student_uuid: string
        }
        Returns: Json
      }
      update_learning_model: {
        Args: {
          confidence?: number
          model_type_param: string
          new_model_data: Json
          student_uuid: string
        }
        Returns: string
      }
      update_learning_streak: {
        Args: { streak_type_param?: string; student_uuid: string }
        Returns: Json
      }
      update_student_xp: {
        Args: { student_uuid: string; xp_to_add: number }
        Returns: Json
      }
      update_teacher_performance_metrics: {
        Args: { teacher_uuid: string }
        Returns: undefined
      }
      validate_security_config: {
        Args: never
        Returns: {
          check_name: string
          details: string
          risk_level: string
          status: string
        }[]
      }
      verify_admin_access: {
        Args: { required_permission?: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "teacher" | "admin"
      community_category:
        | "conversation_practice"
        | "business_english"
        | "ielts_preparation"
        | "academic_english"
        | "cultural_exchange"
        | "pronunciation"
        | "writing_practice"
        | "general_discussion"
      community_privacy: "public" | "private" | "invite_only"
      community_role: "owner" | "moderator" | "member" | "guest"
      student_level: "playground" | "academy" | "professional"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "teacher", "admin"],
      community_category: [
        "conversation_practice",
        "business_english",
        "ielts_preparation",
        "academic_english",
        "cultural_exchange",
        "pronunciation",
        "writing_practice",
        "general_discussion",
      ],
      community_privacy: ["public", "private", "invite_only"],
      community_role: ["owner", "moderator", "member", "guest"],
      student_level: ["playground", "academy", "professional"],
    },
  },
} as const
