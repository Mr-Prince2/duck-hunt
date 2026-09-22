import React, { useEffect } from 'react';

export default function StartScreen({ visible, topScore, onStart }) {
    useEffect(() => {
        if (!visible) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                onStart();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [visible, onStart]);

    if (!visible) return null;

    const formattedTop = String(topScore).padStart(6, '0');

    return (
        <div
            id="start-screen"
            className="overlay start-screen-overlay"
            onClick={onStart}
            role="button"
            tabIndex={0}
            aria-label="Start Game Overlay"
        >
            <div className="start-box" onClick={(e) => e.stopPropagation()}>
                <h1 className="title">DUCK HUNT</h1>
                <p className="subtitle">RETRO ARCADE EDITION</p>
                <div
                    className="start-prompt"
                    onClick={onStart}
                    role="button"
                    tabIndex={0}
                    aria-label="Pull trigger and start game"
                >
                    CLICK TO PULL TRIGGER & START
                </div>
                <div className="top-score-display">
                    TOP SCORE: <span>{formattedTop}</span>
                </div>
            </div>
        </div>
    );
}
