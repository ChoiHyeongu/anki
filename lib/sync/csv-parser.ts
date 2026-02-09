/**
 * CSV Parser
 * Simple CSV parsing without external dependencies
 */

/**
 * Parse a CSV line handling quoted values with commas
 * @param line - Single CSV line
 * @returns Array of values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      // Check for escaped quote ("")
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());

  return values;
}

/**
 * Parse CSV string into array of objects
 * @param csv - Raw CSV string
 * @returns Array of parsed objects with headers as keys
 */
export function parseCSV<T extends Record<string, string>>(csv: string): T[] {
  const lines = csv.trim().split('\n');

  if (lines.length === 0) {
    return [];
  }

  // Parse header row
  const headers = parseCSVLine(lines[0]);

  // Parse data rows
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);

    const obj = {} as T;
    headers.forEach((header, index) => {
      (obj as Record<string, string>)[header] = values[index] || '';
    });

    return obj;
  });
}
