export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
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
          notes: string | null
          price_paid: number
          scheduled_at: string
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
          notes?: string | null
          price_paid?: number
          scheduled_at: string
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
          notes?: string | null
          price_paid?: number
          scheduled_at?: string
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
          created_at: string
          ended_at: string | null
          id: string
          room_id: string
          session_status: string
          started_at: string | null
          teacher_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          room_id: string
          session_status?: string
          started_at?: string | null
          teacher_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          room_id?: string
          session_status?: string
          started_at?: string | null
          teacher_id?: string
          updated_at?: string
        }
        Relationships: []
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
          updated_at?: string | null
          xp_required?: number | null
        }
        Relationships: []
      }
      curriculum_materials: {
        Row: {
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
          xp_reward: number | null
        }
        Insert: {
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
          xp_reward?: number | null
        }
        Update: {
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
      lessons: {
        Row: {
          cost: number | null
          created_at: string
          duration: number
          feedback_required: boolean | null
          feedback_submitted: boolean | null
          id: string
          quality_rating: number | null
          room_id: string | null
          room_link: string | null
          scheduled_at: string
          status: string
          student_id: string
          teacher_id: string
          title: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          duration?: number
          feedback_required?: boolean | null
          feedback_submitted?: boolean | null
          id?: string
          quality_rating?: number | null
          room_id?: string | null
          room_link?: string | null
          scheduled_at: string
          status?: string
          student_id: string
          teacher_id: string
          title: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          duration?: number
          feedback_required?: boolean | null
          feedback_submitted?: boolean | null
          id?: string
          quality_rating?: number | null
          room_id?: string | null
          room_link?: string | null
          scheduled_at?: string
          status?: string
          student_id?: string
          teacher_id?: string
          title?: string
        }
        Relationships: [
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
          status: string
          student_id: string
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
          status?: string
          student_id: string
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
          status?: string
          student_id?: string
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
          certifications: string[] | null
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
          salary_expectation: number | null
          skills: string[] | null
          status: string | null
          teaching_experience_years: number | null
          teaching_methodology: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          admin_notes?: string | null
          age_groups_experience?: string[] | null
          availability?: string | null
          certifications?: string[] | null
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
          salary_expectation?: number | null
          skills?: string[] | null
          status?: string | null
          teaching_experience_years?: number | null
          teaching_methodology?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          admin_notes?: string | null
          age_groups_experience?: string[] | null
          availability?: string | null
          certifications?: string[] | null
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
          salary_expectation?: number | null
          skills?: string[] | null
          status?: string | null
          teaching_experience_years?: number | null
          teaching_methodology?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
            isOneToOne: false
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
          created_at: string
          email: string
          full_name: string
          id: string
          payment_locked: boolean | null
          role: string
          teacher_level: string | null
          teacher_points: number | null
          updated_at: string
        }
        Insert: {
          avatar_id?: number | null
          created_at?: string
          email: string
          full_name: string
          id: string
          payment_locked?: boolean | null
          role: string
          teacher_level?: string | null
          teacher_points?: number | null
          updated_at?: string
        }
        Update: {
          avatar_id?: number | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          payment_locked?: boolean | null
          role?: string
          teacher_level?: string | null
          teacher_points?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_lesson: {
        Args: { room_uuid: string; user_uuid: string }
        Returns: boolean
      }
      check_achievements: {
        Args: { student_uuid: string; activity_data: Json }
        Returns: Json[]
      }
      generate_room_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_approved_teachers: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          user_id: string
          full_name: string
          bio: string
          video_url: string
          profile_image_url: string
          specializations: string[]
          accent: string
          languages_spoken: string[]
          years_experience: number
          rating: number
          total_reviews: number
          hourly_rate_dzd: number
          hourly_rate_eur: number
          timezone: string
        }[]
      }
      get_student_upcoming_lessons: {
        Args: { student_uuid: string }
        Returns: {
          id: string
          title: string
          scheduled_at: string
          duration: number
          room_id: string
          room_link: string
          status: string
          teacher_name: string
          teacher_id: string
        }[]
      }
      get_teacher_upcoming_lessons: {
        Args: { teacher_uuid: string }
        Returns: {
          id: string
          title: string
          scheduled_at: string
          duration: number
          room_id: string
          room_link: string
          status: string
          student_name: string
          student_id: string
        }[]
      }
      reset_monthly_class_usage: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_student_xp: {
        Args: { student_uuid: string; xp_to_add: number }
        Returns: Json
      }
      update_teacher_performance_metrics: {
        Args: { teacher_uuid: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
