import { AuthContext } from '@/hooks/use-auth-context'
import { supabase } from '@/lib/supabase'
import { PropsWithChildren, useEffect, useState } from 'react'

export default function AuthProvider({ children }: PropsWithChildren) {
  const [claims, setClaims] = useState<Record<string, any> | undefined | null>(undefined)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setClaims({ ...session.user, sub: session.user.id })
      } else {
        setClaims(null)
        setProfile(null)
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!claims?.sub) return

    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const { data } = await supabase.from('profiles').select('*').eq('id', claims.sub).single()
        setProfile(data ?? null)
      } catch {
        setProfile(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [claims?.sub])

  return (
    <AuthContext.Provider
      value={{
        claims,
        isLoading,
        profile,
        isLoggedIn: claims != undefined,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
