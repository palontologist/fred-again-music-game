import React from 'react'
import { usePlayer, PlayerMode } from '../contexts/PlayerContext'

interface ProgressiveDisclosureProps {
  minLevel?: number
  minMode?: PlayerMode
  children: React.ReactNode
}

export const ProgressiveDisclosure: React.FC<ProgressiveDisclosureProps> = ({
  minLevel = 1,
  minMode = 'beginner',
  children,
}) => {
  const { level, mode } = usePlayer()

  // Mode hierarchy: beginner < intermediate < advanced
  const modeHierarchy: Record<PlayerMode, number> = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
  }

  const shouldShow = level >= minLevel && modeHierarchy[mode] >= modeHierarchy[minMode]

  return shouldShow ? <>{children}</> : null
}

export default ProgressiveDisclosure
