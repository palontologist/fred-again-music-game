import React from 'react'
import { useTutorial } from '../hooks/useTutorial'
import '../styles/Tutorial.css'

interface TutorialOverlayProps {
  isFirstTime?: boolean
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ isFirstTime = true }) => {
  const { currentStep, showTutorial, nextStep, skipTutorial } = useTutorial(isFirstTime)

  if (!showTutorial || !currentStep) {
    return null
  }

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-backdrop" onClick={skipTutorial} />
      <div className="tutorial-card">
        <div className="tutorial-header">
          <h2>{currentStep.title}</h2>
          <button className="tutorial-close" onClick={skipTutorial}>
            ×
          </button>
        </div>
        <p className="tutorial-description">{currentStep.description}</p>
        <div className="tutorial-actions">
          <button className="tutorial-skip" onClick={skipTutorial}>
            Skip Tutorial
          </button>
          <button className="tutorial-next" onClick={nextStep}>
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

export default TutorialOverlay
