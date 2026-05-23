# Fred Again Music Game

A music creation game inspired by Fred again's stem-based production style, built with **Tauri** and optimized for **NixOS**. Players create songs by layering and manipulating stems—drums, basses, samples, and effects—similar to how "Delilah" and other Fred again productions are constructed.

## 🎵 Project Vision

This project aims to make music creation accessible and interactive through a game-like interface. Players start with iconic stems (like from "Delilah") and progressively unlock new instruments, effects, and production techniques, learning how to compose in Fred again's signature style.

## ✨ Features

- **Stem-Based Production**: Layer and mix different instrument stems (drums, bass, synths, vocals)
- **Interactive Sample Box**: Click and drag to trigger samples, similar to a modern MPC
- **Real-Time Mixing**: Adjust volume, pan, and effects for each stem
- **Song Building**: Create full compositions from stem combinations
- **Progression System**: Unlock new stems and instruments as you progress
- **NixOS Native**: Reproducible development environment with Nix flakes

## 🛠️ Technology Stack

- **Frontend**: TypeScript, React, Web Audio API
- **Backend**: Rust via Tauri (for native performance and file I/O)
- **Audio**: Web Audio API for mixing and effects
- **Desktop Framework**: Tauri (lightweight, secure, cross-platform)
- **Package Management**: Nix (reproducible builds, NixOS support)
- **Build System**: Cargo (Rust) + Vite (Frontend)

## 📋 Project Structure

```
fred-again-music-game/
├── README.md                 # This file
├── ARCHITECTURE.md           # Design and system architecture
├── STEMS.md                  # Stem format and examples
├── DEVELOPMENT.md            # Development setup guide
├── flake.nix                 # Nix flake for development
├── shell.nix                 # Fallback nix-shell config
├── package.json              # Frontend dependencies
├── src-tauri/
│   ├── Cargo.toml           # Rust dependencies
│   ├── tauri.conf.json      # Tauri configuration
│   └── src/
│       └── main.rs          # Rust backend entry point
├── src/
│   ├── index.html           # Main HTML
│   ├── main.tsx             # React entry point
│   ├── components/          # React components
│   │   ├── StemBox.tsx
│   │   ├── Mixer.tsx
│   │   └── Player.tsx
│   ├── styles/              # CSS/styling
│   └── lib/                 # Utilities and helpers
└── assets/
    ├── stems/               # Audio stem files
    ├── samples/             # Sample packs
    └── artwork/             # Album art and icons
```

## 🚀 Quick Start

### Prerequisites

- **NixOS/Nix**: For reproducible environments
- Or manually: Node.js 18+, Rust 1.70+, Tauri CLI

### Development (NixOS)

```bash
# Enter development environment
nix flake update && nix develop

# Install dependencies
npm install

# Run in development mode
npm run tauri dev
```

### Development (Manual)

```bash
# Install Node dependencies
npm install

# Install Rust dependencies (via Cargo)
cd src-tauri && cargo build

# Run development server
npm run tauri dev
```

### Build for Production

```bash
npm run tauri build
```

## 📚 Example: Delilah Stems

The "Delilah" example includes:

- **Drums**: Looped drum pattern (4/4 time)
- **Bass**: Deep, warm bassline
- **Synths**: Atmospheric pad and bright lead
- **Vocals**: Layered vocal samples
- **Effects**: Reverb and delay chains

See `STEMS.md` for detailed format specifications and how to add custom stems.

## 🎮 Gameplay Flow

1. **Select a Song Template** (e.g., Delilah)
2. **Choose Stems** from available instruments
3. **Arrange and Layer** stems in the timeline/grid
4. **Adjust Parameters** (volume, effects, timing)
5. **Play and Export** your creation
6. **Share** or challenge friends

## 📖 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design, components, and data flow
- **[STEMS.md](./STEMS.md)** - Audio stem formats, examples, and creation guidelines
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Setup, building, and debugging instructions

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🎵 Inspiration

- Fred again's innovative stem-based production approach
- The accessibility and learning potential of interactive music tools
- The NixOS community's commitment to reproducible computing

## 📞 Support

For issues, questions, or suggestions, please open a GitHub issue.

---

**Let's make music creation fun and accessible!** 🎶
