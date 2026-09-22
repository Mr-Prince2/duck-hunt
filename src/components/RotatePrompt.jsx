import React, { useState, useEffect } from 'react';

export default function RotatePrompt() {
    const [isPortrait, setIsPortrait] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            const isMobileOrTablet = window.innerWidth <= 1024 || window.innerHeight <= 1024;
            const inPortrait = window.innerHeight > window.innerWidth;
            setIsPortrait(isMobileOrTablet && inPortrait);
            if (!inPortrait) {
                // When physically rotated to landscape, reset dismissed state so it prompts next time
                setDismissed(false);
            }
        };

        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);
        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    if (!isPortrait || dismissed) return null;

    const handleLockLandscape = async () => {
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                await document.documentElement.webkitRequestFullscreen();
            }

            if (screen.orientation && screen.orientation.lock) {
                await screen.orientation.lock('landscape');
            }
        } catch (err) {
            console.log('Orientation lock requested manual rotation:', err);
        }
    };

    return (
        <div className="rotate-prompt-overlay" role="dialog" aria-modal="true" aria-label="Rotate device prompt">
            <div className="rotate-box">
                <div className="rotate-device-icon" aria-hidden="true">
                    <span className="phone-icon">📱</span>
                    <span className="arrow-icon">➔</span>
                    <span className="landscape-icon">📲</span>
                </div>
                <h2 className="rotate-title">ROTATE TO LANDSCAPE</h2>
                <p className="rotate-desc">
                    DUCK HUNT is designed for arcade <strong>LANDSCAPE</strong> view. Turn your mobile or tablet sideways for the optimal hunting experience.
                </p>
                <div className="rotate-buttons">
                    <button
                        type="button"
                        className="rotate-btn-primary"
                        onClick={handleLockLandscape}
                    >
                        🔄 FULLSCREEN LANDSCAPE
                    </button>
                    <button
                        type="button"
                        className="rotate-btn-secondary"
                        onClick={() => setDismissed(true)}
                    >
                        PLAY IN PORTRAIT ANYWAY
                    </button>
                </div>
            </div>
        </div>
    );
}
