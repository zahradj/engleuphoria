
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
  id: string
  email: string
  full_name: string
  role: 'student' | 'teacher' | 'parent'
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
