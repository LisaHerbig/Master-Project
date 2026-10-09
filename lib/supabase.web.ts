// Demo mode (web only): no backend. The native app keeps using lib/supabase.ts.
import { resetDemo } from '@/lib/demo-store'

export const supabase = {
  auth: {
    // The logout button on the home screen resets the demo
    signOut: async () => {
      resetDemo()
      return { error: null }
    },
    signInWithPassword: async () => ({ error: { message: 'Login ist in der Demo deaktiviert.' } }),
    signUp: async () => ({ error: { message: 'Registrierung ist in der Demo deaktiviert.' } }),
  },
  functions: {
    invoke: async (_name: string, _options?: unknown) => ({
      data: null,
      error: { message: 'Der KI-Assistent ist in der Demo nicht live verbunden.' },
    }),
  },
} as any
