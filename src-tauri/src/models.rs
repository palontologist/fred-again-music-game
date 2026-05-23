use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PlayerProgress {
    pub id: String,
    pub level: i32,
    pub xp: i32,
    pub xp_to_next_level: i32,
    pub songs_created: i32,
    pub stems_learned: i32,
    pub effects_mastered: i32,
    pub total_playtime_minutes: i32,
    pub created_at: i64,
    pub last_played: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Achievement {
    pub id: String,
    pub title: String,
    pub description: String,
    pub icon: String,
    pub unlocked: bool,
    pub unlocked_at: Option<i64>,
    pub xp_reward: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Stem {
    pub id: String,
    pub name: String,
    pub category: String,
    pub file_path: String,
    pub duration: f32,
    pub tempo: i32,
    pub sample_rate: i32,
    pub channels: i32,
    pub color: String,
    pub description: String,
    pub tags: Vec<String>,
    pub level_required: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Song {
    pub id: String,
    pub title: String,
    pub template_name: String,
    pub created_at: i64,
    pub modified_at: i64,
    pub stems: Vec<StemInstance>,
    pub settings: SongSettings,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StemInstance {
    pub stem_id: String,
    pub start_bar: i32,
    pub duration_bars: i32,
    pub volume: f32,
    pub pan: f32,
    pub muted: bool,
    pub effects: EffectSettings,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SongSettings {
    pub tempo: i32,
    pub time_signature: String,
    pub duration: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EffectSettings {
    pub reverb: f32,
    pub delay: f32,
    pub delay_time: i32,
    pub compression: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PlayerStats {
    pub songs_created: i32,
    pub stems_learned: i32,
    pub effects_mastered: i32,
    pub total_playtime_minutes: i32,
    pub favorite_stems: Vec<String>,
    pub total_plays: i32,
}
