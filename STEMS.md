# Stem Format & Examples

This document provides comprehensive information about stem audio files, metadata structure, and how to create or add stems to the Fred Again Music Game.

## Audio Format Specifications

### Supported Formats
- **WAV** (Recommended)
  - Bit depth: 16-bit or 24-bit
  - Sample rate: 44.1kHz or 48kHz
  - Channels: Mono or Stereo
  - Compression: PCM (uncompressed)

- **MP3** (Optional)
  - Bitrate: 128kbps or higher
  - Sample rate: 44.1kHz or 48kHz
  - Channels: Stereo or Mono

### Audio Quality Guidelines

**High Quality (Recommended)**
- 24-bit, 48kHz, WAV
- File size: ~5-15MB per minute
- Best for professional production

**Standard Quality**
- 16-bit, 44.1kHz, WAV
- File size: ~3-10MB per minute
- Good balance of quality and file size

**Compressed (Smallest)**
- MP3, 192kbps, 44.1kHz
- File size: ~1-2MB per minute
- Suitable for quick previews

## Stem Categories

### Drum Stems
**Purpose**: Rhythmic foundation
- Kick drum loops
- Snare patterns
- Hi-hat rhythms
- Percussion elements
- Full drum kits

**Example Naming**
```
kick_loop_120bpm.wav
snare_tight.wav
hihat_closed.wav
perc_shaker.wav
drums_full_4bar.wav
```

### Bass Stems
**Purpose**: Low-end movement
- Deep basslines
- Sub-bass layers
- Synth bass
- Bass drums

**Example Naming**
```
bass_deep_80hz.wav
bass_synth_bright.wav
subbass_layer.wav
bass_line_groovy.wav
```

### Synth Stems
**Purpose**: Harmonic and melodic content
- Pad sounds
- Lead synths
- Atmospheric textures
- String arrangements

**Example Naming**
```
synth_pad_warm.wav
synth_lead_bright.wav
strings_lush.wav
atmosphere_ambient.wav
```

### Vocal Stems
**Purpose**: Lyrical content and texture
- Lead vocals
- Backing vocals
- Vocal layers
- Vocal effects

**Example Naming**
```
vocal_lead_dry.wav
vocal_background_harmony.wav
vocal_processed_reverb.wav
vocal_acapella.wav
```

### Effect Stems
**Purpose**: Enhancement and atmosphere
- Risers
- Sweeps
- Transitions
- Ambient effects

**Example Naming**
```
effect_riser_buildup.wav
effect_sweep_down.wav
effect_transition_swell.wav
effect_ambient_wash.wav
```

## Metadata Structure

### Metadata JSON Format

Each stem should have an accompanying `metadata.json` file:

```json
{
  "id": "unique_stem_identifier",
  "name": "Display Name",
  "category": "drum|bass|synth|vocal|effect",
  "filePath": "relative/path/to/file.wav",
  "duration": 16.0,
  "tempo": 120,
  "sampleRate": 48000,
  "channels": 2,
  "bitDepth": 24,
  "description": "Brief description of the stem",
  "tags": ["tag1", "tag2", "tag3"],
  "color": "#ff6b6b",
  "metadata": {
    "artist": "Fred again",
    "album": "Delilah",
    "version": "1.0",
    "dateAdded": 1684000000000,
    "loopable": true,
    "tempo_sync": true
  }
}
```

### Field Descriptions

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | string | Unique identifier | `"kick_loop_120"` |
| name | string | Display name in UI | `"Kick Loop"` |
| category | string | Stem type | `"drum"` |
| filePath | string | Path to audio file | `"drums/kick_loop.wav"` |
| duration | number | Length in seconds | `16.0` |
| tempo | number | BPM (for sync) | `120` |
| sampleRate | number | Hz | `48000` |
| channels | number | 1 (mono) or 2 (stereo) | `2` |
| bitDepth | number | 16 or 24 | `24` |
| description | string | Human-readable info | `"Deep kick for bass foundation"` |
| tags | array | Search tags | `["deep", "sub", "foundation"]` |
| color | string | Hex color for UI | `"#ff6b6b"` |
| metadata.artist | string | Creator name | `"Fred again"` |
| metadata.album | string | Collection name | `"Delilah"` |
| metadata.loopable | boolean | Can loop seamlessly | `true` |
| metadata.tempo_sync | boolean | Respects tempo changes | `true` |

## Delilah Template Example Structure

```
assets/stems/delilah/
├── metadata.json                 # Template metadata
├── drums/
│   ├── metadata.json
│   ├── kick_loop_120bpm.wav
│   ├── snare_tight.wav
│   ├── hihat_closed.wav
│   ├── hihat_open.wav
│   └── perc_shaker.wav
├── bass/
│   ├── metadata.json
│   ├── bass_deep_80hz.wav
│   ├── bass_synth_bright.wav
│   └── subbass_layer.wav
├── synths/
│   ├── metadata.json
│   ├── pad_warm.wav
│   ├── lead_bright.wav
│   ├── strings_lush.wav
│   └── atmosphere_ambient.wav
├── vocals/
│   ├── metadata.json
│   ├── vocal_lead_dry.wav
│   ├── vocal_harmony.wav
│   └── vocal_processed.wav
└── effects/
    ├── metadata.json
    ├── riser_buildup.wav
    ├── sweep_down.wav
    └── transition_swell.wav
```

### Template Metadata (delilah/metadata.json)

```json
{
  "id": "delilah",
  "name": "Delilah",
  "description": "Fred again's iconic Delilah track stems",
  "artist": "Fred again",
  "tempo": 120,
  "timeSignature": "4/4",
  "categories": {
    "drums": {
      "maxInstances": 3,
      "description": "Rhythmic foundation"
    },
    "bass": {
      "maxInstances": 2,
      "description": "Low-end movement"
    },
    "synths": {
      "maxInstances": 3,
      "description": "Harmonic content"
    },
    "vocals": {
      "maxInstances": 2,
      "description": "Vocal elements"
    },
    "effects": {
      "maxInstances": 2,
      "description": "Enhancement"
    }
  }
}
```

## Adding New Stems

### Step 1: Prepare Audio File

1. **Export audio** from your DAW (Ableton, Logic, etc.)
   - Format: WAV (44.1kHz or 48kHz, 16-bit or 24-bit)
   - Length: Keep between 4-32 bars for consistency
   - Check: Ensure no clicks, pops, or artifacts

2. **Test the file**
   ```bash
   # Verify audio properties (on Linux/macOS)
   ffprobe drums/kick_loop_120bpm.wav
   ```

### Step 2: Create Metadata File

Create a `metadata.json` file in the same directory:

```json
{
  "id": "kick_loop_120",
  "name": "Kick Loop 120",
  "category": "drum",
  "filePath": "drums/kick_loop_120bpm.wav",
  "duration": 8.0,
  "tempo": 120,
  "sampleRate": 48000,
  "channels": 1,
  "bitDepth": 24,
  "description": "Deep kick pattern at 120 BPM",
  "tags": ["deep", "foundation", "kick"],
  "color": "#ff6b6b",
  "metadata": {
    "artist": "Your Name",
    "album": "Custom Pack",
    "version": "1.0",
    "dateAdded": 1684000000000,
    "loopable": true,
    "tempo_sync": true
  }
}
```

### Step 3: Place in Correct Directory

```
assets/stems/delilah/[category]/
├── audio_file.wav
└── metadata.json
```

### Step 4: Update Category Metadata

If adding new files to a category, update the category's `metadata.json`:

```json
{
  "category": "drums",
  "stems": [
    "kick_loop_120",
    "snare_tight",
    "hihat_closed",
    "hihat_open",
    "perc_shaker"
  ]
}
```

### Step 5: Test in App

1. Start development server
   ```bash
   npm run tauri dev
   ```

2. Navigate to the template
3. Verify the stem appears in its category
4. Click the stem button to test loading
5. Check console for any errors

## Best Practices

### Audio Quality
- ✅ Use 24-bit, 48kHz WAV for best quality
- ✅ Keep stems in range -3dB to -1dB peak
- ✅ Ensure no hard clipping or distortion
- ✅ Test on multiple audio systems

### Organization
- ✅ Use consistent naming conventions
- ✅ Group related stems by category
- ✅ Keep directory structures clean
- ✅ Use descriptive, searchable names

### Metadata
- ✅ Always include complete metadata.json
- ✅ Use unique IDs for each stem
- ✅ Add meaningful tags for searchability
- ✅ Include duration and tempo information

### File Size
- ✅ Compress MP3s to 192kbps or higher
- ✅ Keep individual stems under 50MB
- ✅ Limit templates to under 500MB total
- ✅ Consider web audio bandwidth

## Common Issues & Solutions

### "Stem doesn't appear in UI"
- Check metadata.json is in correct location
- Verify `id` field is unique
- Ensure category name matches exactly
- Check file path is relative and correct

### "Audio sounds distorted or clipped"
- Re-export audio with peak at -3dB
- Check bit depth (use 24-bit for headroom)
- Verify no normalization was applied
- Test audio player separately

### "Stem plays but sounds different"
- Check sample rate consistency (44.1k vs 48k)
- Verify no sample rate conversion happened
- Listen to source file for comparison
- Check Web Audio API resampling

### "File won't load or is slow"
- Verify file format (WAV, not compressed)
- Check file size (under 50MB recommended)
- Test file with ffprobe or similar tool
- Try with smaller sample rate (44.1k)

## Resources

- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [WAV Format Specification](https://www.mmsp.ece.mcgill.ca/documents/AudioFormats/WAVE/WAVE.html)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [Audio Quality Guide](https://www.sweetwater.com/insync/audio-resolution/)

---

**Have questions about stems? Open an issue on GitHub!**
