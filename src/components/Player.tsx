import React, { useState } from 'react'
import '../styles/Player.css'

interface PlayerProps {
  isPlaying?: boolean
  onPlayPause?: (isPlaying: boolean) => void
  tempo?: number
  onTempoChange?: (tempo: number) => void
}

export const Player: React.FC<PlayerProps> = ({
  isPlaying: initialPlaying = false,
  onPlayPause,
  tempo: initialTempo = 120,
  onTempoChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(initialPlaying)
  const [tempo, setTempo] = useState(initialTempo)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(120)

  const handlePlayPause = () => {
    const newState = !isPlaying
    setIsPlaying(newState)
    if (onPlayPause) {
      onPlayPause(newState)
    }
  }

  const handleTempoChange = (newTempo: number) => {
    setTempo(newTempo)
    if (onTempoChange) {
      onTempoChange(newTempo)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="player-container">
      <div className="playback-controls">
        <button
          className={`play-button ${isPlaying ? 'playing' : ''}`}
          onClick={handlePlayPause}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div className="timeline-display">
          <span className="time-current">{formatTime(currentTime)}</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${(currentTime / duration) * 100}%`,
              }}
            />
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={e => setCurrentTime(parseFloat(e.target.value))}
              className="progress-slider"
            />
          </div>
          <span className="time-duration">{formatTime(duration)}</span>
        </div>

        <div className="tempo-control">
          <label htmlFor="tempo-slider">Tempo</label>
          <div className="tempo-display">{tempo} BPM</div>
          <input
            id="tempo-slider"
            type="range"
            min="80"
            max="140"
            step="1"
            value={tempo}
            onChange={e => handleTempoChange(parseInt(e.target.value))}
            className="tempo-slider"
          />
        </div>
      </div>

      <div className="additional-controls">
        <button className="control-button" title="Loop">
          🔁
        </button>
        <button className="control-button" title="Export">
          ⬇️
        </button>
        <button className="control-button" title="Settings">
          ⚙️
        </button>
      </div>
    </div>
  )
}

export default Player
