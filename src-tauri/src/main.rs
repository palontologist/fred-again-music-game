use tauri::Manager;

mod commands;
mod db;
mod models;
mod error;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            // Player progression commands
            commands::player::get_player_progress,
            commands::player::update_player_xp,
            commands::player::get_player_stats,
            commands::player::initialize_player,
            // Achievement commands
            commands::achievements::list_achievements,
            commands::achievements::unlock_achievement,
            commands::achievements::get_player_achievements,
            // Stem loading commands
            commands::stems::list_stems,
            commands::stems::load_stem,
            commands::stems::get_stems_for_level,
            // Song management
            commands::songs::create_song,
            commands::songs::save_song,
            commands::songs::load_song,
            commands::songs::list_songs,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
