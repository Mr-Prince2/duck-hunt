import React from 'react';

export default function DogSprite({ visible, hits }) {
    if (!visible) return null;

    const imgSrc = hits === 2 ? '/dog-duck2.png' : '/dog-duck1.png';
    const width = hits === 2 ? '224px' : '172px';
    const height = '152px';

    return (
        <img
            src={imgSrc}
            alt="Hunting Dog"
            className="dog-sprite"
            style={{ width, height }}
            draggable={false}
        />
    );
}
