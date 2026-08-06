import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const basePath = '/Medicore_rn';
const htmlPath = join(process.cwd(), 'dist', 'index.html');

if (!existsSync(htmlPath)) {
  console.error('dist/index.html not found. Run expo export first.');
  process.exit(1);
}

const html = readFileSync(htmlPath, 'utf8');

const withBase = html
  .replaceAll(`href="${basePath}/`, 'href="/')
  .replaceAll(`src="${basePath}/`, 'src="/')
  .replaceAll('href="/', `href="${basePath}/`)
  .replaceAll('src="/', `src="${basePath}/`);

writeFileSync(htmlPath, withBase, 'utf8');
console.log('Patched dist/index.html for GitHub Pages base path:', basePath);
