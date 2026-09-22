import React from 'react';

export default function CRTOverlay({ enabled }) {
    if (!enabled) return null;

    return (
        <div className="crt-overlay" style={{ pointerEvents: 'none' }} aria-hidden="true">
            <div className="crt-scanlines" />
            <div className="crt-vignette" />
            <div className="crt-phosphor" />
        </div>
    );
}
