import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from './database.types'

let realtimeClient: SupabaseClient<Database> | null = null

export function createRealtimeClient(accessToken: string): SupabaseClient<Database> {
  if (realtimeClient) {
    return realtimeClient
  }

  realtimeClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      realtime: {
        params: {
          token: accessToken
        }
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    }
  )

  return realtimeClient
}
