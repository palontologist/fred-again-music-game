import React, { useState } from 'react'
import '../styles/SongTemplates.css'

interface Template {
  id: string
  name: string
  artist: string
  description: string
  preview: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  stems: {
    drums: number
    bass: number
    synths: number
    vocals: number
    effects: number
  }
}

const TEMPLATES: Template[] = [
  {
    id: 'delilah',
    name: 'Delilah',
    artist: 'Fred again',
    description: 'Classic house track with deep bass and warm synths',
    preview: '♪ Deep house vibes',
    difficulty: 'beginner',
    stems: {
      drums: 1,
      bass: 1,
      synths: 2,
      vocals: 1,
      effects: 0,
    },
  },
  {
    id: 'camino',
    name: 'Camino',
    artist: 'Fred again',
    description: 'Uplifting dance track with bright melodies',
    preview: '♪ Dance energy',
    difficulty: 'intermediate',
    stems: {
      drums: 2,
      bass: 1,
      synths: 2,
      vocals: 0,
      effects: 1,
    },
  },
  {
    id: 'chasing_the_wind',
    name: 'Chasing The Wind',
    artist: 'Fred again',
    description: 'Atmospheric ambient production',
    preview: '♪ Atmospheric',
    difficulty: 'intermediate',
    stems: {
      drums: 0,
      bass: 1,
      synths: 3,
      vocals: 0,
      effects: 2,
    },
  },
]

interface SongTemplatesProps {
  onSelectTemplate?: (templateId: string) => void
}

export const SongTemplates: React.FC<SongTemplatesProps> = ({ onSelectTemplate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    if (onSelectTemplate) {
      onSelectTemplate(templateId)
    }
  }

  return (
    <div className="song-templates-container">
      <div className="templates-header">
        <h2>Song Templates</h2>
        <p className="templates-subtitle">Start with a proven foundation</p>
      </div>

      <div className="templates-grid">
        {TEMPLATES.map(template => (
          <div
            key={template.id}
            className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
          >
            <div className="template-header">
              <h3>{template.name}</h3>
              <span className={`difficulty-badge difficulty-${template.difficulty}`}>
                {template.difficulty}
              </span>
            </div>

            <p className="template-artist">{template.artist}</p>
            <p className="template-description">{template.description}</p>

            <div className="template-preview">
              <span className="preview-icon">🎵</span>
              {template.preview}
            </div>

            <div className="template-stems">
              <div className="stems-row">
                {template.stems.drums > 0 && (
                  <span className="stem-badge drums">
                    🥁 {template.stems.drums}
                  </span>
                )}
                {template.stems.bass > 0 && (
                  <span className="stem-badge bass">
                    🎸 {template.stems.bass}
                  </span>
                )}
                {template.stems.synths > 0 && (
                  <span className="stem-badge synths">
                    🎹 {template.stems.synths}
                  </span>
                )}
              </div>
              <div className="stems-row">
                {template.stems.vocals > 0 && (
                  <span className="stem-badge vocals">
                    🎤 {template.stems.vocals}
                  </span>
                )}
                {template.stems.effects > 0 && (
                  <span className="stem-badge effects">
                    ✨ {template.stems.effects}
                  </span>
                )}
              </div>
            </div>

            <button
              className="template-button"
              onClick={() => handleSelectTemplate(template.id)}
            >
              {selectedTemplate === template.id ? '✓ Selected' : 'Use Template'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SongTemplates
