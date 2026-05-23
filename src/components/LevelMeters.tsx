import React from 'react'
import '../styles/LevelMeters.css'

interface LevelMeterProps {
  level: number
  peak: number
  label: string
  color?: string
}

const LevelMeter: React.FC<LevelMeterProps> = ({
  level,
  peak,
  label,
  color = 'var(--primary)',
}) => {
  // Convert to percentage
  const levelPercent = Math.min(100, level * 100)
  const peakPercent = Math.min(100, peak * 100)

  // Determine color based on level
  let meterColor = 'var(--green)'
  if (levelPercent > 80) {
    meterColor = 'var(--accent-light)'
  }
  if (levelPercent > 95) {
    meterColor = 'var(--primary)'
  }

  return (
    <div className="level-meter">
      <div className="meter-label">{label}</div>
      <div className="meter-bar-container">
        <div
          className="meter-bar"
          style={{
            width: `${levelPercent}%`,
            backgroundColor: meterColor,
          }}
        />
        <div
          className="meter-peak"
          style={{
            left: `${peakPercent}%`,
          }}
        />
      </div>
      <div className="meter-value">
        {(level * 100).toFixed(1)}%
      </div>
    </div>
  )
}

interface LevelMetersProps {
  channels?: Array<{
    name: string
    level: number
    peak: number
  }>
  masterLevel?: number
  masterPeak?: number
}

export const LevelMeters: React.FC<LevelMetersProps> = ({
  channels = [
    { name: 'Drums', level: 0.7, peak: 0.85 },
    { name: 'Bass', level: 0.6, peak: 0.75 },
    { name: 'Synth', level: 0.5, peak: 0.65 },
  ],
  masterLevel = 0.65,
  masterPeak = 0.8,
}) => {
  return (
    <div className="level-meters-container">
      <h3 className="meters-title">Level Meters</h3>

      <div className="meters-list">
        {channels.map(channel => (
          <LevelMeter
            key={channel.name}
            label={channel.name}
            level={channel.level}
            peak={channel.peak}
          />
        ))}
      </div>

      <div className="meter-separator" />

      <div className="master-meter">
        <LevelMeter
          label="Master"
          level={masterLevel}
          peak={masterPeak}
          color="var(--accent-light)"
        />
      </div>

      {/* Clipping indicator */}
      {masterLevel > 0.95 && (
        <div className="clipping-warning">
          ⚠️ Clipping detected!
        </div>
      )}
    </div>
  )
}

export default LevelMeters
