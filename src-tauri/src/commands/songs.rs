use serde::Serialize;

#[derive(Serialize)]
pub struct CommandResponse<T: Serialize> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}

#[tauri::command]
pub fn create_song(title: String, template: String) -> CommandResponse<String> {
    // TODO: Create new song in database
    CommandResponse {
        success: true,
        data: Some(format!("song_{}", uuid::Uuid::new_v4())),
        error: None,
    }
}

#[tauri::command]
pub fn save_song(song_id: String) -> CommandResponse<String> {
    // TODO: Save song to database
    CommandResponse {
        success: true,
        data: Some(song_id),
        error: None,
    }
}

#[tauri::command]
pub fn load_song(song_id: String) -> CommandResponse<String> {
    // TODO: Load song from database
    CommandResponse {
        success: true,
        data: Some(song_id),
        error: None,
    }
}

#[tauri::command]
pub fn list_songs() -> CommandResponse<Vec<Song>> {
    // TODO: List all songs from database
    CommandResponse {
        success: true,
        data: Some(vec![]),
        error: None,
    }
}
