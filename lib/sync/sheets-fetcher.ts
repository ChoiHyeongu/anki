/**
 * Google Sheets Fetcher
 * Fetch CSV data from published Google Sheets
 */

import { SYNC_CONFIG, getSheetCsvUrl } from '@/constants/sync-config';
import { parseCSV } from './csv-parser';
import type { RawDeckRow, RawCardRow } from './types';

/**
 * Fetch with timeout support
 * @param url - URL to fetch
 * @param timeoutMs - Timeout in milliseconds
 * @returns Response text
 * @throws Error on timeout or network failure
 */
export async function fetchWithTimeout(
  url: string,
  timeoutMs: number
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch decks from Google Sheets (metadata sheet)
 * @returns Array of raw deck rows
 */
export async function fetchDecksCSV(): Promise<RawDeckRow[]> {
  const url = getSheetCsvUrl(SYNC_CONFIG.spreadsheetId, SYNC_CONFIG.decksGid);
  const csv = await fetchWithTimeout(url, SYNC_CONFIG.timeoutMs);
  return parseCSV<RawDeckRow>(csv);
}

/**
 * Fetch cards from all card sheets (multiple chapters)
 * @returns Array of raw card rows from all sheets
 */
export async function fetchCardsCSV(): Promise<RawCardRow[]> {
  const allCards: RawCardRow[] = [];

  // Fetch all card sheets in parallel
  const fetchPromises = SYNC_CONFIG.cardSheetGids.map(async (gid) => {
    const url = getSheetCsvUrl(SYNC_CONFIG.spreadsheetId, gid);
    const csv = await fetchWithTimeout(url, SYNC_CONFIG.timeoutMs);
    return parseCSV<RawCardRow>(csv);
  });

  const results = await Promise.all(fetchPromises);

  // Combine all cards
  for (const cards of results) {
    allCards.push(...cards);
  }

  return allCards;
}
