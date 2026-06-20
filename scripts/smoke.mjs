import { readFileSync } from 'node:fs';

const files = [
  'package.json',
  'apps/web/package.json',
  'apps/api/package.json',
  'packages/shared/package.json',
  '.env.example'
];

for (const file of files) {
  const content = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  if (!content.trim()) {
    throw new Error(`${file} is empty`);
  }
}

console.log('Smoke check passed: baseline project files exist.');
