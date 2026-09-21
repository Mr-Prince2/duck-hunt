import React from 'react';

export default function AudioControl({ isMuted, onToggleMute }) {
    return (
        <button
            type="button"
            className="retro-audio-btn"
            onClick={(e) => {
                e.stopPropagation();
                onToggleMute();
            }}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
            {isMuted ? '🔇 SOUND: OFF' : '🔊 SOUND: ON'}
        </button>
    );
}
