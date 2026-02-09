/**
 * Sync Service
 * Handles synchronization from Google Sheets to local SQLite database
 */

import { SYNC_CONFIG } from '@/constants/sync-config';
import { fetchDecksCSV, fetchCardsCSV } from './sheets-fetcher';
import { upsertDecks } from '@/lib/db/repositories/deck';
import { upsertCards } from '@/lib/db/repositories/card';
import type { SyncResult } from './types';
import type { CreateDeckInput, CreateCardInput } from '@/lib/db/types';

/**
 * Parse synonyms from spreadsheet
 * Handles both formats:
 * - JSON array: ["word1", "word2"]
 * - Comma-separated: word1, word2, word3
 *
 * @param value - Raw synonyms string from CSV
 * @returns Array of synonyms or undefined
 */
function parseSynonyms(value: string): string[] | undefined {
  if (!value || value.trim() === '') {
    return undefined;
  }

  const trimmed = value.trim();

  // Check if it's a JSON array (starts with [ and ends with ])
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((s) => String(s).trim()).filter(Boolean);
      }
    } catch {
      // Fall through to comma-separated parsing
    }
  }

  // Comma-separated format
  return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
}

/**
 * Sync data from Google Spreadsheet to local database
 * - Runs in background (non-blocking)
 * - Preserves existing SRS progress
 * - Fails silently with warning log
 *
 * @returns SyncResult with success status and counts
 */
export async function syncFromSpreadsheet(): Promise<SyncResult> {
  // Skip if sync is disabled
  if (!SYNC_CONFIG.enabled) {
    console.log('[Sync] Sync is disabled');
    return { success: true, decksAdded: 0, cardsAdded: 0 };
  }

  try {
    console.log('[Sync] Starting spreadsheet sync...');

    // Fetch data from Google Sheets (parallel)
    const [rawDecks, rawCards] = await Promise.all([
      fetchDecksCSV(),
      fetchCardsCSV(),
    ]);

    // Transform to CreateInput format
    const decks: CreateDeckInput[] = rawDecks.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
    }));

    // Map snake_case CSV columns to camelCase CreateCardInput
    const cards: CreateCardInput[] = rawCards.map((c) => ({
      id: c.id, // Use ID from spreadsheet
      deckId: c.deck_id,
      frontWord: c.front_word,
      frontPhonetic: c.front_phonetic || undefined,
      backDefinition: c.back_definition,
      backExample: c.back_example || undefined,
      backSynonyms: parseSynonyms(c.back_synonyms),
    }));

    // Upsert to database
    await upsertDecks(decks);
    await upsertCards(cards);

    console.log(`[Sync] Complete: ${decks.length} decks, ${cards.length} cards`);

    return {
      success: true,
      decksAdded: decks.length,
      cardsAdded: cards.length,
    };
  } catch (error) {
    // Fail silently - app continues with cached data
    console.warn('[Sync] Failed, using cached data:', error);

    return {
      success: false,
      decksAdded: 0,
      cardsAdded: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
