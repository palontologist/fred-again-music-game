import React, { useState } from 'react'
import { usePlayer } from '../contexts/PlayerContext'
import ProgressiveDisclosure from './ProgressiveDisclosure'
import '../styles/SamplePad.css'

interface PadSample {
  id: string
  name: string
  color: string
  sound: 'kick' | 'snare' | 'hihat' | 'clap' | 'perc' | 'tom'
}

const DEFAULT_PADS: PadSample[] = [
  { id: 'pad1', name: 'Kick', color: 'var(--drums-color)', sound: 'kick' },
  { id: 'pad2', name: 'Snare', color: 'var(--primary)', sound: 'snare' },
  { id: 'pad3', name: 'Hi-Hat', color: 'var(--secondary)', sound: 'hihat' },
  { id: 'pad4', name: 'Clap', color: 'var(--accent)', sound: 'clap' },
  { id: 'pad5', name: 'Perc 1', color: 'var(--green)', sound: 'perc' },
  { id: 'pad6', name: 'Perc 2', color: 'var(--purple)', sound: 'perc' },
  { id: 'pad7', name: 'Tom 1', color: 'var(--accent-light)', sound: 'tom' },
  { id: 'pad8', name: 'Tom 2', color: 'var(--purple-light)', sound: 'tom' },
  { id: 'pad9', name: 'Open Hat', color: 'var(--secondary-light)', sound: 'hihat' },
  { id: 'pad10', name: 'Cymbal', color: 'var(--accent-light)', sound: 'perc' },
  { id: 'pad11', name: 'Ride', color: 'var(--green-light)', sound: 'perc' },
  { id: 'pad12', name: 'Cowbell', color: 'var(--accent)', sound: 'perc' },
  { id: 'pad13', name: 'Conga', color: 'var(--purple-light)', sound: 'tom' },
  { id: 'pad14', name: 'Bongo', color: 'var(--primary)', sound: 'tom' },
  { id: 'pad15', name: 'Timpani', color: 'var(--drums-color)', sound: 'kick' },
  { id: 'pad16', name: 'Sine', color: 'var(--secondary)', sound: 'clap' },
]

interface SamplePadProps {
  onPadPress?: (padId: string, velocity: number) => void
}

export const SamplePad: React.FC<SamplePadProps> = ({ onPadPress }) => {
  const { level } = usePlayer()
  const [activePads, setActivePads] = useState<Set<string>>(new Set())
  const [padAssignments, setPadAssignments] = useState<Record<string, string>>(
    DEFAULT_PADS.reduce((acc, pad) => {
      acc[pad.id] = pad.sound
      return acc
    }, {} as Record<string, string>)
  )

  const handlePadMouseDown = (padId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const y = event.clientY - rect.top
    const velocity = Math.max(0.3, 1 - y / rect.height)

    setActivePads(prev => new Set(prev).add(padId))
    if (onPadPress) {
      onPadPress(padId, velocity)
    }
  }

  const handlePadMouseUp = (padId: string) => {
    setActivePads(prev => {
      const next = new Set(prev)
      next.delete(padId)
      return next
    })
  }

  // Show different grid sizes based on level
  const gridCols = level >= 15 ? 4 : 4 // Always 4x4 for now, but can vary by level

  return (
    <ProgressiveDisclosure minMode="intermediate">
      <div className="sample-pad-container">
        <h2 className="sample-pad-title">Sample Pad (MPC Mode)</h2>

        <div className="sample-pad-grid" style={{
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        }}>
          {DEFAULT_PADS.slice(0, gridCols * 4).map(pad => (
            <button
              key={pad.id}
              className={`sample-pad-button ${activePads.has(pad.id) ? 'active' : ''}`}
              style={{
                '--pad-color': pad.color,
              } as React.CSSProperties}
              onMouseDown={e => handlePadMouseDown(pad.id, e)}
              onMouseUp={() => handlePadMouseUp(pad.id)}
              onMouseLeave={() => handlePadMouseUp(pad.id)}
              onTouchStart={e => {
                const touch = e.touches[0]
                const button = e.currentTarget
                const rect = button.getBoundingClientRect()
                const y = touch.clientY - rect.top
                const velocity = Math.max(0.3, 1 - y / rect.height)
                setActivePads(prev => new Set(prev).add(pad.id))
                if (onPadPress) {
                  onPadPress(pad.id, velocity)
                }
              }}
              onTouchEnd={() => handlePadMouseUp(pad.id)}
              title={`${pad.name} (${pad.sound})`}
            >
              <span className="pad-label">{pad.name}</span>
              <span className="pad-sound">{pad.sound}</span>
            </button>
          ))}
        </div>

        <div className="pad-info">
          <p>Click and drag pads to control velocity. Release to stop.</p>
        </div>
      </div>
    </ProgressiveDisclosure>
  )
}

export default SamplePad
