import React from 'react';

export default function ParticleLayer({ effects }) {
    const { sparks = [], scores = [], feathers = [], missRings = [] } = effects;

    return (
        <div className="particle-layer" aria-hidden="true">
            {/* Muzzle Sparks */}
            {sparks.map((spark) => (
                <span
                    key={spark.id}
                    className="spark-particle"
                    style={{
                        left: `${spark.x}px`,
                        top: `${spark.y}px`,
                        backgroundColor: spark.color,
                        '--dx': `${Math.cos(spark.angle) * spark.dist}px`,
                        '--dy': `${Math.sin(spark.angle) * spark.dist}px`,
                        width: `${spark.size}px`,
                        height: `${spark.size}px`
                    }}
                />
            ))}

            {/* Miss Click Shockwaves */}
            {missRings.map((ring) => (
                <span
                    key={ring.id}
                    className="miss-ring"
                    style={{
                        left: `${ring.x}px`,
                        top: `${ring.y}px`
                    }}
                />
            ))}

            {/* Floating Score Popups (+500) */}
            {scores.map((item) => (
                <div
                    key={item.id}
                    className="floating-score"
                    style={{
                        left: `${item.x}px`,
                        top: `${item.y}px`
                    }}
                >
                    {item.text}
                </div>
            ))}

            {/* Drifting Feathers */}
            {feathers.map((f) => (
                <span
                    key={f.id}
                    className="feather-particle"
                    style={{
                        left: `${f.x}px`,
                        top: `${f.y}px`,
                        backgroundColor: f.color,
                        '--drift-x': `${f.driftX}px`,
                        '--rot': `${f.rot}deg`
                    }}
                />
            ))}
        </div>
    );
}
