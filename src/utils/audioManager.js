// Audio Manager with preloading, sound pooling, and mute control
class AudioManager {
    constructor() {
        this.muted = false;
        this.sounds = {
            shot: new Audio('/duck-shot.mp3'),
            score: new Audio('/dog-score.mp3'),
            quack: new Audio('/duck-quack.mp3'),
            flap: new Audio('/duck-flap.mp3')
        };

        // Preload sounds
        Object.values(this.sounds).forEach((audio) => {
            audio.load();
        });
    }

    setMuted(muted) {
        this.muted = muted;
    }

    isMuted() {
        return this.muted;
    }

    play(name) {
        if (this.muted) return;
        if (this.sounds[name]) {
            // Clone audio node to allow rapid overlapping sounds (e.g. consecutive shots)
            const sound = this.sounds[name].cloneNode();
            sound.volume = 0.8;
            sound.play().catch((e) => {
                // Ignore audio play errors from autoplay policies before user interaction
                console.debug('Audio playback delayed or blocked by browser:', e.message);
            });
        }
    }
}

export const audioMgr = new AudioManager();
export default audioMgr;
