## Architecture Overview

This document describes the system architecture, design patterns, and data flow of the Fred Again Music Game.

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Tauri Main Process                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Frontend (React + TypeScript)           │  │
│  ├────────────────────────────────────────────────��─────┤  │
│  │ - StemBox (UI Components)                            │  │
│  │ - Mixer (Channel Controls)                           │  │
│  │ - Player (Playback Controls)                         │  │
│  │ - Timeline (Sequencer)                               │  │
│  └──────────────────────────────────────────────────────┘  │
│           │                                                │
│           │ IPC (Tauri Commands)                          │
│           ▼                                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Tauri Backend (Rust)                        │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ - Command Handlers (stems, projects, export)        │  │
│  │ - File I/O & Audio Processing                       │  │
│  │ - Native Events & IPC                               │  │
│  └──────────────────────────────────────────────────────┘  │
│           │                                                │
│           ▼                                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        System Resources                              │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ - File System (stems, projects, cache)              │  │
│  │ - Audio Hardware (speakers, mic input)              │  │
│  │ - OS APIs (window management, system events)        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└───────────────────────────────────��─────────────────────────┘
```

### Component Structure

#### Frontend Components

```
App
├── Header
│   ├── Logo
│   ├── Menu
│   └── Settings
├── MainView
│   ├── StemBox (Grid/List of stems)
│   │   ├── StemButton
│   │   │   ├── Name
│   │   │   ├── Category Badge
│   │   │   └── Visual Feedback
│   │   └── StemFilter
│   ├── Mixer
│   │   ├── MixerChannel (per stem)
│   │   │   ├── VolumeSlider
│   │   │   ├── PanKnob
│   │   │   ├── EffectSlots
│   │   │   └── Mute/Solo
│   │   └── MasterChannel
│   │       ├── MasterVolume
│   │       ├── Compression
│   │       └── Limiter
│   ├── Player
│   │   ├── PlayButton
│   │   ├── TimelineDisplay
│   │   ├── LoopControl
│   │   └── TempoBPM
│   └── Timeline
│       ├── StemTrack (per stem)
│       │   ├── ClipEditor
│       │   └── EventMarkers
│       └── GlobalMarkers
└── ProjectPanel
    ├── ProjectList
    ├── ExportDialog
    └── Settings
```

#### Data Flow

```
User Interaction (Click Stem)
       │
       ▼
React Component State Update
       │
       ▼
Audio Context: Create BufferSource + GainNode
       │
       ▼
Web Audio Graph: Source → Effects → Mixer → Destination
       │
       ▼
Audio Hardware Output
       │
       ▼
Speaker Output 🔊
```

### Audio Processing Pipeline

#### Signal Flow

```
Stem Audio File
    │
    ▼
Decode (Web Audio API)
    │
    ▼
AudioBuffer in Memory
    │
    ▼
BufferSource Node
    │
    ├─→ EQ Filter (3-band)
    │
    ├─→ Effects Chain
    │   ├─→ Reverb (Convolver)
    │   ├─→ Delay (IIRFilter based)
    │   └─→ Compressor
    │
    ├─→ Gain Node (Volume)
    │
    ├─→ Stereo Panner (L/R Balance)
    │
    ▼
MasterGain Node (Master Volume)
    │
    ▼
DynamicsCompressor (Safety Limiter)
    │
    ▼
Analyser Node (Visualizer)
    │
    ▼
AudioContext Destination
    │
    ▼
Speaker Output
```

#### Effects Architecture

Each stem channel includes:

```typescript
interface StemChannel {
  id: string;
  source: AudioBufferSource;
  
  // Pre-processing
  analyser: AnalyserNode;
  
  // EQ
  eq: {
    low: BiquadFilterNode;      // 80Hz shelf
    mid: BiquadFilterNode;      // 1kHz peaking
    high: BiquadFilterNode;     // 12kHz shelf
  };
  
  // Effects
  effects: {
    reverb: ConvolverNode;
    delay: DelayNode;
    feedback: GainNode;         // For delay feedback
    compressor: DynamicsCompressor;
  };
  
  // Output
  volume: GainNode;
  pan: StereoPannerNode;
  
  // Routing
  masterGain: GainNode;
  
  // State
  state: 'idle' | 'playing' | 'paused';
}
```

### Data Model

#### Stem Object

```typescript
interface Stem {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  category: 'drum' | 'bass' | 'synth' | 'vocal' | 'effect';
  filePath: string;              // Path to audio file
  duration: number;              // Length in seconds
  tempo: number;                 // BPM (for sync)
  sampleRate: number;            // 44100 or 48000
  channels: number;              // Mono (1) or Stereo (2)
  description: string;           // Brief description
  tags: string[];                // Search tags
  color: string;                 // UI color (hex)
  metadata: {
    artist?: string;
    album?: string;
    dateAdded: number;            // Timestamp
  };
}
```

#### Song Project

```typescript
interface SongProject {
  id: string;
  title: string;
  templateName: string;          // e.g., "delilah"
  createdAt: number;             // Timestamp
  modifiedAt: number;
  stems: StemInstance[];
  settings: {
    tempo: number;               // BPM
    timeSignature: '4/4' | '3/4';
    duration: number;            // Bars
  };
}

interface StemInstance {
  stemId: string;                // Reference to Stem
  startBar: number;
  durationBars: number;
  channel: ChannelSettings;
  effects: EffectSettings;
  automation?: AutomationTrack[];
}

interface ChannelSettings {
  volume: number;                // 0-1
  pan: number;                   // -1 (L) to 1 (R)
  muted: boolean;
  solo: boolean;
}

interface EffectSettings {
  eq: { low: number; mid: number; high: number };
  reverb: number;                // 0-1
  delay: number;                 // 0-1
  delayTime: number;             // ms (250-1000)
  compression: number;           // 0-1
}
```

#### Song Template

```typescript
interface SongTemplate {
  id: string;                    // e.g., "delilah"
  name: string;
  artist: string;
  description: string;
  stems: StemCategory[];
  defaultSettings: {
    tempo: number;
    timeSignature: string;
  };
}

interface StemCategory {
  category: 'drum' | 'bass' | 'synth' | 'vocal' | 'effect';
  maxInstances: number;          // How many stems of this type allowed
  stems: Stem[];                 // Available stems in this category
}
```

### Tauri Command Architecture

#### IPC Commands (Frontend ↔ Backend)

```typescript
// Stem Loading
@tauri.command
async loadStem(stemId: string): Promise<ArrayBuffer>

@tauri.command
async listStems(template: string): Promise<Stem[]>

@tauri.command
async getStemMetadata(stemId: string): Promise<StemMetadata>

// Project Management
@tauri.command
async saveProject(project: SongProject): Promise<string>  // Returns project ID

@tauri.command
async loadProject(projectId: string): Promise<SongProject>

@tauri.command
async listProjects(): Promise<SongProject[]>

@tauri.command
async deleteProject(projectId: string): Promise<boolean>

// Export
@tauri.command
async exportAudio(
  projectId: string,
  format: 'wav' | 'mp3',
  quality?: 'high' | 'medium'
): Promise<string>  // Returns file path

// Templates
@tauri.command
async getTemplate(templateName: string): Promise<SongTemplate>

@tauri.command
async listTemplates(): Promise<SongTemplate[]>
```

### State Management

React hooks for managing application state:

```typescript
// Audio Context
export const useAudio = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  // ... audio playback logic
};

// Mixer State
export const useMixer = () => {
  const [channels, setChannels] = useState<Map<string, ChannelSettings>>();
  const [masterVolume, setMasterVolume] = useState(0.8);
  // ... mixer logic
};

// Song Project State
export const useSong = () => {
  const [project, setProject] = useState<SongProject | null>(null);
  const [isModified, setIsModified] = useState(false);
  // ... project management logic
};

// Stems Library
export const useStems = () => {
  const [stems, setStems] = useState<Stem[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('delilah');
  // ... stem loading logic
};
```

### File System Structure

```
$HOME/.config/fred-again-music-game/          (Linux)
$HOME/Library/Application Support/fred-again-music-game/  (macOS)
%APPDATA%\fred-again-music-game\              (Windows)
├── projects/
│   ├── project_1/
│   │   ├── metadata.json          # Project info
│   │   ├── stems.json             # Stem instances
│   │   └── mixdown.wav            # Last export
│   └── project_2/
├── cache/
│   ├── decoded_stems/             # Pre-decoded audio
│   └── thumbnails/
└── settings.json                  # User preferences
```

Application assets (in repo):

```
assets/
├── stems/
│   ├── delilah/
│   │   ├── drums/
│   │   │   ├── kick_loop.wav
│   │   │   ├── snare_pattern.wav
│   │   │   └── metadata.json
│   │   ├── bass/
│   │   ├── synths/
│   │   ├── vocals/
│   │   └── effects/
│   └── other_templates/
├── impulses/                      # Reverb impulse responses
│   ├── hall_large.wav
│   ├── room_small.wav
│   └── plate.wav
└── presets/
    ├── mixdown_presets.json       # Default mix settings
    └── effect_presets.json
```

### Threading & Performance

#### Web Audio Thread

- Runs in real-time audio thread (separate from main)
- All scheduling must be done with `audioContext.currentTime`
- Avoid heavy computation; use AudioWorklet for complex processing

#### Main Thread

- React component rendering
- User input handling
- File I/O operations

#### Rust Backend (Separate Process)

- File system operations
- Heavy audio processing (if needed)
- Project serialization/deserialization

### Error Handling

```typescript
// Frontend
try {
  const audioBuffer = await loadStem(stemId);
  // Process audio
} catch (error) {
  console.error('Failed to load stem:', error);
  showErrorNotification('Could not load stem - check file exists');
}

// Rust Backend
#[tauri::command]
pub fn load_stem(stem_id: String) -> Result<Vec<u8>, String> {
  let path = format!("assets/stems/{}.wav", stem_id);
  std::fs::read(&path)
    .map_err(|e| format!("IO Error: {}", e))
}
```

### Security Considerations

1. **File Access**: Only load stems from `assets/stems/` directory
2. **Audio Context**: Always validate audio data before processing
3. **Buffer Overflow**: Use typed arrays with length checks
4. **Tauri Configuration**: Restrict allowed commands in `tauri.conf.json`

### Performance Targets

- **Load Stem**: < 500ms
- **Switch Stem**: < 100ms
- **Audio Latency**: < 50ms
- **UI Responsiveness**: 60 FPS
- **Memory Usage**: < 200MB average

### Future Architecture Considerations

- **AudioWorklet**: For low-latency custom effects
- **MIDI Support**: External controller integration
- **Recording**: Capture user's mixdown to WAV
- **Plugins**: VST/AU effect plugin support
- **Multiplayer**: Network sync for collaborative sessions

---

For questions about architecture decisions, see [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) (future doc).
