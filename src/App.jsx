import React from 'react';
import { useDuckHunt } from './hooks/useDuckHunt';
import StartScreen from './components/StartScreen';
import PauseScreen from './components/PauseScreen';
import BannerOverlay from './components/BannerOverlay';
import FlashOverlay from './components/FlashOverlay';
import GameBoard from './components/GameBoard';
import HUD from './components/HUD';
import AudioControl from './components/AudioControl';
import CRTOverlay from './components/CRTOverlay';
import ParticleLayer from './components/ParticleLayer';
import RotatePrompt from './components/RotatePrompt';
import FullscreenControl from './components/FullscreenControl';

export default function App() {
    const {
        gameState,
        score,
        topScore,
        round,
        shotsLeft,
        roundDuckIndex,
        roundHitTracker,
        ducks,
        banner,
        flash,
        dog,
        isMuted,
        crtEnabled,
        screenShake,
        effects,
        toggleCrt,
        toggleMute,
        startGame,
        shootDuck,
        shootBackground,
        togglePause
    } = useDuckHunt();

    return (
        <div className={`duck-hunt-app ${screenShake ? 'screen-shake' : ''}`}>
            {/* Mobile Portrait Orientation Prompt */}
            <RotatePrompt />

            {/* Vintage CRT Scanline & Phosphor Overlay */}
            <CRTOverlay enabled={crtEnabled} />

            {/* White flash on shot */}
            <FlashOverlay isFlashing={flash} />

            {/* Top Bar Controls */}
            <header className="top-controls-bar">
                <FullscreenControl />
                <button
                    type="button"
                    className={`retro-crt-btn ${crtEnabled ? 'active' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleCrt();
                    }}
                    title="Toggle Vintage CRT Arcade Monitor Filter"
                    aria-label="Toggle CRT Filter"
                >
                    {crtEnabled ? '📺 CRT: ON' : '📺 CRT: OFF'}
                </button>
                <AudioControl isMuted={isMuted} onToggleMute={toggleMute} />
            </header>

            {/* Start Screen Overlay */}
            <StartScreen
                visible={gameState === 'START_SCREEN'}
                topScore={topScore}
                onStart={startGame}
            />

            {/* Pause Screen Overlay */}
            <PauseScreen
                visible={gameState === 'PAUSED'}
                onResume={togglePause}
            />

            {/* Round & Fly Away Banner Overlay */}
            <BannerOverlay
                visible={banner.visible}
                text={banner.text}
            />

            {/* Main Interactive Game Board */}
            <GameBoard
                ducks={ducks}
                dog={dog}
                onShootDuck={shootDuck}
                onShootBackground={shootBackground}
            />

            {/* Dynamic Visual Particle Layer (Sparks, Feathers, Floating Scores) */}
            <ParticleLayer effects={effects} />

            {/* NES Retro HUD */}
            <HUD
                shotsLeft={shotsLeft}
                roundHitTracker={roundHitTracker}
                roundDuckIndex={roundDuckIndex}
                gameState={gameState}
                score={score}
                round={round}
                topScore={topScore}
            />
        </div>
    );
}
