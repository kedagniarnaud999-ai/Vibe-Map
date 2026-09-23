/**
 * Controle de couverture de la traduction anglaise.
 *
 * La cle d'une entree est la chaine francaise ecrite dans le composant, donc un
 * `t('...')` sans entree correspondante rend silencieusement du francais dans une
 * interface anglaise. Ce script rend cette dette comptable.
 *
 *   node scripts/check-i18n.mjs            -> liste les trous, sort toujours en 0
 *   node scripts/check-i18n.mjs --strict   -> sort en 1 s'il reste un trou
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src');
const STRICT = process.argv.includes('--strict');

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.tsx?$/.test(entry)) yield full;
  }
}

/**
 * Encodage double : un fichier UTF-8 relu comme latin1 puis re-ecrit en UTF-8
 * remplace chaque accent par deux caracteres illisibles. Le texte affiche ne
 * ressemble plus a rien et la cle ne correspond plus a aucune entree anglaise.
 * Ni tsc ni la couverture de traduction ne le voyaient : le badge de
 * demonstration a traverse les quatre gates et est parti en production.
 */
const MOJIBAKE = /[\u00c2\u00c3][\u0080-\u00bf]|\u00e2[\u0080-\u009f]/;

function garbledSources() {
  const found = [];
  for (const file of walk(SRC)) {
    const rel = relative(ROOT, file).replaceAll('\\', '/');
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, index) => {
        if (MOJIBAKE.test(line)) found.push(`${rel}:${index + 1} ${line.trim().slice(0, 70)}`);
      });
  }
  return found;
}

/** Les litteraux passes a t() : chaine simple, double, ou template sans interpolation. */
const CALL = /(?<![.\w])t\(\s*('([^'\\\n]|\\.)*'|"([^"\\\n]|\\.)*"|`([^`\\]|\\.)*`)/g;

function unquote(literal) {
  const body = literal.slice(1, -1);
  return body.replace(/\\([\\'"`nrt$])/g, (_, ch) => ({ n: '\n', r: '\r', t: '\t', $: '$' })[ch] ?? ch);
}

const { EN } = await import(pathToFileURL(join(ROOT, 'src/lib/translations-en.ts')).href);
const known = new Set(Object.keys(EN));

const missing = new Map();
const hit = new Set();
const dynamicKeys = [];
let referenced = 0;

for (const file of walk(SRC)) {
  const rel = relative(ROOT, file).replaceAll('\\', '/');
  if (rel === 'src/lib/translations-en.ts') continue;
  const text = readFileSync(file, 'utf8');

  text.split('\n').forEach((line, index) => {
    const where = `${rel}:${index + 1}`;

    const dynamic = line.match(/(?<![.\w])t\(\s*(`[^`]*\$\{[^`]*`)/);
    if (dynamic) {
      dynamicKeys.push(`${where} ${dynamic[1]}`);
      return;
    }

    for (const match of line.matchAll(CALL)) {
      const key = unquote(match[1]);
      referenced += 1;
      if (known.has(key)) {
        hit.add(key);
      } else {
        const list = missing.get(key) ?? [];
        list.push(where);
        missing.set(key, list);
      }
    }
  });
}

const unused = [...known].filter((key) => !hit.has(key));

console.log(`t() references : ${referenced}`);
console.log(`entrees EN : ${known.size}`);

if (missing.size) {
  console.log(`\nSans traduction anglaise (${missing.size}) :`);
  for (const [key, where] of missing) {
    console.log(`  ${JSON.stringify(key)}  ${where.join(', ')}`);
  }
} else {
  console.log('\nToutes les chaines referencees ont une entree anglaise.');
}

if (dynamicKeys.length) {
  console.log(`\nCles construites a verifier a la main (${dynamicKeys.length}) :`);
  for (const entry of dynamicKeys) console.log(`  ${entry}`);
}

if (unused.length) {
  console.log(`\nEntrees anglaises jamais referencees (${unused.length}) :`);
  for (const key of unused) console.log(`  ${JSON.stringify(key)}`);
}

if (STRICT && missing.size) {
  console.error(`\n${missing.size} chaine(s) sans traduction anglaise en mode strict.`);
  process.exit(1);
}

// Un source double-encode n'est pas une dette de traduction : le texte est casse
// a l'ecran, en francais comme en anglais. Bloquant, meme hors mode strict.
const garbled = garbledSources();
if (garbled.length) {
  console.error(`\nEncodage double dans les sources (${garbled.length}) :`);
  for (const entry of garbled) console.error(`  ${entry}`);
  process.exit(1);
}
