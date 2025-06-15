
import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Session } from '@supabase/supabase-js'

// Define User interface to match database schema
interface User {
  id: string
  email: string
  full_name: string
  role: 'student' | 'teacher' | 'parent' | 'admin'
  avatar_id?: number
  created_at: string
  updated_at: string
}

// Helper function to check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return true; // Always true since we're using the real Supabase client now
}

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isConfigured: boolean
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isConfigured, setIsConfigured] = useState(true)

  useEffect(() => {
    // Check if Supabase is configured
    const configured = isSupabaseConfigured()
    setIsConfigured(configured)

    if (!configured) {
      // Mock user from localStorage for demo purposes
      const userType = localStorage.getItem('userType')
      if (userType) {
        const mockUser: User = {
          id: '1',
          email: 'demo@example.com',
          full_name: localStorage.getItem(userType === 'admin' ? 'adminName' : userType === 'teacher' ? 'teacherName' : 'studentName') || 'Demo User',
          role: userType as 'student' | 'teacher' | 'parent' | 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        setUser(mockUser)
      }
      setLoading(false)
      return
    }

    // Get initial session only if configured
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes only if configured
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    if (!isSupabaseConfigured()) return

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      if (data) {
        setUser(data as User)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Create user profile with required fields
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email: data.user.email!,
            full_name: userData.full_name || 'User',
            role: userData.role || 'student'
          }])

        if (profileError) throw profileError
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      // Clear localStorage for demo mode
      localStorage.removeItem('userType')
      localStorage.removeItem('adminName')
      localStorage.removeItem('teacherName')
      localStorage.removeItem('studentName')
      setUser(null)
      return { error: null }
    }

    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setSession(null)
    }
    return { error }
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isConfigured,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
