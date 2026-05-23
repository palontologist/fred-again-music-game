import React from 'react'
import { usePlayer } from '../contexts/PlayerContext'
import ProgressiveDisclosure from './ProgressiveDisclosure'
import '../styles/Mixer.css'

interface MixerChannel {
  id: string
  name: string
  volume: number
  pan: number
  muted: boolean
}

interface MixerProps {
  onChannelChange?: (channel: MixerChannel) => void
}

export const Mixer: React.FC<MixerProps> = ({ onChannelChange }) => {
  const { mode } = usePlayer()
  const [channels, setChannels] = React.useState<MixerChannel[]>([
    { id: 'drums', name: 'Drums', volume: 0.8, pan: 0, muted: false },
    { id: 'bass', name: 'Bass', volume: 0.7, pan: 0, muted: false },
    { id: 'synth', name: 'Synth', volume: 0.6, pan: 0, muted: false },
    { id: 'vocal', name: 'Vocal', volume: 0.5, pan: 0, muted: false },
  ])

  const handleVolumeChange = (id: string, volume: number) => {
    const updated = channels.map(c =>
      c.id === id ? { ...c, volume } : c
    )
    setChannels(updated)
    const channel = updated.find(c => c.id === id)
    if (channel && onChannelChange) {
      onChannelChange(channel)
    }
  }

  const handlePanChange = (id: string, pan: number) => {
    const updated = channels.map(c =>
      c.id === id ? { ...c, pan } : c
    )
    setChannels(updated)
    const channel = updated.find(c => c.id === id)
    if (channel && onChannelChange) {
      onChannelChange(channel)
    }
  }

  const handleMuteToggle = (id: string) => {
    const updated = channels.map(c =>
      c.id === id ? { ...c, muted: !c.muted } : c
    )
    setChannels(updated)
    const channel = updated.find(c => c.id === id)
    if (channel && onChannelChange) {
      onChannelChange(channel)
    }
  }

  return (
    <div className="mixer-container">
      <h2 className="mixer-title">Mixer</h2>

      <div className="mixer-channels">
        {channels.map(channel => (
          <div key={channel.id} className="mixer-channel">
            <div className="channel-header">
              <h4 className="channel-name">{channel.name}</h4>
              <button
                className={`mute-button ${channel.muted ? 'muted' : ''}`}
                onClick={() => handleMuteToggle(channel.id)}
                title={channel.muted ? 'Unmute' : 'Mute'}
              >
                {channel.muted ? '🔇' : '🔊'}
              </button>
            </div>

            {/* Volume Control */}
            <div className="control-group">
              <label>Volume</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={channel.volume}
                onChange={e => handleVolumeChange(channel.id, parseFloat(e.target.value))}
                className="volume-slider"
              />
              <span className="value-display">{(channel.volume * 100).toFixed(0)}%</span>
            </div>

            {/* Pan Control - Only in intermediate/advanced */}
            <ProgressiveDisclosure minMode="intermediate">
              <div className="control-group">
                <label>Pan</label>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={channel.pan}
                  onChange={e => handlePanChange(channel.id, parseFloat(e.target.value))}
                  className="pan-slider"
                />
                <span className="value-display">
                  {channel.pan < -0.1 ? 'L' : channel.pan > 0.1 ? 'R' : 'C'}
                </span>
              </div>
            </ProgressiveDisclosure>

            {/* Effects - Only in advanced */}
            <ProgressiveDisclosure minMode="advanced">
              <div className="control-group">
                <label>Reverb</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  defaultValue="0.2"
                  className="effect-slider"
                />
              </div>
            </ProgressiveDisclosure>
          </div>
        ))}
      </div>

      {/* Master Channel */}
      <div className="mixer-master">
        <h3>Master</h3>
        <div className="control-group">
          <label>Master Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue="0.8"
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  )
}

export default Mixer
