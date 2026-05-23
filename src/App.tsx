import { useState } from 'react'
import { PlayerProvider } from './contexts/PlayerContext'
import Header from './components/Header'
import StemBox from './components/StemBox'
import Mixer from './components/Mixer'
import Player from './components/Player'
import TutorialOverlay from './components/TutorialOverlay'
import './styles/index.css'
import './styles/App.css'
import './styles/Header.css'

export default function App() {
  const [isFirstTime] = useState(true)

  return (
    <PlayerProvider>
      <div className="app-container">
        <Header />

        <div className="main-content">
          <div className="control-panel">
            <StemBox />
            <Mixer />
          </div>

          <div className="playback-panel">
            <Player />
          </div>
        </div>

        <TutorialOverlay isFirstTime={isFirstTime} />
      </div>
    </PlayerProvider>
  )
}

