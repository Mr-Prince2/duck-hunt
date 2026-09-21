# 🦆 Duck Hunt — Retro Arcade Edition (React)

An authentic recreation of the legendary 1984 NES classic **Duck Hunt**, re-engineered as a modern, high-performance **React** application built with **Vite** and **Vanilla CSS**.

Relive the golden age of 8-bit lightgun arcade shooting right in your browser — enhanced with an authentic **Vintage & Modern Retro Animation Suite**, complete with CRT scanlines, gun recoil screen shake, muzzle blast sparks, floating score popups, and falling feathers.

---

## 🎮 Gameplay & Visual Features

### 📺 Vintage Arcade CRT Aesthetics
- **Authentic Phosphor Scanlines**: Fine horizontal CRT phosphor lines with subtle flicker.
- **Tube Vignette & Curvature**: Soft radial shading at the edges simulating classic arcade cathode-ray tube glass.
- **Interactive CRT Toggle Button**: Click `📺 CRT: ON / OFF` in the top header to seamlessly toggle between authentic arcade monitor mode and crisp modern HD.

### 💥 Modern Retro Tactile "Juice"
- **Gun Recoil Screen Shake**: Every trigger pull delivers dynamic screen kickback for visceral tactile feedback.
- **Muzzle Blast & Sparks**: Radiant sparks burst outward from the reticle impact coordinate upon firing.
- **Floating Arcade Score (`+500`)**: Hitting a duck pops up a glowing 8-bit score counter that springs upward before fading out.
- **Drifting Feather Particles**: Feathers scatter and flutter realistically when a duck takes a hit.
- **Miss Click Shockwaves**: Firing into empty background emits a ricochet shockwave ring.

### 🕹️ Classic NES Mechanics
- **10 Ducks Per Round**: Progressive waves of 1 or 2 ducks based on remaining round quota.
- **3 Bullets Per Wave**: Every shot counts. Miss clicks or running out of ammo triggers the duck to escape!
- **7-Second Wave Timer**: Ducks fly away if you don't take them down in time.
- **Passing Requirement**: Hit at least 6 out of 10 ducks to advance to the next round with increased duck speeds.
- **The Infamous Dog**:
  - The hound rises from the tall grass to proudly display your 1 or 2 bagged ducks with the victory jingle.
  - Miss both ducks? Prepare for the iconic mocking laugh!
- **NES Retro HUD**:
  - Ammo chamber with shell recoil animations when fired.
  - 10-indicator hit tracker with blinking active targeting and bright neon hit pulses.
  - Digital score, round, and high score display.
- **Audio & Sound Pooling**:
  - Multi-channel Web Audio manager allowing overlapping rapid-fire gunshots, flapping wings, quacks, and dog jingles.
  - Quick-toggle Mute/Unmute button in the top bar.
- **Persistent High Scores**:
  - High scores automatically saved to `localStorage`.
- **Keyboard Shortcuts & Pause**:
  - Press `[ESC]` anytime during a round to pause the hunt.

---

## 🕹️ Controls

| Action | Control |
| :--- | :--- |
| **Shoot / Pull Trigger** | **Left Mouse Click** |
| **Pause / Resume Game** | **`[ESC]` Key** |
| **Toggle CRT Monitor Mode** | **Click `📺 CRT` Button (Top Bar)** |
| **Toggle Sound Effects** | **Click `🔊 SOUND` Button (Top Bar)** |
| **Start / Resume Hunt** | **Click Start Prompt / Enter / Space** |

---

## 🏆 Scoring System

| Target | Points |
| :--- | :--- |
| **Duck Shot** | **+500 Points** |
| **Passing Score** | **≥ 6 / 10 Ducks per Round** |
| **Game Over** | **< 6 / 10 Ducks per Round** |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- `npm` or `pnpm` or `yarn`

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd Duck-Hunt
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://127.0.0.1:3000` (or the port indicated in your terminal).

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```text
Duck-Hunt/
├── public/                     # Static assets served at root
│   ├── dog-duck1.png           # Dog holding 1 duck
│   ├── dog-duck2.png           # Dog holding 2 ducks
│   ├── dog-score.mp3           # Victory score jingle
│   ├── duck-flap.mp3           # Wing flap sound effect
│   ├── duck-left.gif           # Left flying duck sprite
│   ├── duck-quack.mp3          # Quack sound effect
│   ├── duck-right.gif          # Right flying duck sprite
│   ├── duck-shot.mp3           # Gunshot sound effect
│   ├── duckhunt-bg-4k.png      # 4K remastered NES meadow background
│   ├── game-font.otf           # Classic arcade pixel font
│   └── target.png              # Custom crosshair cursor
├── src/
│   ├── components/             # Modular React UI components
│   │   ├── AudioControl.jsx    # Sound mute/unmute toggle
│   │   ├── BannerOverlay.jsx   # Chromatic aberration glitch banners
│   │   ├── CRTOverlay.jsx      # Phosphor scanlines, vignette & CRT toggle
│   │   ├── DogSprite.jsx       # Dog rise & retrieve animation
│   │   ├── DuckSprite.jsx      # Flying & falling duck sprite
│   │   ├── FlashOverlay.jsx    # Lightgun CRT flash simulation
│   │   ├── GameBoard.jsx       # Interactive playfield & impact detector
│   │   ├── HUD.jsx             # Shell-ejecting ammo, neon indicators & score
│   │   ├── ParticleLayer.jsx   # Sparks, shockwaves, floating score & feathers
│   │   ├── PauseScreen.jsx     # Pause modal overlay
│   │   └── StartScreen.jsx     # Arcade title & high score overlay
│   ├── hooks/
│   │   └── useDuckHunt.js      # 60 FPS physics engine, recoil & effect state
│   ├── utils/
│   │   └── audioManager.js     # Sound pool preloading & playback manager
│   ├── App.jsx                 # Main application coordinator
│   ├── main.jsx                # React DOM entrypoint
│   └── index.css               # Retro arcade styling, CRT FX & animations
├── index.html                  # HTML entry template
├── package.json                # Project dependencies and npm scripts
├── vite.config.js              # Vite React configuration
└── README.md                   # Documentation
```

---

## 🛠️ Tech Stack

- **React 18** — Component-driven reactive UI architecture.
- **Vite** — Lightning-fast HMR and optimized asset bundling.
- **Vanilla CSS** — Custom pixel-art styling, keyframe animations (`screenShake`, `sparkBurst`, `scoreFloatUp`, `crtFlicker`, `chromaticGlitch`).
- **HTML5 Canvas / `requestAnimationFrame`** — 60+ FPS physics engine for silky-smooth duck flight and boundary collision.
- **HTML5 Audio API** — Multi-channel sound effects and audio preloading.

---

## 📜 License & Acknowledgments

This project is created for educational and nostalgic entertainment purposes, paying homage to the legendary 1984 Nintendo classic *Duck Hunt*.
