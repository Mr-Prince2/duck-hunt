import React from 'react';

export default function DogSprite({ visible, hits }) {
    if (!visible) return null;

    const imgSrc = hits === 2 ? '/dog-duck2.png' : '/dog-duck1.png';
    const typeClass = hits === 2 ? 'double-duck' : 'single-duck';

    return (
        <img
            src={imgSrc}
            alt="Hunting Dog"
            className={`dog-sprite ${typeClass}`}
            draggable={false}
        />
    );
}
