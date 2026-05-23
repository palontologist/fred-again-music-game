import React, { createContext, useContext, useState, ReactNode } from 'react'

export type PlayerMode = 'beginner' | 'intermediate' | 'advanced'

interface PlayerContextType {
  mode: PlayerMode
  level: number
  xp: number
  xpToNextLevel: number
  setMode: (mode: PlayerMode) => void
  addXP: (amount: number) => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [level, setLevel] = useState(1)
  const [xp, setXp] = useState(0)
  const [xpToNextLevel, setXpToNextLevel] = useState(100)
  const [mode, setModeState] = useState<PlayerMode>('beginner')

  const setMode = (newMode: PlayerMode) => {
    setModeState(newMode)
  }

  const addXP = (amount: number) => {
    const newXp = xp + amount
    const newLevel = Math.floor(newXp / 100) + 1
    setLevel(newLevel)
    setXp(newXp % 100)
    setXpToNextLevel(100 - (newXp % 100))

    // Update mode based on level
    if (newLevel >= 15) {
      setModeState('advanced')
    } else if (newLevel >= 5) {
      setModeState('intermediate')
    } else {
      setModeState('beginner')
    }
  }

  return (
    <PlayerContext.Provider value={{ mode, level, xp, xpToNextLevel, setMode, addXP }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider')
  }
  return context
}
