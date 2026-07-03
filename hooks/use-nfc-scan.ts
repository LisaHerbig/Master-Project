import { useAuthContext } from '@/hooks/use-auth-context'
import { supabase } from '@/lib/supabase'
import { useCallback, useEffect, useState } from 'react'
import NfcManager, { NfcTech } from 'react-native-nfc-manager'

export type NfcScanResult =
  | { status: 'unlocked'; bookId: number }
  | { status: 'already_unlocked'; bookId: number }
  | { status: 'not_found'; uid: string }
  | { status: 'cancelled' }
  | { status: 'error'; message: string }

function tagIdToString(id: string | number[] | null | undefined): string | null {
  if (!id) return null
  if (typeof id === 'string') return id
  return Array.from(id)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(':')
}

export function useNfcScan() {
  const { claims } = useAuthContext()
  const [isSupported, setIsSupported] = useState(false)
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    NfcManager.isSupported().then((supported) => {
      setIsSupported(supported)
      if (supported) NfcManager.start()
    })
    return () => {
      NfcManager.cancelTechnologyRequest().catch(() => {})
    }
  }, [])

  const startScan = useCallback(async (): Promise<NfcScanResult> => {
    if (!claims?.sub) return { status: 'error', message: 'Nicht eingeloggt' }

    setIsScanning(true)
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef)
      const tag = await NfcManager.getTag()
      const uid = tagIdToString(tag?.id)

      if (!uid) return { status: 'error', message: 'Tag konnte nicht gelesen werden.' }

      const { data: nfcTag } = await supabase
        .from('nfc_tags')
        .select('book_id')
        .eq('tag_uid', uid)
        .single()

      if (!nfcTag) return { status: 'not_found', uid }

      const { data: existing } = await supabase
        .from('user_books')
        .select('book_id')
        .eq('book_id', nfcTag.book_id)
        .single()

      if (existing) return { status: 'already_unlocked', bookId: nfcTag.book_id }

      const { error } = await supabase.from('user_books').insert({
        user_id: claims.sub,
        book_id: nfcTag.book_id,
        unlocked_at: new Date().toISOString(),
      })

      if (error) return { status: 'error', message: 'Buch konnte nicht freigeschaltet werden.' }

      return { status: 'unlocked', bookId: nfcTag.book_id }
    } catch (e: any) {
      const msg: string = e?.message ?? ''
      if (msg.includes('cancel') || msg.includes('Cancel') || msg.includes('userCancel')) {
        return { status: 'cancelled' }
      }
      return { status: 'error', message: 'Fehler beim Scannen. Bitte versuche es erneut.' }
    } finally {
      setIsScanning(false)
      NfcManager.cancelTechnologyRequest().catch(() => {})
    }
  }, [claims?.sub])

  return { isSupported, isScanning, startScan }
}
