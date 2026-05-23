use std::sync::Arc;
use tokio::sync::Mutex;

pub struct Database {
    // Placeholder for actual database implementation
    // Will be initialized with SQLite in next phase
    _initialized: Arc<Mutex<bool>>,
}

impl Database {
    pub fn new() -> Self {
        Database {
            _initialized: Arc::new(Mutex::new(false)),
        }
    }
}

impl Clone for Database {
    fn clone(&self) -> Self {
        Database {
            _initialized: Arc::clone(&self._initialized),
        }
    }
}
