## Development Setup & Guide

This guide covers setting up your development environment, building, and debugging the Fred Again Music Game.

### Prerequisites

#### Option A: NixOS (Recommended)

```bash
nix flake update
nix develop
```

This automatically provides:
- Node.js 18+
- Rust 1.70+
- Tauri CLI
- All system dependencies

#### Option B: Manual Setup

**macOS / Linux:**
```bash
# Install Node.js (via nvm or your package manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
node --version  # v18+

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustc --version

# Install system dependencies (Linux)
# Ubuntu/Debian:
sudo apt-get install libappindicator3-dev libwebkit2gtk-4.0-dev libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev

# Fedora:
sudo dnf install webkit2-gtk3-devel openssl-devel curl wget file libxcb dbus-devel libappindicator-gtk3-devel librsvg2-devel

# macOS:
brew install gtk4 webkit2gtk libxcb
```

**Windows:**
- Install Node.js from https://nodejs.org/
- Install Rust from https://rustup.rs/
- Install Visual C++ Build Tools

### Project Setup

```bash
# Clone the repository
git clone https://github.com/palontologist/fred-again-music-game.git
cd fred-again-music-game

# Install dependencies
npm install

# Install Tauri CLI (optional, auto-installed)
cargo install tauri-cli --version "^2.0"
```

### Development Workflow

#### Starting Development Server

```bash
# Option 1: Using npm script (recommended)
npm run tauri dev

# Option 2: Manual steps
npm install
npm run dev  # Starts Vite dev server
cargo tauri dev  # Starts Tauri app
```

The app will open in a window with:
- Hot reload for frontend changes
- Rust code recompilation on changes
- DevTools console for debugging

#### Project Structure During Development

```
src/                           # Frontend (TypeScript/React)
├── components/
│   ├── StemBox.tsx           # Stem triggering UI
│   ├── Mixer.tsx             # Mixer channels
│   ├── Timeline.tsx          # Sequencer
│   └── Player.tsx            # Playback controls
├── hooks/
│   ├── useAudio.ts           # Audio context hook
│   ├── useSongs.ts           # Song management
│   └── useMixer.ts           # Mixer logic
├── lib/
│   ├── audio.ts              # Web Audio utilities
│   ├── effects.ts            # Effect processors
│   └── types.ts              # TypeScript types
└── main.tsx                  # React root

src-tauri/                     # Backend (Rust)
├── src/
│   ├── main.rs               # Tauri entry point
│   ├── commands/
│   │   ├── stems.rs          # Stem loading
│   │   ├── projects.rs       # Project I/O
│   │   └── export.rs         # Audio export
│   └── lib.rs                # Tauri lib
└── Cargo.toml               # Rust dependencies
```

### Building Components

#### Frontend Only (Vite)

```bash
# Development
npm run dev

# Production build
npm run build
```

#### Rust Backend

```bash
cd src-tauri

# Development build
cargo build

# Release build (optimized)
cargo build --release

# Check for errors
cargo check

# Run tests
cargo test
```

#### Full Tauri Build

```bash
# Development with hot reload
npm run tauri dev

# Production build (creates installer/DMG/AppImage)
npm run tauri build

# Build output locations:
# macOS: src-tauri/target/release/bundle/macos/
# Linux: src-tauri/target/release/bundle/appimage/
# Windows: src-tauri/target/release/bundle/msi/
```

### Adding New Stems

1. **Prepare Audio File**
   ```bash
   # Export as 44.1kHz, 16-bit WAV
   # Place in: assets/stems/[song_name]/[category]/
   ```

2. **Create Metadata**
   ```json
   // assets/stems/[song_name]/[category]/metadata.json
   {
     "id": "unique_stem_id",
     "name": "Stem Name",
     "category": "drum|bass|synth|vocal|effect",
     "duration": 16.0,
     "tempo": 120,
     "description": "Brief description",
     "tags": ["loop", "4/4"]
   }
   ```

3. **Test Loading**
   - Start dev server: `npm run tauri dev`
   - Navigate to stem in UI
   - Verify playback and metadata display

### Code Style & Conventions

#### TypeScript/React

```typescript
// ✅ Good: Descriptive, typed, reusable
interface StemProps {
  stem: Stem;
  onPlay: (stem: Stem) => void;
  intensity?: number;
}

export const StemBox: React.FC<StemProps> = ({ stem, onPlay, intensity = 0.5 }) => {
  return (
    <button onClick={() => onPlay(stem)} className="stem-button">
      {stem.name}
    </button>
  );
};

// ❌ Avoid: Untyped, unclear naming
const Box = ({ s, f }) => {
  return <button onClick={() => f(s)}>Play</button>;
};
```

#### Rust

```rust
// ✅ Good: Clear error handling, documented
#[tauri::command]
pub fn load_stem(stem_id: String) -> Result<Vec<u8>, String> {
  /// Load and return stem audio data
  let path = format!("assets/stems/{}.wav", stem_id);
  std::fs::read(&path)
    .map_err(|e| format!("Failed to load stem: {}", e))
}

// ❌ Avoid: Unwrap, no error context
#[tauri::command]
pub fn load_stem(id: String) -> Vec<u8> {
  std::fs::read(format!("assets/stems/{}.wav", id)).unwrap()
}
```

### Debugging

#### Frontend Debugging

```bash
# Open DevTools in running app
# Press: Ctrl+Shift+I (Linux/Windows) or Cmd+Option+I (macOS)

# Or programmatically in code:
console.log('Debug info:', state);
console.warn('Warning:', error);
```

#### Rust Debugging

```bash
# Add debug logging
// In Cargo.toml:
// [dependencies]
// log = "0.4"
// env_logger = "0.10"

use log::{info, warn, error};

#[tauri::command]
pub fn load_stem(stem_id: String) -> Result<Vec<u8>, String> {
  info!("Loading stem: {}", stem_id);
  // ...
}

# Run with logging enabled:
RUST_LOG=debug npm run tauri dev
```

#### Web Audio Debugging

```typescript
// Check AudioContext state
const ctx = audioContext;
console.log('Sample rate:', ctx.sampleRate);
console.log('State:', ctx.state);
console.log('Current time:', ctx.currentTime);

// Monitor volume levels
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;
const dataArray = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteFrequencyData(dataArray);
console.log('Audio levels:', dataArray);
```

### Testing

#### Unit Tests (Rust)

```bash
cd src-tauri
cargo test
```

#### Integration Tests

```typescript
// src/__tests__/audio.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { decodeAudio } from '../lib/audio';

describe('Audio utilities', () => {
  it('should decode WAV files', async () => {
    const data = await fetch('/stems/test.wav').then(r => r.arrayBuffer());
    const decoded = await decodeAudio(audioContext, data);
    expect(decoded).toBeInstanceOf(AudioBuffer);
  });
});

# Run tests
npm run test
```

### Performance Profiling

#### Frontend (React DevTools)

```bash
# Install React DevTools extension
# https://react-devtools-tutorial.vercel.app/

# In code:
import { Profiler } from 'react';

<Profiler id="mixer" onRender={(id, phase, actualDuration) => {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}}>
  <Mixer />
</Profiler>
```

#### Web Audio Profiling

```typescript
// Measure audio scheduling latency
const before = performance.now();
sourceNode.start(audioContext.currentTime + 0.1);
const after = performance.now();
console.log('Scheduling latency:', after - before, 'ms');
```

### Common Issues & Solutions

#### "Cannot find module" errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Or with npm cache clear
npm cache clean --force
npm install
```

#### Tauri compilation errors

```bash
# Update dependencies
npm update
cargo update

# Clean and rebuild
cargo clean
npm run tauri build
```

#### Audio playback issues

```typescript
// Ensure AudioContext is running
if (audioContext.state === 'suspended') {
  await audioContext.resume();
}

// Check for CORS issues with remote audio
// Use local assets from assets/ directory
```

#### NixOS specific issues

```bash
# Rebuild environment
nix flake update

# Enter clean shell
nix flake check
nix develop --refresh

# Force rebuild
rm -rf ~/.cache/nix
nix develop
```

### Deployment

#### Create Release Build

```bash
# Build optimized binary
npm run tauri build

# Platform-specific builds:
# macOS:  src-tauri/target/release/bundle/macos/Fred Again Music Game.app
# Linux:  src-tauri/target/release/bundle/appimage/fred-again-music-game_0.1.0_amd64.AppImage
# Windows: src-tauri/target/release/bundle/msi/Fred Again Music Game_0.1.0_x64_en-US.msi
```

#### Tauri Configuration

Key settings in `src-tauri/tauri.conf.json`:

```json
{
  "productName": "Fred Again Music Game",
  "version": "0.1.0",
  "identifier": "com.fredagain.musicgame",
  "build": {
    "beforeBuildCommand": "npm run build",
    "devUrl": "http://localhost:5173",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "Fred Again Music Game",
        "width": 1200,
        "height": 800,
        "resizable": true,
        "fullscreen": false
      }
    ]
  }
}
```

### Resources

- [Tauri Documentation](https://tauri.app)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [React Documentation](https://react.dev)
- [Rust Book](https://doc.rust-lang.org/book/)
- [NixOS Manual](https://nixos.org/manual/nixos/stable/)

---

**Need help? Open an issue on GitHub or join our community discussions!**
