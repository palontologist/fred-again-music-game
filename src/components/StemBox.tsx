import React, { useState } from 'react'
import { usePlayer } from '../contexts/PlayerContext'
import ProgressiveDisclosure from './ProgressiveDisclosure'
import '../styles/StemBox.css'

const STEM_CATEGORIES = {
  drums: {
    label: 'Drums',
    color: '#ff6b6b',
    icon: '🥁',
    stems: ['Kick Loop', 'Snare Tight', 'Hi-Hat Closed'],
  },
  bass: {
    label: 'Bass',
    color: '#4c6ef5',
    icon: '🎸',
    stems: ['Deep 80Hz', 'Synth Bright', 'Sub Bass'],
  },
  synths: {
    label: 'Synths',
    color: '#69db7c',
    icon: '🎹',
    stems: ['Pad Warm', 'Lead Bright', 'Strings Lush'],
  },
  vocals: {
    label: 'Vocals',
    color: '#ff922b',
    icon: '🎤',
    stems: ['Lead Vocal', 'Backing Harmony'],
  },
  effects: {
    label: 'Effects',
    color: '#d0bfff',
    icon: '✨',
    stems: ['Riser Buildup', 'Sweep Down'],
  },
}

interface StemBoxProps {
  onStemSelect?: (stem: string) => void
}

export const StemBox: React.FC<StemBoxProps> = ({ onStemSelect }) => {
  const { mode } = usePlayer()
  const [selectedStem, setSelectedStem] = useState<string | null>(null)

  // Determine which categories to show based on mode
  const visibleCategories = {
    beginner: ['drums', 'bass', 'synths'],
    intermediate: ['drums', 'bass', 'synths', 'vocals'],
    advanced: ['drums', 'bass', 'synths', 'vocals', 'effects'],
  }[mode]

  const handleStemClick = (stem: string, category: string) => {
    setSelectedStem(stem)
    if (onStemSelect) {
      onStemSelect(`${category}/${stem}`)
    }
  }

  return (
    <div className="stem-box-container">
      <h2 className="stem-box-title">Instruments</h2>

      <div className="stem-categories">
        {Object.entries(STEM_CATEGORIES).map(([key, category]) => (
          <ProgressiveDisclosure
            key={key}
            minMode={
              key === 'vocals'
                ? 'intermediate'
                : key === 'effects'
                  ? 'advanced'
                  : 'beginner'
            }
          >
            <div className="stem-category">
              <h3 className="category-header">
                <span className="category-icon">{category.icon}</span>
                {category.label}
              </h3>

              <div className="stem-grid">
                {category.stems.map(stem => (
                  <button
                    key={stem}
                    className={`stem-button ${selectedStem === stem ? 'active' : ''}`}
                    style={
                      {
                        '--stem-color': category.color,
                      } as React.CSSProperties
                    }
                    onClick={() => handleStemClick(stem, key)}
                    title={stem}
                  >
                    <span className="stem-name">{stem}</span>
                  </button>
                ))}
              </div>
            </div>
          </ProgressiveDisclosure>
        ))}
      </div>
    </div>
  )
}

export default StemBox
