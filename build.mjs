// Zero-dependency static site build for Covington Cards.
// Reads src/data/games.json and renders the index + one page per game into dist/.
// Run with: node build.mjs

import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, 'src');
const OUT_DIR = join(__dirname, 'dist');

const data = JSON.parse(readFileSync(join(SRC_DIR, 'data/games.json'), 'utf8'));

// GitHub Pages reads this file on every deploy to know the custom domain is
// still wanted; a custom-workflow deploy (ours) has to ship it itself.
const SITE_DOMAIN = 'covingtoncards.com';

const FONT_LINKS = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=Inter:wght@400;500&display=swap">`;

const FAVICON =
  '<link rel="icon" href="data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
      '<rect width="100" height="100" rx="20" fill="#0a1d13"/>' +
      '<text x="50" y="70" font-size="62" text-anchor="middle" fill="#c9a227">&#9824;</text>' +
      '</svg>'
  ) +
  '">';

function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[ch]));
}

function renderHead({ title, description, assetPrefix, bodyClass }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${FAVICON}
  ${FONT_LINKS}
  <link rel="stylesheet" href="${assetPrefix}assets/site.css">
</head>
<body class="${bodyClass}">`;
}

function renderSuitKeyEntry(glyph, colorClass, label) {
  return `<li><span class="suit-glyph on-felt ${colorClass}">&#${glyph};</span> ${esc(label)}</li>`;
}

function renderCornerIndex(game, colorClass, mirrored) {
  // rank || rankProposed per games.json's _rankNote; falls back to the bare suit glyph
  // when neither is set.
  const rankChar = game.rank || game.rankProposed;
  const family = FAMILIES[game.family];
  const mirroredClass = mirrored ? ' card-index--mirrored' : '';
  const rankHtml = rankChar ? `<span class="card-rank">${esc(rankChar)}</span>` : '';
  return `<div class="card-index${mirroredClass} ${colorClass}">${rankHtml}<span class="suit-glyph">${family.suit}</span></div>`;
}

function renderIndex({ games }) {
  const cards = games
    .map((game) => {
      const colorClass = SUIT_BLACK.has(game.family) ? 'suit-black' : 'suit-red';
      const originalClass = game.covingtonOriginal ? ' is-original' : '';
      const titleHtml = game.titleLines.map(esc).join('<br>');
      return `      <a class="game-card${originalClass}" href="games/${game.slug}/">
        ${renderCornerIndex(game, colorClass, false)}
        <div class="card-face">
          <h2 class="card-title">${titleHtml}</h2>
          <div class="card-divider"></div>
          <p class="card-summary">${esc(game.summary)}</p>
          <div class="card-meta">${esc(game.cardMeta)}</div>
        </div>
        ${renderCornerIndex(game, colorClass, true)}
      </a>`;
    })
    .join('\n');

  return `${renderHead({
    title: 'Covington Cards — house poker rules',
    description: 'House rules for the ten poker games one Covington, Kentucky home game plays. Pick one when it’s your deal.',
    assetPrefix: '',
    bodyClass: 'page-index',
  })}
  <main class="felt-surface">
    <header class="index-header">
      <div class="brand">
        <span class="chip" aria-hidden="true"></span>
        <div>
          <p class="kicker">covingtoncards.com</p>
          <h1 class="wordmark">Covington Cards</h1>
        </div>
      </div>
      <ul class="suit-key">
        ${renderSuitKeyEntry('9824', 'suit-black', 'Stud')}
        ${renderSuitKeyEntry('9830', 'suit-red', 'Community cards')}
        ${renderSuitKeyEntry('9829', 'suit-red', 'Down to luck')}
        ${renderSuitKeyEntry('9827', 'suit-black', 'Table game')}
      </ul>
    </header>
    <p class="subhead">Pick one when it's your deal. Most of these were invented within a mile of the river.</p>
    <div class="card-grid">
${cards}
    </div>
  </main>
  <script src="assets/site.js" defer></script>
</body>
</html>
`;
}

function renderStatsOrPlayers(game) {
  const detail = game.detail;
  if (!detail || !detail.stats) {
    return `    <p class="players-line">${esc(game.players)}</p>`;
  }

  const cells = detail.stats
    .map((stat) => {
      const wildClass = stat.label === 'Wild' ? ' stat-wild' : '';
      const valueClass = stat.accent ? ' is-accent' : '';
      return `      <div class="stat-cell${wildClass}">
        <div class="stat-label">${esc(stat.label)}</div>
        <div class="stat-value${valueClass}">${esc(stat.value)}</div>
      </div>`;
    })
    .join('\n');

  return `    <div class="stat-strip">
${cells}
    </div>`;
}

function renderRules(game) {
  const detail = game.detail;
  if (!detail) {
    return `      <p class="rules-pending">Full house rules for ${esc(game.name)} are coming soon.</p>`;
  }

  const steps = detail.deal
    .map((step) => `        <li><span>${esc(step)}</span></li>`)
    .join('\n');

  return `      <h2 class="section-head">The deal</h2>
      <ol class="deal-steps">
${steps}
      </ol>
      <div class="faded-rule"></div>
      <h2 class="section-head">House notes</h2>
      <p class="house-notes">${esc(detail.houseNotes)}</p>`;
}

function renderGame(game) {
  const family = FAMILIES[game.family];
  const colorClass = SUIT_BLACK.has(game.family) ? 'suit-black' : 'suit-red';
  const originalClass = game.covingtonOriginal ? ' is-original' : '';
  const summary = (game.detail && game.detail.summary) || game.summary;
  const alsoCalled = game.alsoCalled
    ? `\n      <p class="hero-alsocalled">${esc(game.alsoCalled)}</p>`
    : '';

  return `${renderHead({
    title: `${game.name} — Covington Cards`,
    description: summary,
    assetPrefix: '../../',
    bodyClass: 'page-game',
  })}
  <div class="game-shell">
    <div class="game-topline"><span>covingtoncards.com</span></div>
    <div class="back-row">
      <a class="back-button" href="../../" data-back aria-label="Back to all games">&#8249;</a>
      <span class="back-label">All games</span>
    </div>

    <article class="hero-card${originalClass}">
      <div class="hero-top">
        <span class="family-label">${esc(game.familyLabel)}</span>
        <span class="suit-glyph on-card ${colorClass}">${family.suit}</span>
      </div>
      <h1 class="hero-title">${esc(game.name)}</h1>${alsoCalled}
      <p class="hero-summary">${esc(summary)}</p>
    </article>

${renderStatsOrPlayers(game)}

    <section class="rules-section">
${renderRules(game)}
    </section>

    <div class="action-bar">
      <button type="button" class="call-button" disabled aria-disabled="true" title="Undecided — coming soon">Call this game</button>
      <button type="button" class="fav-button" data-slug="${esc(game.slug)}" aria-pressed="false" aria-label="Favourite ${esc(game.name)}">&#9829;</button>
    </div>
  </div>
  <script src="../../assets/site.js" defer></script>
</body>
</html>
`;
}

const FAMILIES = data.families;
const SUIT_BLACK = new Set(
  Object.entries(FAMILIES)
    .filter(([, family]) => family.suitColor === '#231a08')
    .map(([key]) => key)
);

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(join(OUT_DIR, 'assets'), { recursive: true });
mkdirSync(join(OUT_DIR, 'games'), { recursive: true });

writeFileSync(join(OUT_DIR, 'index.html'), renderIndex(data));
writeFileSync(join(OUT_DIR, '.nojekyll'), '');
writeFileSync(join(OUT_DIR, 'CNAME'), `${SITE_DOMAIN}\n`);
cpSync(join(SRC_DIR, 'styles/site.css'), join(OUT_DIR, 'assets/site.css'));
cpSync(join(SRC_DIR, 'scripts/site.js'), join(OUT_DIR, 'assets/site.js'));

for (const game of data.games) {
  const gameDir = join(OUT_DIR, 'games', game.slug);
  mkdirSync(gameDir, { recursive: true });
  writeFileSync(join(gameDir, 'index.html'), renderGame(game));
}

console.log(`Built index + ${data.games.length} game pages into dist/`);
