/**
 * Database schema definitions
 * All tables use TEXT for IDs (UUID format) and INTEGER for timestamps (Unix ms)
 */
import type { SQLiteDatabase } from 'expo-sqlite';

/**
 * Create all database tables
 */
export async function createTables(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    -- Decks table (read-only, pre-loaded)
    CREATE TABLE IF NOT EXISTS decks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
    );

    -- Cards table (user can add)
    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      deck_id TEXT NOT NULL,
      front_word TEXT NOT NULL,
      front_phonetic TEXT,
      back_definition TEXT NOT NULL,
      back_example TEXT,
      back_synonyms TEXT,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
      FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
    );

    -- Card SRS progress (maps to CardState from lib/srs)
    CREATE TABLE IF NOT EXISTS card_progress (
      card_id TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'new',
      interval REAL NOT NULL DEFAULT 0,
      ease REAL NOT NULL DEFAULT 2.5,
      due_date INTEGER NOT NULL,
      learning_step INTEGER NOT NULL DEFAULT 0,
      lapse_count INTEGER NOT NULL DEFAULT 0,
      review_count INTEGER NOT NULL DEFAULT 0,
      last_reviewed_at INTEGER,
      FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
    );

    -- Review logs for undo and statistics
    CREATE TABLE IF NOT EXISTS review_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      card_id TEXT NOT NULL,
      rating INTEGER NOT NULL,
      reviewed_at INTEGER NOT NULL,
      time_taken_ms INTEGER,
      prev_state TEXT,
      FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
    );

    -- App settings (key-value store)
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_cards_deck_id ON cards(deck_id);
    CREATE INDEX IF NOT EXISTS idx_card_progress_status ON card_progress(status);
    CREATE INDEX IF NOT EXISTS idx_card_progress_due_date ON card_progress(due_date);
    CREATE INDEX IF NOT EXISTS idx_review_logs_card_id ON review_logs(card_id);
    CREATE INDEX IF NOT EXISTS idx_review_logs_reviewed_at ON review_logs(reviewed_at);
  `);
}

/**
 * Default settings to initialize
 */
export const DEFAULT_SETTINGS: Record<string, string> = {
  dailyNewCardLimit: '20',
  showAnswerTimer: 'true',
  hapticFeedback: 'true',
};

/**
 * Insert default settings if not exists
 */
export async function initializeDefaultSettings(db: SQLiteDatabase): Promise<void> {
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await db.runAsync(
      'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)',
      [key, value]
    );
  }
}
