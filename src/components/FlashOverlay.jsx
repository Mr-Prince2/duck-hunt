import React from 'react';

export default function FlashOverlay({ isFlashing }) {
    return <div id="flash-overlay" className={isFlashing ? 'flash' : ''} />;
}
