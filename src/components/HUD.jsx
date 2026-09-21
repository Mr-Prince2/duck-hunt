import React from 'react';

export default function HUD({
    shotsLeft,
    roundHitTracker,
    roundDuckIndex,
    gameState,
    score,
    round,
    topScore
}) {
    const formattedScore = String(score).padStart(6, '0');
    const formattedTopScore = String(topScore).padStart(6, '0');

    return (
        <footer id="hud">
            {/* Ammo / Bullet Box with modern recoil ejection animation */}
            <div className="hud-section ammo-box">
                <div className="hud-label">SHOT</div>
                <div id="bullets-container">
                    {[0, 1, 2].map((idx) => {
                        const isUsed = idx >= shotsLeft;
                        return (
                            <span
                                key={idx}
                                className={`bullet ${isUsed ? 'used' : 'active'}`}
                                data-index={idx}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Hit Box / 10 Duck Indicators with Neon Pulse */}
            <div className="hud-section hit-box">
                <div id="duck-indicators">
                    {roundHitTracker.map((status, idx) => {
                        let statusClass = '';
                        if (status === 'hit') {
                            statusClass = 'hit';
                        } else if (status === 'missed') {
                            statusClass = 'missed';
                        } else if (idx === roundDuckIndex && gameState === 'PLAYING') {
                            statusClass = 'active';
                        }

                        return (
                            <span
                                key={idx}
                                className={`duck-indicator ${statusClass}`}
                                data-index={idx}
                            />
                        );
                    })}
                </div>
                <div className="hud-label">HIT</div>
            </div>

            {/* Score */}
            <div className="hud-section score-box">
                <div className="hud-label">SCORE</div>
                <div id="score" className="hud-digital-counter">{formattedScore}</div>
            </div>

            {/* Round */}
            <div className="hud-section round-box">
                <div className="hud-label">ROUND</div>
                <div id="round-display" className="hud-digital-counter">R={round}</div>
            </div>

            {/* Top Score */}
            <div className="hud-section top-score-box">
                <div className="hud-label">TOP SCORE</div>
                <div id="top-score" className="hud-digital-counter">{formattedTopScore}</div>
            </div>
        </footer>
    );
}
