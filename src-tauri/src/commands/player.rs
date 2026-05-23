use serde::Serialize;
use crate::models::PlayerProgress;
use uuid::Uuid;

#[derive(Serialize)]
pub struct CommandResponse<T: Serialize> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}

#[tauri::command]
pub fn get_player_progress() -> CommandResponse<PlayerProgress> {
    // TODO: Fetch from database
    let player = PlayerProgress {
        id: Uuid::new_v4().to_string(),
        level: 1,
        xp: 0,
        xp_to_next_level: 100,
        songs_created: 0,
        stems_learned: 0,
        effects_mastered: 0,
        total_playtime_minutes: 0,
        created_at: chrono::Utc::now().timestamp(),
        last_played: chrono::Utc::now().timestamp(),
    };

    CommandResponse {
        success: true,
        data: Some(player),
        error: None,
    }
}

#[tauri::command]
pub fn update_player_xp(xp_earned: i32) -> CommandResponse<PlayerProgress> {
    // TODO: Update XP in database and calculate level up
    let player = PlayerProgress {
        id: Uuid::new_v4().to_string(),
        level: 1,
        xp: xp_earned,
        xp_to_next_level: 100 - xp_earned,
        songs_created: 0,
        stems_learned: 0,
        effects_mastered: 0,
        total_playtime_minutes: 0,
        created_at: chrono::Utc::now().timestamp(),
        last_played: chrono::Utc::now().timestamp(),
    };

    CommandResponse {
        success: true,
        data: Some(player),
        error: None,
    }
}

#[tauri::command]
pub fn get_player_stats() -> CommandResponse<crate::models::PlayerStats> {
    // TODO: Fetch from database
    let stats = crate::models::PlayerStats {
        songs_created: 0,
        stems_learned: 0,
        effects_mastered: 0,
        total_playtime_minutes: 0,
        favorite_stems: vec![],
        total_plays: 0,
    };

    CommandResponse {
        success: true,
        data: Some(stats),
        error: None,
    }
}

#[tauri::command]
pub fn initialize_player() -> CommandResponse<PlayerProgress> {
    // TODO: Create new player in database
    let player = PlayerProgress {
        id: Uuid::new_v4().to_string(),
        level: 1,
        xp: 0,
        xp_to_next_level: 100,
        songs_created: 0,
        stems_learned: 0,
        effects_mastered: 0,
        total_playtime_minutes: 0,
        created_at: chrono::Utc::now().timestamp(),
        last_played: chrono::Utc::now().timestamp(),
    };

    CommandResponse {
        success: true,
        data: Some(player),
        error: None,
    }
}
