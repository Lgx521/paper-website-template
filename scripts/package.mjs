import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
await import('./build.mjs');
await import('./check.mjs');
const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(dist);
for (const file of ['index.html', 'styles.css', 'main.js', 'citation.bib', '.nojekyll', 'assets']) {
  await cp(path.join(root, file), path.join(dist, file), { recursive: true });
}
console.log('Packaged the public site into dist/.');
