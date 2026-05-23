import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import Header from './components/Header'
import StemBox from './components/StemBox'
import Mixer from './components/Mixer'
import Player from './components/Player'
import './App.css'

export default function App() {
  const [stems, setStems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('delilah')

  useEffect(() => {
    const loadStems = async () => {
      try {
        setLoading(true)
        const stemList = await invoke('list_stems', { template: selectedTemplate })
        setStems(stemList as any[])
      } catch (error) {
        console.error('Failed to load stems:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStems()
  }, [selectedTemplate])

  return (
    <div className="app-container">
      <Header template={selectedTemplate} onTemplateChange={setSelectedTemplate} />
      
      <div className="main-content">
        <div className="control-panel">
          <StemBox 
            stems={stems} 
            loading={loading}
            onStemSelect={(stem) => console.log('Selected:', stem)}
          />
          
          <Mixer stems={stems} />
        </div>
        
        <div className="playback-panel">
          <Player 
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
          />
        </div>
      </div>
    </div>
  )
}
