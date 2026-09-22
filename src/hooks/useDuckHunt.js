import { useState, useEffect, useRef, useCallback } from 'react';
import audioMgr from '../utils/audioManager';

export const DUCK_WIDTH = 96;
export const DUCK_HEIGHT = 93;
export const DUCKS_PER_ROUND = 10;
export const PASSING_HITS_REQUIRED = 6;
const FLYAWAY_SPEED = -10;
const WAVE_DURATION = 7000;

export function useDuckHunt() {
    const [gameState, setGameState] = useState('START_SCREEN'); // START_SCREEN, WAVE_START, PLAYING, WAVE_CLEAR, DOG_ANIMATION, ROUND_CLEAR, GAME_OVER, PAUSED
    const [score, setScore] = useState(0);
    const [topScore, setTopScore] = useState(() => {
        return parseInt(localStorage.getItem('duckhunt_top_score') || '0', 10);
    });
    const [round, setRound] = useState(1);
    const [shotsLeft, setShotsLeft] = useState(3);
    const [roundDuckIndex, setRoundDuckIndex] = useState(0);
    const [roundHits, setRoundHits] = useState(0);
    const [roundHitTracker, setRoundHitTracker] = useState(() => Array(DUCKS_PER_ROUND).fill(null));

    const [ducks, setDucks] = useState([]);
    const [banner, setBanner] = useState({ visible: false, text: '' });
    const [flash, setFlash] = useState(false);
    const [dog, setDog] = useState({ visible: false, hits: 0 });
    const [isMuted, setIsMuted] = useState(false);

    // Vintage & Modern Retro FX States
    const [crtEnabled, setCrtEnabled] = useState(() => {
        return localStorage.getItem('duckhunt_crt') !== 'false';
    });
    const [screenShake, setScreenShake] = useState(false);
    const [effects, setEffects] = useState({
        sparks: [],
        scores: [],
        feathers: [],
        missRings: []
    });

    // Refs for state accessible in loops and async timeouts
    const gameStateRef = useRef(gameState);
    gameStateRef.current = gameState;

    const roundRef = useRef(round);
    roundRef.current = round;

    const scoreRef = useRef(score);
    scoreRef.current = score;

    const topScoreRef = useRef(topScore);
    topScoreRef.current = topScore;

    const shotsLeftRef = useRef(shotsLeft);
    shotsLeftRef.current = shotsLeft;

    const roundDuckIndexRef = useRef(roundDuckIndex);
    roundDuckIndexRef.current = roundDuckIndex;

    const roundHitsRef = useRef(roundHits);
    roundHitsRef.current = roundHits;

    const ducksRef = useRef(ducks);
    ducksRef.current = ducks;

    const waveTimerRef = useRef(null);
    const waveStartTimeRef = useRef(0);
    const waveRemainingTimeRef = useRef(WAVE_DURATION);
    const bannerTimerRef = useRef(null);
    const flashTimerRef = useRef(null);
    const shakeTimerRef = useRef(null);
    const animFrameRef = useRef(null);

    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1024,
        height: typeof window !== 'undefined' ? Math.max(300, window.innerHeight - 90) : 600
    });

    // Window resize handler
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: Math.max(300, window.innerHeight - 90)
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Toggle CRT filter
    const toggleCrt = useCallback(() => {
        setCrtEnabled((prev) => {
            const next = !prev;
            localStorage.setItem('duckhunt_crt', String(next));
            return next;
        });
    }, []);

    // Trigger Screen Shake (Recoil)
    const triggerScreenShake = useCallback(() => {
        setScreenShake(true);
        if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
        shakeTimerRef.current = setTimeout(() => {
            setScreenShake(false);
        }, 150);
    }, []);

    // Trigger Lightgun Flash
    const triggerLightgunFlash = useCallback(() => {
        setFlash(true);
        if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
        flashTimerRef.current = setTimeout(() => {
            setFlash(false);
        }, 80);
    }, []);

    // Show banner announcement
    const showBanner = useCallback((text, durationMs = 2000, callback = null) => {
        if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
        setBanner({ visible: true, text });

        if (durationMs > 0) {
            bannerTimerRef.current = setTimeout(() => {
                setBanner({ visible: false, text: '' });
                if (callback) callback();
            }, durationMs);
        }
    }, []);

    // Toggle mute
    const toggleMute = useCallback(() => {
        setIsMuted((prev) => {
            const next = !prev;
            audioMgr.setMuted(next);
            return next;
        });
    }, []);

    // Helper: Spawn Muzzle Sparks
    const spawnSparks = useCallback((x, y, count = 8) => {
        const colors = ['#fff', '#ffcc00', '#ff3300', '#00ffcc'];
        const newSparks = [];
        const baseId = Date.now();

        for (let i = 0; i < count; i++) {
            newSparks.push({
                id: `${baseId}-spark-${i}`,
                x,
                y,
                angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5),
                dist: 30 + Math.random() * 45,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 3 + Math.random() * 4
            });
        }

        setEffects((prev) => ({
            ...prev,
            sparks: [...prev.sparks, ...newSparks]
        }));

        setTimeout(() => {
            setEffects((prev) => ({
                ...prev,
                sparks: prev.sparks.filter((s) => !newSparks.some((ns) => ns.id === s.id))
            }));
        }, 350);
    }, []);

    // Trigger Fly Away
    const triggerFlyAway = useCallback(() => {
        if (waveTimerRef.current) clearTimeout(waveTimerRef.current);
        setGameState('WAVE_CLEAR');
        showBanner('FLY AWAY', 2000);

        // Update ducks to escaping
        setDucks((prevDucks) =>
            prevDucks.map((d) => {
                if (d.state === 'FLYING') {
                    return { ...d, state: 'ESCAPING', vx: 0, vy: FLYAWAY_SPEED };
                }
                return d;
            })
        );

        // Mark missed on hit tracker
        setRoundHitTracker((prevTracker) => {
            const updated = [...prevTracker];
            ducksRef.current.forEach((duck) => {
                if (duck.state === 'FLYING') {
                    updated[duck.indexInRound] = 'missed';
                }
            });
            return updated;
        });

        audioMgr.play('quack');

        setTimeout(() => {
            onWaveComplete();
        }, 2200);
    }, [showBanner]);

    // Complete current wave & show dog
    const onWaveComplete = useCallback(() => {
        const currentDucks = ducksRef.current;
        const waveHits = currentDucks.filter((d) => d.state === 'SHOT').length;
        const count = currentDucks.length;

        // Clear ducks
        setDucks([]);

        const nextDuckIndex = roundDuckIndexRef.current + count;
        setRoundDuckIndex(nextDuckIndex);

        // Trigger dog animation
        setGameState('DOG_ANIMATION');
        setDog({ visible: true, hits: waveHits });

        if (waveHits > 0) {
            audioMgr.play('score');
        } else {
            audioMgr.play('quack');
        }

        setTimeout(() => {
            setDog({ visible: false, hits: 0 });
            if (nextDuckIndex >= DUCKS_PER_ROUND) {
                endRound();
            } else {
                startWave(nextDuckIndex);
            }
        }, 2500);
    }, []);

    // End round
    const endRound = useCallback(() => {
        if (roundHitsRef.current >= PASSING_HITS_REQUIRED) {
            showBanner('ROUND CLEAR!', 2500, () => {
                setRound((r) => {
                    const nextRound = r + 1;
                    startRound(nextRound);
                    return nextRound;
                });
            });
        } else {
            showBanner('GAME OVER', 3500, () => {
                setGameState('START_SCREEN');
            });
        }
    }, [showBanner]);

    // Start wave
    const startWave = useCallback((currentRoundIndex = roundDuckIndexRef.current) => {
        if (currentRoundIndex >= DUCKS_PER_ROUND) {
            endRound();
            return;
        }

        setGameState('WAVE_START');
        setShotsLeft(3);

        const remainingDucksInRound = DUCKS_PER_ROUND - currentRoundIndex;
        const duckCount = remainingDucksInRound >= 2 && Math.random() > 0.5 ? 2 : 1;

        const newDucks = [];
        audioMgr.play('quack');

        const currentW = window.innerWidth;
        const currentH = Math.max(300, window.innerHeight - 90);

        for (let i = 0; i < duckCount; i++) {
            const isLeft = Math.random() > 0.5;
            const startX = Math.floor(Math.random() * Math.max(1, currentW - DUCK_WIDTH));
            const startY = currentH - DUCK_HEIGHT - 50;
            const baseSpeed = 5 + roundRef.current * 0.5;
            const vx = isLeft ? -baseSpeed : baseSpeed;
            const vy = -(baseSpeed * (0.8 + Math.random() * 0.4));

            newDucks.push({
                id: `${Date.now()}-${i}`,
                x: startX,
                y: startY,
                vx,
                vy,
                facing: isLeft ? 'left' : 'right',
                state: 'FLYING',
                indexInRound: currentRoundIndex + i,
                lastQuack: Date.now()
            });
        }

        setDucks(newDucks);
        setGameState('PLAYING');

        // Start 7s escape timer
        if (waveTimerRef.current) clearTimeout(waveTimerRef.current);
        waveStartTimeRef.current = Date.now();
        waveRemainingTimeRef.current = WAVE_DURATION;
        waveTimerRef.current = setTimeout(() => {
            if (gameStateRef.current === 'PLAYING') {
                triggerFlyAway();
            }
        }, WAVE_DURATION);
    }, [endRound, triggerFlyAway]);

    // Start round
    const startRound = useCallback((roundNum = roundRef.current) => {
        setGameState('ROUND_INTRO');
        setRoundDuckIndex(0);
        setRoundHits(0);
        setRoundHitTracker(Array(DUCKS_PER_ROUND).fill(null));

        showBanner(`ROUND ${roundNum}`, 2000, () => {
            startWave(0);
        });
    }, [showBanner, startWave]);

    // Start Game from Start Screen (Pulls trigger: gunshot sound, screen flash, recoil kick)
    const startGame = useCallback(() => {
        if (gameStateRef.current !== 'START_SCREEN') return;

        triggerLightgunFlash();
        triggerScreenShake();
        audioMgr.play('shot');

        setScore(0);
        setRound(1);
        startRound(1);
    }, [startRound, triggerLightgunFlash, triggerScreenShake]);

    // Shoot duck (with retro screen shake, muzzle blast, score popup, and feathers)
    const shootDuck = useCallback((duckId, clickX, clickY) => {
        if (gameStateRef.current !== 'PLAYING' || shotsLeftRef.current <= 0) return;

        const targetDuck = ducksRef.current.find((d) => d.id === duckId);
        if (!targetDuck || targetDuck.state !== 'FLYING') return;

        triggerLightgunFlash();
        triggerScreenShake();
        audioMgr.play('shot');

        const x = clickX ?? (targetDuck.x + DUCK_WIDTH / 2);
        const y = clickY ?? (targetDuck.y + DUCK_HEIGHT / 2);

        // Spawn Muzzle Sparks
        spawnSparks(x, y, 10);

        // Spawn Floating Score (+500)
        const scoreId = `${Date.now()}-score`;
        setEffects((prev) => ({
            ...prev,
            scores: [...prev.scores, { id: scoreId, x: targetDuck.x + 20, y: targetDuck.y, text: '+500' }]
        }));
        setTimeout(() => {
            setEffects((prev) => ({
                ...prev,
                scores: prev.scores.filter((s) => s.id !== scoreId)
            }));
        }, 900);

        // Spawn Feather Particles
        const featherColors = ['#ffffff', '#22bb33', '#1e88e5', '#ff9900'];
        const newFeathers = [];
        for (let i = 0; i < 6; i++) {
            newFeathers.push({
                id: `${Date.now()}-feather-${i}`,
                x: targetDuck.x + Math.random() * DUCK_WIDTH,
                y: targetDuck.y + Math.random() * DUCK_HEIGHT,
                color: featherColors[i % featherColors.length],
                driftX: (Math.random() - 0.5) * 80,
                rot: Math.random() * 360
            });
        }
        setEffects((prev) => ({
            ...prev,
            feathers: [...prev.feathers, ...newFeathers]
        }));
        setTimeout(() => {
            setEffects((prev) => ({
                ...prev,
                feathers: prev.feathers.filter((f) => !newFeathers.some((nf) => nf.id === f.id))
            }));
        }, 1200);

        const newShotsLeft = Math.max(0, shotsLeftRef.current - 1);
        setShotsLeft(newShotsLeft);

        // Mark duck shot
        setDucks((prevDucks) =>
            prevDucks.map((d) => (d.id === duckId ? { ...d, state: 'SHOT' } : d))
        );

        // Update score
        const newScore = scoreRef.current + 500;
        setScore(newScore);

        if (newScore > topScoreRef.current) {
            setTopScore(newScore);
            localStorage.setItem('duckhunt_top_score', String(newScore));
        }

        // Update hits & indicators
        setRoundHits((h) => h + 1);
        setRoundHitTracker((prevTracker) => {
            const updated = [...prevTracker];
            updated[targetDuck.indexInRound] = 'hit';
            return updated;
        });

        // Check if all ducks in current wave are shot
        setTimeout(() => {
            const currentFlying = ducksRef.current.filter(
                (d) => d.id !== duckId && d.state === 'FLYING'
            );
            if (currentFlying.length === 0) {
                if (waveTimerRef.current) clearTimeout(waveTimerRef.current);
                setTimeout(onWaveComplete, 1000);
            }
        }, 50);
    }, [triggerLightgunFlash, triggerScreenShake, spawnSparks, onWaveComplete]);

    // Miss shot (clicking background)
    const shootBackground = useCallback((clickX, clickY) => {
        if (gameStateRef.current !== 'PLAYING' || shotsLeftRef.current <= 0) return;

        triggerLightgunFlash();
        triggerScreenShake();
        audioMgr.play('shot');

        if (clickX !== undefined && clickY !== undefined) {
            spawnSparks(clickX, clickY, 6);

            // Spawn Miss Shockwave Ring
            const ringId = `${Date.now()}-ring`;
            setEffects((prev) => ({
                ...prev,
                missRings: [...prev.missRings, { id: ringId, x: clickX, y: clickY }]
            }));
            setTimeout(() => {
                setEffects((prev) => ({
                    ...prev,
                    missRings: prev.missRings.filter((r) => r.id !== ringId)
                }));
            }, 400);
        }

        const newShots = Math.max(0, shotsLeftRef.current - 1);
        setShotsLeft(newShots);

        if (newShots === 0) {
            const activeDucks = ducksRef.current.filter((d) => d.state === 'FLYING');
            if (activeDucks.length > 0) {
                triggerFlyAway();
            }
        }
    }, [triggerLightgunFlash, triggerScreenShake, spawnSparks, triggerFlyAway]);

    // Toggle Pause (Escape key)
    const togglePause = useCallback(() => {
        if (gameStateRef.current === 'PLAYING') {
            setGameState('PAUSED');
            const elapsed = Date.now() - waveStartTimeRef.current;
            waveRemainingTimeRef.current = Math.max(0, WAVE_DURATION - elapsed);
            if (waveTimerRef.current) clearTimeout(waveTimerRef.current);
        } else if (gameStateRef.current === 'PAUSED') {
            setGameState('PLAYING');
            waveStartTimeRef.current = Date.now();
            waveTimerRef.current = setTimeout(() => {
                if (gameStateRef.current === 'PLAYING') {
                    triggerFlyAway();
                }
            }, waveRemainingTimeRef.current);
        }
    }, [triggerFlyAway]);

    // Keyboard listener for ESC pause
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' || e.code === 'Escape') {
                togglePause();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [togglePause]);

    // 60 FPS Physics Loop
    useEffect(() => {
        let lastTime = performance.now();

        const step = (timestamp) => {
            const dt = timestamp - lastTime;
            lastTime = timestamp;

            if (gameStateRef.current === 'PLAYING' || gameStateRef.current === 'WAVE_CLEAR') {
                setDucks((prevDucks) => {
                    let changed = false;
                    const next = prevDucks.map((duck) => {
                        if (duck.state === 'FLYING') {
                            let newX = duck.x + duck.vx;
                            let newY = duck.y + duck.vy;
                            let newVx = duck.vx;
                            let newVy = duck.vy;
                            let newFacing = duck.facing;
                            let newLastQuack = duck.lastQuack;

                            // Horizontal boundary collision & sprite direction flip
                            if (newX < 0) {
                                newX = 0;
                                newVx = Math.abs(duck.vx);
                                newFacing = 'right';
                                audioMgr.play('flap');
                            } else if (newX + DUCK_WIDTH > windowSize.width) {
                                newX = windowSize.width - DUCK_WIDTH;
                                newVx = -Math.abs(duck.vx);
                                newFacing = 'left';
                                audioMgr.play('flap');
                            }

                            // Vertical boundary collision
                            if (newY < 0) {
                                newY = 0;
                                newVy = Math.abs(duck.vy);
                            } else if (newY + DUCK_HEIGHT > windowSize.height) {
                                newY = windowSize.height - DUCK_HEIGHT;
                                newVy = -Math.abs(duck.vy);
                            }

                            // Periodic quacking
                            if (Date.now() - duck.lastQuack > 3500) {
                                audioMgr.play('quack');
                                newLastQuack = Date.now();
                            }

                            changed = true;
                            return {
                                ...duck,
                                x: newX,
                                y: newY,
                                vx: newVx,
                                vy: newVy,
                                facing: newFacing,
                                lastQuack: newLastQuack
                            };
                        } else if (duck.state === 'ESCAPING') {
                            changed = true;
                            return {
                                ...duck,
                                y: duck.y + duck.vy
                            };
                        }
                        return duck;
                    });

                    return changed ? next : prevDucks;
                });
            }

            animFrameRef.current = requestAnimationFrame(step);
        };

        animFrameRef.current = requestAnimationFrame(step);
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [windowSize]);

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            if (waveTimerRef.current) clearTimeout(waveTimerRef.current);
            if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
            if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
            if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
        };
    }, []);

    return {
        gameState,
        score,
        topScore,
        round,
        shotsLeft,
        roundDuckIndex,
        roundHitTracker,
        ducks,
        banner,
        flash,
        dog,
        isMuted,
        crtEnabled,
        screenShake,
        effects,
        toggleCrt,
        toggleMute,
        startGame,
        shootDuck,
        shootBackground,
        togglePause
    };
}
