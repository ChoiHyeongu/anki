/**
 * Database module - expo-sqlite initialization and instance management
 */
import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'anki.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Get the database instance (singleton)
 * Opens the database if not already open
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);
    // Enable foreign keys
    await dbInstance.execAsync('PRAGMA foreign_keys = ON;');
  }
  return dbInstance;
}

/**
 * Get database synchronously (for use after initialization)
 * Throws if database hasn't been initialized
 */
export function getDatabaseSync(): SQLite.SQLiteDatabase {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return dbInstance;
}

/**
 * Initialize the database with schema and seed data
 * Should be called once at app startup
 */
export async function initializeDatabase(): Promise<void> {
  const db = await getDatabase();

  // Import and run schema creation
  const { createTables } = await import('./schema');
  await createTables(db);

  // Seed initial data if needed
  const { seedDatabase } = await import('./seed');
  await seedDatabase();

  console.log('[DB] Database initialized successfully');
}

/**
 * Close the database connection
 * Call this when the app is closing
 */
export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
    console.log('[DB] Database closed');
  }
}

/**
 * Reset database (for development/testing)
 * Drops all tables and recreates them
 */
export async function resetDatabase(): Promise<void> {
  const db = await getDatabase();

  await db.execAsync(`
    DROP TABLE IF EXISTS review_logs;
    DROP TABLE IF EXISTS card_progress;
    DROP TABLE IF EXISTS cards;
    DROP TABLE IF EXISTS decks;
    DROP TABLE IF EXISTS settings;
  `);

  const { createTables } = await import('./schema');
  await createTables(db);

  console.log('[DB] Database reset complete');
}

// Re-export types
export type { SQLiteDatabase } from 'expo-sqlite';

// Re-export from submodules for convenience
export * from './types';
export * from './repositories';
export * from './services';
export { seedDatabase, forceSeedDatabase, isDatabaseSeeded } from './seed';

// Re-export provider
export { DatabaseProvider, useDatabaseContext, useIsDatabaseReady } from './provider';
