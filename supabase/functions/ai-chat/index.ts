import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Message {
  role: 'user' | 'model'
  text: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verify Supabase auth — only logged-in users can call this
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders,
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders,
      })
    }

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY secret is not set')
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 500,
        headers: corsHeaders,
      })
    }

    const { message, history, bookTitle, seriesTitle }: {
      message: string
      history: Message[]
      bookTitle: string
      seriesTitle: string
    } = await req.json()

    const systemPrompt = `Du bist ein hilfreicher Assistent für die Novellenreihe "${seriesTitle}". Der Nutzer liest gerade "${bookTitle}". Beantworte alle Fragen auf Deutsch. Du kannst aktuelle Informationen aus dem Internet suchen. Halte deine Antworten präzise und freundlich.`

    const contents = [
      ...history.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ]

    const geminiBody = {
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents,
    }

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini error:', errorText)
      const userMessage = response.status === 503
        ? 'Der KI-Assistent ist gerade sehr gefragt. Bitte versuche es in einem Moment erneut.'
        : response.status === 429
        ? 'Zu viele Anfragen. Bitte warte kurz und versuche es erneut.'
        : 'Der KI-Assistent ist momentan nicht verfügbar. Bitte versuche es später erneut.'
      return new Response(JSON.stringify({ error: userMessage }), {
        status: 500,
        headers: corsHeaders,
      })
    }

    const data = await response.json()

    const parts = data.candidates?.[0]?.content?.parts ?? []
    const text = parts
      .filter((p: { text?: string }) => p.text)
      .map((p: { text: string }) => p.text)
      .join('') || 'Keine Antwort erhalten.'

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})
