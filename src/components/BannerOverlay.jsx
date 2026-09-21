import React from 'react';

export default function BannerOverlay({ visible, text }) {
    if (!visible || !text) return null;

    return (
        <div id="banner-overlay" className="banner animate-banner-pop" aria-live="assertive">
            <span id="banner-text" className="banner-glitch-text" data-text={text}>
                {text}
            </span>
        </div>
    );
}
