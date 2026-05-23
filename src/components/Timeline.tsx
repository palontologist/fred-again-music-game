import React, { useState } from 'react'
import '../styles/Timeline.css'

interface TimelineClip {
  id: string
  stemName: string
  startBar: number
  duration: number
  color: string
}

interface TimelineProps {
  totalBars?: number
  tempo?: number
  onClipMove?: (clipId: string, startBar: number) => void
}

const DEFAULT_CLIPS: TimelineClip[] = [
  {
    id: 'clip1',
    stemName: 'Drums',
    startBar: 0,
    duration: 8,
    color: 'var(--primary)',
  },
  {
    id: 'clip2',
    stemName: 'Bass',
    startBar: 4,
    duration: 8,
    color: 'var(--green)',
  },
  {
    id: 'clip3',
    stemName: 'Synth',
    startBar: 0,
    duration: 16,
    color: 'var(--purple)',
  },
]

export const Timeline: React.FC<TimelineProps> = ({
  totalBars = 32,
  tempo = 120,
  onClipMove,
}) => {
  const [clips, setClips] = useState<TimelineClip[]>(DEFAULT_CLIPS)
  const [selectedClip, setSelectedClip] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [zoom, setZoom] = useState(1)
  const pixelsPerBar = 60 * zoom

  const handleClipMouseDown = (clip: TimelineClip, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedClip(clip.id)
    setIsDragging(true)
    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset(e.clientX - rect.left)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedClip) return

    const container = e.currentTarget as HTMLElement
    const containerRect = container.getBoundingClientRect()
    const newX = e.clientX - containerRect.left - dragOffset

    const newStartBar = Math.max(
      0,
      Math.min(
        totalBars - 1,
        Math.round(newX / pixelsPerBar)
      )
    )

    setClips(prev =>
      prev.map(clip =>
        clip.id === selectedClip
          ? { ...clip, startBar: newStartBar }
          : clip
      )
    )

    if (onClipMove) {
      onClipMove(selectedClip, newStartBar)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h2 className="timeline-title">Timeline / Sequencer</h2>
        <div className="timeline-controls">
          <label>
            Zoom:
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={zoom}
              onChange={e => setZoom(parseFloat(e.target.value))}
              className="zoom-slider"
            />
          </label>
          <span className="zoom-value">{(zoom * 100).toFixed(0)}%</span>
        </div>
      </div>

      <div className="timeline-markers">
        <div className="markers-container">
          {Array.from({ length: totalBars }, (_, i) => (
            <div
              key={i}
              className="bar-marker"
              style={{ width: pixelsPerBar }}
            >
              <div className="bar-number">{i + 1}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="timeline-tracks"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {clips.map(clip => (
          <div key={clip.id} className="track-row">
            <div className="track-label">{clip.stemName}</div>
            <div
              className="track-clips"
              style={{
                width: totalBars * pixelsPerBar,
              }}
            >
              <div
                className={`clip ${selectedClip === clip.id ? 'selected' : ''}`}
                style={{
                  left: clip.startBar * pixelsPerBar,
                  width: clip.duration * pixelsPerBar,
                  backgroundColor: clip.color,
                }}
                onMouseDown={e => handleClipMouseDown(clip, e)}
              >
                <span className="clip-name">{clip.stemName}</span>
                <span className="clip-duration">{clip.duration}b</span>
                <div className="clip-resize-handle" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="timeline-info">
        <div className="info-item">
          <span>Tempo:</span>
          <strong>{tempo} BPM</strong>
        </div>
        <div className="info-item">
          <span>Total Bars:</span>
          <strong>{totalBars}</strong>
        </div>
        <div className="info-item">
          <span>Duration:</span>
          <strong>{((totalBars * 4 * 60) / tempo).toFixed(1)}s</strong>
        </div>
      </div>
    </div>
  )
}

export default Timeline
