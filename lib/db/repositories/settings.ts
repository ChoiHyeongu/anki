/**
 * Settings Repository
 * Handles app settings (key-value store)
 */
import { getDatabase } from '../index';
import type { DbSetting } from '../types';
import { DEFAULT_SETTINGS } from '../schema';

/**
 * Get a setting value
 */
export async function getSetting(key: string): Promise<string | null> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<DbSetting>(
    'SELECT * FROM settings WHERE key = ?',
    [key]
  );
  return result?.value ?? null;
}

/**
 * Get a setting value with default fallback
 */
export async function getSettingWithDefault(
  key: string,
  defaultValue: string
): Promise<string> {
  const value = await getSetting(key);
  return value ?? defaultValue;
}

/**
 * Set a setting value
 */
export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    [key, value]
  );
}

/**
 * Get all settings
 */
export async function getAllSettings(): Promise<Record<string, string>> {
  const db = await getDatabase();
  const results = await db.getAllAsync<DbSetting>('SELECT * FROM settings');

  const settings: Record<string, string> = {};
  for (const row of results) {
    settings[row.key] = row.value;
  }
  return settings;
}

/**
 * Initialize default settings (call on app startup)
 */
export async function initializeSettings(): Promise<void> {
  const db = await getDatabase();
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await db.runAsync(
      'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)',
      [key, value]
    );
  }
}

/**
 * Get daily new card limit
 */
export async function getDailyNewCardLimit(): Promise<number> {
  const value = await getSettingWithDefault('dailyNewCardLimit', '20');
  return parseInt(value, 10);
}

/**
 * Set daily new card limit
 */
export async function setDailyNewCardLimit(limit: number): Promise<void> {
  await setSetting('dailyNewCardLimit', limit.toString());
}

/**
 * Get show answer timer setting
 */
export async function getShowAnswerTimer(): Promise<boolean> {
  const value = await getSettingWithDefault('showAnswerTimer', 'true');
  return value === 'true';
}

/**
 * Get haptic feedback setting
 */
export async function getHapticFeedback(): Promise<boolean> {
  const value = await getSettingWithDefault('hapticFeedback', 'true');
  return value === 'true';
}
