use serde::Serialize;
use crate::models::Stem;

#[derive(Serialize)]
pub struct CommandResponse<T: Serialize> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}

#[tauri::command]
pub fn list_stems(template: String) -> CommandResponse<Vec<Stem>> {
    // TODO: Load stems from file system
    let stems = vec![];
    CommandResponse {
        success: true,
        data: Some(stems),
        error: None,
    }
}

#[tauri::command]
pub fn load_stem(stem_id: String) -> CommandResponse<Vec<u8>> {
    // TODO: Load stem audio file and return audio data
    CommandResponse {
        success: false,
        data: None,
        error: Some("Not yet implemented".to_string()),
    }
}

#[tauri::command]
pub fn get_stems_for_level(level: i32) -> CommandResponse<Vec<Stem>> {
    // TODO: Return stems that are unlocked for the given level
    let stems = vec![];
    CommandResponse {
        success: true,
        data: Some(stems),
        error: None,
    }
}
