import React from 'react';
import DuckSprite from './DuckSprite';
import DogSprite from './DogSprite';

export default function GameBoard({ ducks, dog, onShootDuck, onShootBackground }) {
    const handleBackgroundClick = (e) => {
        onShootBackground(e.clientX, e.clientY);
    };

    return (
        <main
            id="game-board"
            onClick={handleBackgroundClick}
            aria-label="Duck Hunt Playfield"
        >
            {ducks.map((duck) => (
                <DuckSprite
                    key={duck.id}
                    duck={duck}
                    onShoot={onShootDuck}
                />
            ))}

            <DogSprite
                visible={dog.visible}
                hits={dog.hits}
            />
        </main>
    );
}
