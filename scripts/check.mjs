// Structural checks for the generated site; no third-party packages required.
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
if (ids.length !== new Set(ids).size) throw new Error('Duplicate HTML ids.');
if ((html.match(/<h1>/g) || []).length !== 1) throw new Error('Expected one page heading.');
const files = new Set();
for (const [, raw] of html.matchAll(/\b(?:src|href|poster)="([^"]+)"/g)) {
  const value = raw.replaceAll('&amp;', '&');
  if (/^(?:https?:|mailto:|data:)/.test(value)) continue;
  if (value.startsWith('#')) {
    if (!ids.includes(value.slice(1))) throw new Error(`Broken anchor: ${value}`);
    continue;
  }
  const target = value.split(/[?#]/)[0];
  if (target) files.add(target);
}
for (const file of files) await access(path.join(root, file));
for (const [, attrs] of html.matchAll(/<img\b([^>]+)>/g)) {
  if (!/\balt="[^"]+"/.test(attrs)) throw new Error('Image is missing meaningful alt text.');
}
for (const [, attrs] of html.matchAll(/<a\b([^>]+)>/g)) {
  if (/target="_blank"/.test(attrs) && !/rel="noopener noreferrer"/.test(attrs)) throw new Error('External new-tab link needs rel attributes.');
}
console.log(`Validated ${files.size} local files, ${ids.length} anchors, image descriptions, and external links.`);
