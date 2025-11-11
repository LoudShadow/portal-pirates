import { promises as fs } from 'fs';

/**
 * Reads the contents of a text file and returns it as a string.
 * @param filePath - The path to the text file
 * @returns The file contents as a string
 */
export async function readTextFile(filePath: string): Promise<string> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return data;
  } catch (error) {
    console.error(`Error reading file at ${filePath}:`, error);
    throw error;
  }
}
