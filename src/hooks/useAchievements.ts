import { invoke } from '@tauri-apps/api/tauri'
import { useState, useEffect } from 'react'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlocked_at?: number
  xp_reward: number
}

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true)
        const response = await invoke<any>('list_achievements')
        setAchievements(response.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch achievements')
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [])

  const unlockAchievement = async (achievementId: string) => {
    try {
      const response = await invoke<any>('unlock_achievement', { achievement_id: achievementId })
      if (response.data) {
        setAchievements(prev =>
          prev.map(a => (a.id === achievementId ? { ...a, unlocked: true, unlocked_at: response.data.unlocked_at } : a))
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlock achievement')
    }
  }

  return { achievements, loading, error, unlockAchievement }
}
