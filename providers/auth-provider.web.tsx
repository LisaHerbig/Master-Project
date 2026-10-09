import { AuthContext } from '@/hooks/use-auth-context'
import { isGuest, subscribe } from '@/lib/demo-store'
import { PropsWithChildren, useEffect, useState } from 'react'

// Demo mode (web only): guest access instead of a Supabase account.
export default function AuthProvider({ children }: PropsWithChildren) {
  const [guest, setGuest] = useState(isGuest)

  useEffect(() => subscribe(() => setGuest(isGuest())), [])

  return (
    <AuthContext.Provider
      value={{
        claims: guest ? { sub: 'demo-guest' } : null,
        profile: guest ? { full_name: 'Gast' } : null,
        isLoading: false,
        isLoggedIn: guest,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
