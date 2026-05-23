import React, { useState } from 'react'
import '../styles/EffectsPanel.css'

export interface Effect {
  id: string
  name: string
  icon: string
  value: number
  min: number
  max: number
  unit: string
  description: string
}

interface EffectKnobProps {
  effect: Effect
  onChange: (value: number) => void
}

const EffectKnob: React.FC<EffectKnobProps> = ({ effect, onChange }) => {
  const [isDragging, setIsDragging] = useState(false)
  const percentage = ((effect.value - effect.min) / (effect.max - effect.min)) * 100
  const rotation = (percentage / 100) * 270 - 135

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const x = e.clientX - rect.left - centerX
    const y = e.clientY - rect.top - centerY

    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90

    if (angle < -135) angle += 360
    angle = Math.max(-135, Math.min(135, angle))

    const newPercentage = (angle + 135) / 270
    const newValue = effect.min + newPercentage * (effect.max - effect.min)

    onChange(parseFloat(newValue.toFixed(1)))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, effect])

  return (
    <div
      className="effect-knob-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="knob-wrapper">
        <div className="knob-background" />
        <div
          className="knob-indicator"
          style={{
            transform: `rotate(${rotation}deg)`,
          }}
        />
      </div>
      <div className="knob-value">{effect.value.toFixed(1)}{effect.unit}</div>
      <div className="knob-label">{effect.name}</div>
    </div>
  )
}

export interface EffectsPanelProps {
  onEffectChange?: (effectId: string, value: number) => void
}

const DEFAULT_EFFECTS: Effect[] = [
  {
    id: 'reverb',
    name: 'Reverb',
    icon: '🏛️',
    value: 0.3,
    min: 0,
    max: 1,
    unit: '',
    description: 'Room reverb size',
  },
  {
    id: 'delay',
    name: 'Delay',
    icon: '↔️',
    value: 0.2,
    min: 0,
    max: 1,
    unit: '',
    description: 'Delay amount',
  },
  {
    id: 'compression',
    name: 'Compression',
    icon: '🔗',
    value: 0.4,
    min: 0,
    max: 1,
    unit: '',
    description: 'Compression ratio',
  },
  {
    id: 'distortion',
    name: 'Distortion',
    icon: '🔥',
    value: 0,
    min: 0,
    max: 1,
    unit: '',
    description: 'Harmonic distortion',
  },
]

export const EffectsPanel: React.FC<EffectsPanelProps> = ({ onEffectChange }) => {
  const [effects, setEffects] = useState<Effect[]>(DEFAULT_EFFECTS)

  const handleEffectChange = (effectId: string, value: number) => {
    setEffects(prev =>
      prev.map(effect =>
        effect.id === effectId ? { ...effect, value } : effect
      )
    )
    if (onEffectChange) {
      onEffectChange(effectId, value)
    }
  }

  return (
    <div className="effects-panel-container">
      <h2 className="effects-title">Effects Chain</h2>

      <div className="effects-grid">
        {effects.map(effect => (
          <div key={effect.id} className="effect-section">
            <EffectKnob
              effect={effect}
              onChange={value => handleEffectChange(effect.id, value)}
            />
            <div className="effect-description">{effect.description}</div>
          </div>
        ))}
      </div>

      <div className="effects-footer">
        <div className="preset-buttons">
          <button className="preset-button">💾 Save Preset</button>
          <button className="preset-button">📂 Load Preset</button>
          <button className="preset-button">↺ Reset</button>
        </div>
      </div>
    </div>
  )
}

export default EffectsPanel
