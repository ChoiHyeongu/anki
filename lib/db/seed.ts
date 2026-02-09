/**
 * Database Seed Data
 * Initialize default settings on first run
 */
import { initializeSettings, getSettings } from './repositories/settings';

/**
 * Check if database has been initialized
 */
export async function isDatabaseSeeded(): Promise<boolean> {
  const settings = await getSettings();
  return settings !== null;
}

/**
 * Initialize the database with default settings
 * Only runs if database hasn't been initialized yet
 */
export async function seedDatabase(): Promise<void> {
  const alreadySeeded = await isDatabaseSeeded();
  if (alreadySeeded) {
    return;
  }

  console.log('[DB] Initializing database settings...');
  await initializeSettings();
  console.log('[DB] Database initialization complete');
}

/**
 * Force reinitialize the database (for development)
 * Warning: This will reset all data!
 */
export async function forceSeedDatabase(): Promise<void> {
  const { resetDatabase } = await import('./index');
  await resetDatabase();
  await seedDatabase();
}
