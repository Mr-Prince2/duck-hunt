import React from 'react';

export default function PauseScreen({ visible, onResume }) {
    if (!visible) return null;

    return (
        <div id="pause-screen" className="overlay" onClick={onResume}>
            <div className="pause-box" onClick={(e) => e.stopPropagation()}>
                <h2 className="pause-title">GAME PAUSED</h2>
                <p className="pause-subtitle">PRESS [ESC] OR CLICK BELOW TO RESUME</p>
                <div
                    className="start-prompt"
                    style={{ marginTop: '20px', marginBottom: 0 }}
                    onClick={onResume}
                    role="button"
                    tabIndex={0}
                >
                    RESUME HUNT
                </div>
            </div>
        </div>
    );
}
