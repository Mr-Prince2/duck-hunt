import React from 'react';
import { DUCK_WIDTH, DUCK_HEIGHT } from '../hooks/useDuckHunt';

export default function DuckSprite({ duck, onShoot }) {
    const isLeft = duck.facing === 'left';
    const imgSrc = isLeft ? '/duck-left.gif' : '/duck-right.gif';
    const isShot = duck.state === 'SHOT';

    const handleClick = (e) => {
        e.stopPropagation();
        if (duck.state === 'FLYING') {
            onShoot(duck.id, e.clientX, e.clientY);
        }
    };

    return (
        <img
            src={imgSrc}
            alt="Flying Duck"
            className={`duck-sprite ${isShot ? 'shot' : ''}`}
            style={{
                width: `${DUCK_WIDTH}px`,
                height: `${DUCK_HEIGHT}px`,
                left: `${duck.x}px`,
                top: `${duck.y}px`
            }}
            draggable={false}
            onClick={handleClick}
        />
    );
}
