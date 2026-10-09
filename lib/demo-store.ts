// Demo mode (web only): guest session, onboarding and unlocks live in the browser instead of Supabase.
// The native app never imports this file.

export const DEMO_BOOK_ID = 1

const UNLOCKED_KEY = 'demoUnlockedBooks'
const GUEST_KEY = 'demoGuest'
const ONBOARDING_KEY = 'demoHasSeenOnboarding'

const listeners = new Set<() => void>()

function getItem(key: string): string | null {
  try {
    return globalThis.localStorage?.getItem(key) ?? null
  } catch {
    return null
  }
}

function setItem(key: string, value: string) {
  try {
    globalThis.localStorage?.setItem(key, value)
  } catch {}
}

function removeItem(key: string) {
  try {
    globalThis.localStorage?.removeItem(key)
  } catch {}
}

function notify() {
  listeners.forEach((l) => l())
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

// Unlocks
export function getUnlocked(): Set<number> {
  try {
    return new Set(JSON.parse(getItem(UNLOCKED_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

export function unlock(bookId: number) {
  setItem(UNLOCKED_KEY, JSON.stringify(Array.from(new Set([...getUnlocked(), bookId]))))
  notify()
}

// Guest session
export function isGuest() {
  return getItem(GUEST_KEY) === 'true'
}

export function signInAsGuest() {
  setItem(GUEST_KEY, 'true')
  notify()
}

// Onboarding
export function hasSeenOnboarding() {
  return getItem(ONBOARDING_KEY) === 'true'
}

export function completeOnboarding() {
  setItem(ONBOARDING_KEY, 'true')
  notify()
}

// Back to the very first screen, so the demo can be shown again
export function resetDemo() {
  removeItem(UNLOCKED_KEY)
  removeItem(GUEST_KEY)
  removeItem(ONBOARDING_KEY)
  notify()
}

// The landing page (same origin, outside the app) resets via localStorage; pick that up here.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', notify)
}
