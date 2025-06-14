
import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from localStorage or use defaults
const getSupabaseConfig = () => {
  if (typeof window !== 'undefined') {
    const storedUrl = localStorage.getItem('supabase_url')
    const storedKey = localStorage.getItem('supabase_key')
    
    if (storedUrl && storedKey) {
      return { url: storedUrl, key: storedKey }
    }
  }
  
  // Return dummy but valid URL format to prevent constructor errors
  return {
    url: 'https://placeholder.supabase.co',
    key: 'placeholder_key'
  }
}

const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseConfig()

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  if (typeof window !== 'undefined') {
    const storedUrl = localStorage.getItem('supabase_url')
    const storedKey = localStorage.getItem('supabase_key')
    return !!(storedUrl && storedKey && storedUrl !== 'https://placeholder.supabase.co')
  }
  return false
}

// Database Types
export interface User {
  id: string
  email: string
  full_name: string
  role: 'student' | 'teacher' | 'parent' | 'admin'
  avatar_id?: number
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  teacher_id: string
  student_id: string
  title: string
  scheduled_at: string
  duration: number
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  cost: number
  created_at: string
}

export interface Homework {
  id: string
  lesson_id: string
  student_id: string
  teacher_id: string
  title: string
  description: string
  due_date: string
  status: 'pending' | 'submitted' | 'graded'
  grade?: number
  feedback?: string
  created_at: string
}

export interface Payment {
  id: string
  lesson_id: string
  student_id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  payment_method: string
  created_at: string
}

// Admin specific types
export interface AdminUser {
  id: string
  user_id: string
  permissions: string[]
  access_level: 'super_admin' | 'admin' | 'moderator'
  created_at: string
}

export interface UserAssignment {
  id: string
  teacher_id: string
  student_id: string
  assigned_by: string
  status: 'active' | 'inactive'
  created_at: string
}

export interface ContentModeration {
  id: string
  content_type: 'lesson_material' | 'homework' | 'message'
  content_id: string
  uploaded_by: string
  status: 'pending' | 'approved' | 'rejected'
  reviewed_by?: string
  review_notes?: string
  created_at: string
}

export interface UsageAnalytics {
  id: string
  metric_type: string
  metric_value: number
  user_id?: string
  date: string
  metadata?: any
}
