import { DEMO_BOOK_ID, getUnlocked, unlock } from '@/lib/demo-store'
import { useCallback, useState } from 'react'

export type NfcScanResult =
  | { status: 'unlocked'; bookId: number }
  | { status: 'already_unlocked'; bookId: number }
  | { status: 'not_found'; uid: string }
  | { status: 'cancelled' }
  | { status: 'error'; message: string }

// Demo mode (web only): the scan is simulated and can only unlock "Das Fahrwasser".
export function useNfcScan() {
  const [isScanning, setIsScanning] = useState(false)

  const startScan = useCallback(async (): Promise<NfcScanResult> => {
    if (getUnlocked().has(DEMO_BOOK_ID)) return { status: 'already_unlocked', bookId: DEMO_BOOK_ID }

    setIsScanning(true)
    await new Promise((resolve) => setTimeout(resolve, 1600))
    setIsScanning(false)

    unlock(DEMO_BOOK_ID)
    return { status: 'unlocked', bookId: DEMO_BOOK_ID }
  }, [])

  return { isSupported: true, isScanning, startScan }
}
