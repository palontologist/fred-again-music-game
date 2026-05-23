import { invoke } from '@tauri-apps/api/tauri'
import { useState, useEffect } from 'react'

export interface PlayerProgress {
  id: string
  level: number
  xp: number
  xp_to_next_level: number
  songs_created: number
  stems_learned: number
  effects_mastered: number
  total_playtime_minutes: number
  created_at: number
  last_played: number
}

export const usePlayerProgress = () => {
  const [progress, setProgress] = useState<PlayerProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true)
        const response = await invoke<any>('get_player_progress')
        setProgress(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch progress')
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [])

  const updateXP = async (xpEarned: number) => {
    try {
      const response = await invoke<any>('update_player_xp', { xp_earned: xpEarned })
      if (response.data) {
        setProgress(response.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update XP')
    }
  }

  return { progress, loading, error, updateXP }
}
