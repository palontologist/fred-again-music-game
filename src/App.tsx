import { useState } from 'react'
import { PlayerProvider } from './contexts/PlayerContext'
import Header from './components/Header'
import StemBox from './components/StemBox'
import Mixer from './components/Mixer'
import Player from './components/Player'
import TutorialOverlay from './components/TutorialOverlay'
import SpectrumAnalyzer from './components/SpectrumAnalyzer'
import LevelMeters from './components/LevelMeters'
import SamplePad from './components/SamplePad'
import SongTemplates from './components/SongTemplates'
import './styles/index.css'
import './styles/App.css'
import './styles/Header.css'

export default function App() {
  const [isFirstTime] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  return (
    <PlayerProvider>
      <div className="app-container">
        <Header />

        <div className="main-content">
          <div className="control-panel">
            {/* Song Templates - Quick Start Section */}
            <SongTemplates onSelectTemplate={setSelectedTemplate} />

            {/* Sample Pad (MPC-style) */}
            <SamplePad onPadPress={(padId, velocity) => {
              console.log(`Pad ${padId} pressed with velocity ${velocity}`)
            }} />

            <div className="mixer-and-visualization">
              <Mixer />
              <div className="visualization-column">
                <LevelMeters />
                <SpectrumAnalyzer isPlaying={isPlaying} />
              </div>
            </div>

            <StemBox />
          </div>

          <div className="playback-panel">
            <Player 
              isPlaying={isPlaying}
              onPlayPause={setIsPlaying}
            />
          </div>
        </div>

        <TutorialOverlay isFirstTime={isFirstTime} />
      </div>
    </PlayerProvider>
  )
}

