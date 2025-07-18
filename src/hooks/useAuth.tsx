
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
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isConfigured] = useState(isSupabaseConfigured())

  // Function to create demo user from localStorage
  const createDemoUser = (): User | null => {
    const userType = localStorage.getItem('userType')
    const mockEmail = localStorage.getItem('mockUserEmail')
    
    if (!userType || !mockEmail) return null

    const isAdminEmail = mockEmail === 'f.zahra.djaanine@engleuphoria.com'
    const finalUserType = isAdminEmail ? 'admin' : userType
    
    const nameKey = finalUserType === 'admin' ? 'adminName' : 
                   finalUserType === 'teacher' ? 'teacherName' : 'studentName'
    const fullName = localStorage.getItem(nameKey) || mockEmail.split('@')[0]

    return {
      id: isAdminEmail ? 'admin-f-zahra' : `demo-${userType}-${Date.now()}`,
      email: mockEmail,
      full_name: fullName,
      role: finalUserType as 'student' | 'teacher' | 'parent' | 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  // Function to refresh user state
  const refreshUser = () => {
    if (!isConfigured) {
      const demoUser = createDemoUser()
      setUser(demoUser)
    }
  }

  useEffect(() => {
    if (!isConfigured) {
      // Demo mode: load user from localStorage
      refreshUser()
      setLoading(false)
      
      // Listen for custom auth events
      const handleAuthChange = () => refreshUser()
      window.addEventListener('authStateChanged', handleAuthChange)
      
      return () => {
        window.removeEventListener('authStateChanged', handleAuthChange)
      }
    }

    // Supabase mode: handle real authentication
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        }
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setLoading(true)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [isConfigured])

  const fetchUserProfile = async (userId: string) => {
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
      // Create fallback user from session
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || session.user.email || '',
          role: session.user.user_metadata?.role || 'student',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    if (!isConfigured) {
      return { data: null, error: new Error('Supabase not configured') }
    }

    try {
      const redirectUrl = `${window.location.origin}/`
      
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

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
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
    if (!isConfigured) {
      // Clear demo mode data
      localStorage.removeItem('userType')
      localStorage.removeItem('mockUserEmail')
      localStorage.removeItem('adminName')
      localStorage.removeItem('teacherName')
      localStorage.removeItem('studentName')
      setUser(null)
      
      // Dispatch auth change event
      window.dispatchEvent(new CustomEvent('authStateChanged'))
      return { error: null }
    }

    const { error } = await supabase.auth.signOut()
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
      signOut,
      refreshUser
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
