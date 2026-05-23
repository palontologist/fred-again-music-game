use serde::Serialize;
use crate::models::Achievement;

#[derive(Serialize)]
pub struct CommandResponse<T: Serialize> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}

#[tauri::command]
pub fn list_achievements() -> CommandResponse<Vec<Achievement>> {
    let achievements = vec![
        Achievement {
            id: "first_song".to_string(),
            title: "First Song".to_string(),
            description: "Create your first song".to_string(),
            icon: "🎵".to_string(),
            unlocked: false,
            unlocked_at: None,
            xp_reward: 50,
        },
        Achievement {
            id: "layer_master".to_string(),
            title: "Layer Master".to_string(),
            description: "Use 5+ stems in a single song".to_string(),
            icon: "🎚️".to_string(),
            unlocked: false,
            unlocked_at: None,
            xp_reward: 100,
        },
        Achievement {
            id: "effect_wizard".to_string(),
            title: "Effect Wizard".to_string(),
            description: "Use 3 effects simultaneously".to_string(),
            icon: "✨".to_string(),
            unlocked: false,
            unlocked_at: None,
            xp_reward: 75,
        },
    ];

    CommandResponse {
        success: true,
        data: Some(achievements),
        error: None,
    }
}

#[tauri::command]
pub fn unlock_achievement(achievement_id: String) -> CommandResponse<Achievement> {
    let achievement = Achievement {
        id: achievement_id,
        title: "Achievement".to_string(),
        description: "Unlocked!".to_string(),
        icon: "🏆".to_string(),
        unlocked: true,
        unlocked_at: Some(chrono::Utc::now().timestamp()),
        xp_reward: 50,
    };

    CommandResponse {
        success: true,
        data: Some(achievement),
        error: None,
    }
}

#[tauri::command]
pub fn get_player_achievements() -> CommandResponse<Vec<Achievement>> {
    let achievements = vec![];

    CommandResponse {
        success: true,
        data: Some(achievements),
        error: None,
    }
}
