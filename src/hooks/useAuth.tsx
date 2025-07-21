
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
    
    if (!userType) return null

    const email = mockEmail || `demo-${userType}@example.com`
    const isAdminEmail = email === 'f.zahra.djaanine@engleuphoria.com'
    const finalUserType = isAdminEmail ? 'admin' : userType
    
    const nameKey = finalUserType === 'admin' ? 'adminName' : 
                   finalUserType === 'teacher' ? 'teacherName' : 'studentName'
    const fullName = localStorage.getItem(nameKey) || email.split('@')[0]

    return {
      id: isAdminEmail ? 'admin-f-zahra' : `demo-${userType}-${Date.now()}`,
      email,
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
      console.log('🔄 Demo user refreshed:', demoUser)
      setUser(demoUser)
    }
  }

  useEffect(() => {
    let mounted = true
    
    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing auth, isConfigured:', isConfigured)
        
        if (!isConfigured) {
          // Demo mode: load user from localStorage
          console.log('📱 Demo mode: Loading user from localStorage')
          const demoUser = createDemoUser()
          if (mounted) {
            setUser(demoUser)
            setLoading(false)
          }
          
          // Listen for custom auth events
          const handleAuthChange = () => {
            if (mounted) {
              console.log('🔄 Auth state changed in demo mode')
              const updatedDemoUser = createDemoUser()
              setUser(updatedDemoUser)
            }
          }
          
          window.addEventListener('authStateChanged', handleAuthChange)
          
          return () => {
            mounted = false
            window.removeEventListener('authStateChanged', handleAuthChange)
          }
        }

        // Supabase mode: handle real authentication
        console.log('🔐 Supabase mode: Initializing real auth')
        
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return
            
            console.log('🔄 Auth state changed:', event, !!session)
            
            setSession(session)
            
            if (session?.user) {
              try {
                // Try to get user data from the database first
                const { data: userData, error } = await supabase
                  .from('users')
                  .select('*')
                  .eq('id', session.user.id)
                  .single()
                
                if (!error && userData) {
                  // Use database user data
                  console.log('✅ Found user in database:', userData)
                  setUser(userData)
                } else {
                  // Fallback to auth metadata
                  console.log('⚠️ User not found in database, using auth metadata')
                  const fallbackUser: User = {
                    id: session.user.id,
                    email: session.user.email || '',
                    full_name: session.user.user_metadata?.full_name || session.user.email || '',
                    role: session.user.user_metadata?.role || 'student',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  }
                  setUser(fallbackUser)
                }
              } catch (error) {
                console.error('❌ Error fetching user data:', error)
                // Fallback to auth metadata on error
                const fallbackUser: User = {
                  id: session.user.id,
                  email: session.user.email || '',
                  full_name: session.user.user_metadata?.full_name || session.user.email || '',
                  role: session.user.user_metadata?.role || 'student',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
                setUser(fallbackUser)
              }
            } else {
              setUser(null)
            }
            
            setLoading(false)
          }
        )

        // Then get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        
        if (mounted) {
          setSession(initialSession)
          
          if (initialSession?.user) {
            console.log('👤 Found existing session')
            try {
              // Try to get user data from the database
              const { data: userData, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', initialSession.user.id)
                .single()
              
              if (!error && userData) {
                console.log('✅ Found user in database on init:', userData)
                setUser(userData)
              } else {
                console.log('⚠️ User not found in database on init, using auth metadata')
                const fallbackUser: User = {
                  id: initialSession.user.id,
                  email: initialSession.user.email || '',
                  full_name: initialSession.user.user_metadata?.full_name || initialSession.user.email || '',
                  role: initialSession.user.user_metadata?.role || 'student',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
                setUser(fallbackUser)
              }
            } catch (error) {
              console.error('❌ Error fetching user data on init:', error)
              const fallbackUser: User = {
                id: initialSession.user.id,
                email: initialSession.user.email || '',
                full_name: initialSession.user.user_metadata?.full_name || initialSession.user.email || '',
                role: initialSession.user.user_metadata?.role || 'student',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
              setUser(fallbackUser)
            }
          } else {
            console.log('❌ No existing session found')
            setUser(null)
          }
          
          setLoading(false)
        }

        return () => {
          mounted = false
          subscription.unsubscribe()
        }
        
      } catch (error) {
        console.error('❌ Auth initialization error:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    const cleanup = initializeAuth()
    
    // Timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('⚠️ Auth initialization timeout, forcing loading to false')
        setLoading(false)
      }
    }, 3000) // Reduced from 5000 to 3000

    return () => {
      mounted = false
      clearTimeout(timeout)
      if (cleanup instanceof Promise) {
        cleanup.then(cleanupFn => cleanupFn?.())
      }
    }
  }, [isConfigured, loading]) // Added loading dependency

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
    try {
      console.log('🚪 Signing out user')
      
      if (!isConfigured) {
        // Clear demo mode data
        localStorage.removeItem('userType')
        localStorage.removeItem('mockUserEmail')
        localStorage.removeItem('adminName')
        localStorage.removeItem('teacherName')
        localStorage.removeItem('studentName')
        setUser(null)
        setSession(null)
        
        // Dispatch auth change event
        window.dispatchEvent(new CustomEvent('authStateChanged'))
        
        // Force redirect to home page
        window.location.href = '/'
        
        return { error: null }
      }

      // Clear user state immediately
      setUser(null)
      setSession(null)
      
      // Supabase sign out
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Logout error:', error)
      } else {
        console.log('✅ Successfully logged out')
      }
      
      // Force redirect to home page
      window.location.href = '/'
      
      return { error }
    } catch (error) {
      console.error('❌ Sign out error:', error)
      // Force redirect even on error
      window.location.href = '/'
      return { error }
    }
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
