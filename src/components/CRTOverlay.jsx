import React from 'react';

export default function CRTOverlay({ enabled, onToggle }) {
    return (
        <>
            {/* Retro CRT Toggle Button in Top Bar */}
            <button
                type="button"
                className={`retro-crt-btn ${enabled ? 'active' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                }}
                title="Toggle Vintage CRT Arcade Monitor Filter"
                aria-label="Toggle CRT Filter"
            >
                {enabled ? '📺 CRT: ON' : '📺 CRT: OFF'}
            </button>

            {/* Vintage CRT Scanlines, Vignette & Phosphor Overlay */}
            {enabled && (
                <div className="crt-overlay" pointer-events="none" aria-hidden="true">
                    <div className="crt-scanlines" />
                    <div className="crt-vignette" />
                    <div className="crt-phosphor" />
                </div>
            )}
        </>
    );
}
