
import { useState, useEffect, createContext, useContext } from 'react'
import { supabase, User, isSupabaseConfigured } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

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
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    // Check if Supabase is configured
    const configured = isSupabaseConfigured()
    setIsConfigured(configured)

    if (!configured) {
      // Mock user from localStorage for demo purposes
      const userType = localStorage.getItem('userType')
      const mockEmail = localStorage.getItem('mockUserEmail')
      
      if (userType || mockEmail) {
        // Check for admin email
        const isAdminEmail = mockEmail === 'f.zahra.djaanine@engleuphoria.com'
        const finalUserType = isAdminEmail ? 'admin' : (userType || 'student')
        
        const mockUser: User = {
          id: isAdminEmail ? 'admin-f-zahra' : '1',
          email: mockEmail || 'demo@example.com',
          full_name: isAdminEmail ? 'Fatima Zahra Djaanine' : (localStorage.getItem(finalUserType === 'admin' ? 'adminName' : finalUserType === 'teacher' ? 'teacherName' : 'studentName') || 'Demo User'),
          role: finalUserType as 'student' | 'teacher' | 'parent' | 'admin',
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
      (event, session) => {
        setSession(session)
        if (session?.user) {
          // Use setTimeout to prevent recursion issues
          setTimeout(() => {
            fetchUserProfile(session.user.id)
          }, 0)
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
      setUser(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }

    try {
      const redirectUrl = `${window.location.origin}/email-confirmation`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: userData.full_name,
            role: userData.role
          }
        }
      })

      if (error) throw error

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
