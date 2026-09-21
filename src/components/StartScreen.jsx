import React from 'react';

export default function StartScreen({ visible, topScore, onStart }) {
    if (!visible) return null;

    const formattedTop = String(topScore).padStart(6, '0');

    return (
        <div id="start-screen" className="overlay">
            <div className="start-box">
                <h1 className="title">DUCK HUNT</h1>
                <p className="subtitle">RETRO ARCADE EDITION</p>
                <div
                    className="start-prompt"
                    onClick={onStart}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') onStart();
                    }}
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
