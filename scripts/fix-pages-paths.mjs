import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const basePath = '/Medicore_rn';
const htmlPath = join(process.cwd(), 'dist', 'index.html');
const jsDir = join(process.cwd(), 'dist', '_expo', 'static', 'js', 'web');

if (!existsSync(htmlPath)) {
  console.error('dist/index.html not found. Run expo export first.');
  process.exit(1);
}

const normalizeRootPrefix = (content) =>
  content
    .replaceAll(`${basePath}/_expo/`, '/_expo/')
    .replaceAll(`${basePath}/assets/`, '/assets/')
    .replaceAll(`${basePath}/favicon.ico`, '/favicon.ico');

const html = readFileSync(htmlPath, 'utf8');

const normalizedHtml = normalizeRootPrefix(html);
const withBase = normalizedHtml
  .replaceAll('href="/_expo/', `href="${basePath}/_expo/`)
  .replaceAll('src="/_expo/', `src="${basePath}/_expo/`)
  .replaceAll('href="/assets/', `href="${basePath}/assets/`)
  .replaceAll('src="/assets/', `src="${basePath}/assets/`)
  .replaceAll('href="/favicon.ico', `href="${basePath}/favicon.ico`)
  .replaceAll('src="/favicon.ico', `src="${basePath}/favicon.ico`);

writeFileSync(htmlPath, withBase, 'utf8');

if (existsSync(jsDir)) {
  const jsFiles = readdirSync(jsDir).filter((file) => file.endsWith('.js'));
  for (const jsFile of jsFiles) {
    const jsPath = join(jsDir, jsFile);
    const jsContent = readFileSync(jsPath, 'utf8');
    const normalizedJs = normalizeRootPrefix(jsContent);
    const patchedJs = normalizedJs
      .replaceAll('"/assets/', `"${basePath}/assets/`)
      .replaceAll("'/assets/", `'${basePath}/assets/`)
      .replaceAll('(/assets/', `(${basePath}/assets/`);

    writeFileSync(jsPath, patchedJs, 'utf8');
  }
}

console.log('Patched dist web paths for GitHub Pages base path:', basePath);
