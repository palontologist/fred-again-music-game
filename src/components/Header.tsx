import React from 'react'
import { usePlayer } from '../contexts/PlayerContext'
import '../styles/Header.css'

export const Header: React.FC = () => {
  const { level, xp, xpToNextLevel } = usePlayer()

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="app-title">
          <span className="title-icon">♪</span> Fred Again Music Game
        </h1>
      </div>

      <div className="header-center">
        <div className="player-stats">
          <div className="stat-item">
            <span className="stat-label">Level</span>
            <span className="stat-value">{level}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">XP Progress</span>
            <div className="xp-bar">
              <div
                className="xp-fill"
                style={{
                  width: `${((100 - xpToNextLevel) / 100) * 100}%`,
                }}
              />
              <span className="xp-text">
                {100 - xpToNextLevel} / 100
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="header-right">
        <button className="header-button">Settings</button>
        <button className="header-button">Help</button>
      </div>
    </header>
  )
}

export default Header
