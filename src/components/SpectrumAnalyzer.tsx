import { useEffect, useRef } from 'react'
import '../styles/SpectrumAnalyzer.css'

interface SpectrumAnalyzerProps {
  isPlaying?: boolean
  audioContext?: AudioContext
}

export const SpectrumAnalyzer: React.FC<SpectrumAnalyzerProps> = ({
  isPlaying = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Initialize analyser (in a real app, connect to audio graph)
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount)
    } catch (e) {
      console.warn('AudioContext not available:', e)
    }

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current) {
        animationRef.current = requestAnimationFrame(draw)
        return
      }

      analyserRef.current.getByteFrequencyData(dataArrayRef.current)

      // Clear canvas with semi-transparent background for trails effect
      ctx.fillStyle = 'rgba(10, 10, 11, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw spectrum bars
      const barWidth = canvas.width / dataArrayRef.current.length
      let x = 0

      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const barHeight = (dataArrayRef.current[i] / 255) * canvas.height

        // Color gradient based on frequency and height
        const hue = (i / dataArrayRef.current.length) * 360
        const saturation = Math.min(100, (barHeight / canvas.height) * 150)
        const lightness = 50 + (barHeight / canvas.height) * 20

        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
        ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`
        ctx.shadowBlur = 10

        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight)
        x += barWidth
      }

      // Draw waveform line on top
      ctx.strokeStyle = 'rgba(255, 0, 110, 0.3)'
      ctx.lineWidth = 2
      ctx.beginPath()

      const step = Math.floor(dataArrayRef.current.length / canvas.width)
      let posX = 0

      for (let i = 0; i < dataArrayRef.current.length; i += step) {
        const value = dataArrayRef.current[i] / 255
        const posY = canvas.height - value * canvas.height

        if (i === 0) {
          ctx.moveTo(posX, posY)
        } else {
          ctx.lineTo(posX, posY)
        }
        posX += 1
      }

      ctx.stroke()

      animationRef.current = requestAnimationFrame(draw)
    }

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(draw)
    } else {
      // Draw idle state
      ctx.fillStyle = 'rgba(10, 10, 11, 0.6)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = 'rgba(131, 56, 236, 0.2)'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Play to see spectrum', canvas.width / 2, canvas.height / 2)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  return (
    <div className="spectrum-analyzer-container">
      <h3 className="spectrum-title">Spectrum Analyzer</h3>
      <canvas
        ref={canvasRef}
        className="spectrum-canvas"
        width={800}
        height={200}
      />
    </div>
  )
}

export default SpectrumAnalyzer
