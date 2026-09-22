import React, { useState, useEffect } from 'react';

export default function FullscreenControl() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        if (typeof document === 'undefined') return;
        setIsSupported(Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled));

        const handleFsChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement));
        };

        document.addEventListener('fullscreenchange', handleFsChange);
        document.addEventListener('webkitfullscreenchange', handleFsChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFsChange);
            document.removeEventListener('webkitfullscreenchange', handleFsChange);
        };
    }, []);

    if (!isSupported) return null;

    const toggleFullscreen = async (e) => {
        e.stopPropagation();
        try {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    await document.documentElement.webkitRequestFullscreen();
                }
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('landscape').catch(() => {});
                }
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    await document.webkitExitFullscreen();
                }
            }
        } catch (err) {
            console.log('Fullscreen toggle failed:', err);
        }
    };

    return (
        <button
            type="button"
            className={`retro-fs-btn ${isFullscreen ? 'active' : ''}`}
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
            {isFullscreen ? '⛶ EXIT' : '⛶ FULL'}
        </button>
    );
}
