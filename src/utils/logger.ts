import fs from 'node:fs';

const LOG_FILE = 'updates.log';

export function logUpdate(message: string): void {
  const timestamp = new Date().toLocaleString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  try {
    fs.appendFileSync(LOG_FILE, logEntry);
    console.log('✅ Update logged successfully');
  } catch (error) {
    console.error('Error writing to log file:', error);
  }
}

export function getLatestUpdates(count: number = 10): string[] {
  try {
    if (!fs.existsSync(LOG_FILE)) {
      return ['No updates logged yet'];
    }
    
    const content = fs.readFileSync(LOG_FILE, 'utf-8');
    return content.split('\n')
      .filter(line => line.trim())
      .slice(-count);
  } catch (error) {
    console.error('Error reading log file:', error);
    return ['Error reading updates'];
  }
}

// Log initial creation of the log file
logUpdate('Update logging system initialized');