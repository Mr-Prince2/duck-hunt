import React from 'react';
import { DUCK_WIDTH, DUCK_HEIGHT } from '../hooks/useDuckHunt';

export default function DuckSprite({ duck, onShoot }) {
    const isLeft = duck.facing === 'left';
    const imgSrc = isLeft ? '/duck-left.gif' : '/duck-right.gif';
    const isShot = duck.state === 'SHOT';

    const handlePointerDown = (e) => {
        e.stopPropagation();
        if (e.pointerType === 'touch') {
            e.preventDefault();
        }
        if (duck.state === 'FLYING') {
            onShoot(duck.id, e.clientX, e.clientY);
        }
    };

    const dWidth = duck.width || DUCK_WIDTH;
    const dHeight = duck.height || DUCK_HEIGHT;

    return (
        <img
            src={imgSrc}
            alt="Flying Duck"
            className={`duck-sprite ${isShot ? 'shot' : ''}`}
            style={{
                width: `${dWidth}px`,
                height: `${dHeight}px`,
                left: `${duck.x}px`,
                top: `${duck.y}px`
            }}
            draggable={false}
            onPointerDown={handlePointerDown}
        />
    );
}
