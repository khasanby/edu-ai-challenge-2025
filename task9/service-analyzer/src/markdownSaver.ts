import * as fs from 'fs';
import * as path from 'path';

export function saveMarkdownReport(content: string, filename = 'last_report.md'): string {
  const filePath = path.resolve(process.cwd(), filename);
  fs.writeFileSync(filePath, content, 'utf-8');
  return filePath;
} 