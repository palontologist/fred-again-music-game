import { useState } from 'react'

export interface TutorialStep {
  id: string
  title: string
  description: string
  target?: string
  action: 'highlight' | 'click' | 'drag'
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Fred Again Music Game',
    description: "Let's create your first beat! Start by selecting a drum stem.",
    action: 'highlight',
  },
  {
    id: 'add_drums',
    title: 'Add a Drum Stem',
    description: 'Click on a drum stem to add it to your mix',
    target: '.stem-box',
    action: 'click',
  },
  {
    id: 'add_bass',
    title: 'Add Bass',
    description: 'Now add some bass to give your beat more movement',
    action: 'click',
  },
  {
    id: 'add_synth',
    title: 'Make It Musical',
    description: 'Add a synth or pad to create harmony',
    action: 'click',
  },
  {
    id: 'adjust_volume',
    title: 'Polish Your Mix',
    description: 'Adjust the volume of each stem to find the perfect balance',
    target: '.mixer',
    action: 'drag',
  },
  {
    id: 'play',
    title: 'Play Your Creation',
    description: 'Click play to hear your song!',
    target: '.play-button',
    action: 'click',
  },
]

export const useTutorial = (isFirstTime: boolean = true) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [showTutorial, setShowTutorial] = useState(isFirstTime)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const getCurrentStep = (): TutorialStep | null => {
    return showTutorial && currentStep < TUTORIAL_STEPS.length ? TUTORIAL_STEPS[currentStep] : null
  }

  const nextStep = () => {
    const current = getCurrentStep()
    if (current) {
      setCompletedSteps(prev => [...prev, current.id])
    }

    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowTutorial(false)
    }
  }

  const skipTutorial = () => {
    setShowTutorial(false)
  }

  return {
    currentStep: getCurrentStep(),
    showTutorial,
    completedSteps,
    nextStep,
    skipTutorial,
    allSteps: TUTORIAL_STEPS,
  }
}
