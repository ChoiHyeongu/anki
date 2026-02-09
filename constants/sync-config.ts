/**
 * Google Sheets Sync Configuration
 * Configure your spreadsheet details here
 */

export const SYNC_CONFIG = {
  /** Google Spreadsheet ID (from URL) */
  spreadsheetId: '1trLOg6kMliWEGUtb8JxSZhl2lweLIHxYkk6Z7XBZNMw',

  /** GID for metadata (Decks) sheet */
  decksGid: '1686320990',

  /** GIDs for Cards sheets (one per chapter) */
  cardSheetGids: [
    '0',          // Chapter 1
    '340651401',  // Chapter 2
  ],

  /** Network timeout in milliseconds */
  timeoutMs: 5000,

  /** Enable/disable sync (useful for development) */
  enabled: true,
} as const;

/**
 * Generate public CSV export URL for a Google Sheet
 * @param spreadsheetId - The spreadsheet ID from the URL
 * @param gid - The sheet GID (tab identifier)
 * @returns Public CSV URL
 */
export function getSheetCsvUrl(spreadsheetId: string, gid: string): string {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
}
