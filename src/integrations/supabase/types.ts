export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
      generate_room_id: {
        Args: Record<PropertyKey, never>
        Returns: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
