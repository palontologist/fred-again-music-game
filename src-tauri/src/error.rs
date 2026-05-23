use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub enum AppError {
    DatabaseError(String),
    FileNotFound(String),
    InvalidInput(String),
    AudioProcessingError(String),
}

impl std::fmt::Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AppError::DatabaseError(msg) => write!(f, "Database error: {}", msg),
            AppError::FileNotFound(msg) => write!(f, "File not found: {}", msg),
            AppError::InvalidInput(msg) => write!(f, "Invalid input: {}", msg),
            AppError::AudioProcessingError(msg) => write!(f, "Audio processing error: {}", msg),
        }
    }
}

impl std::error::Error for AppError {}
