# covingtoncards

`covingtoncards.com` — house rules for the poker games (plus Euchre) one
Covington, Kentucky home game plays. A static site, no backend, no accounts.

## Structure

```
src/
  data/games.json     Game content: names, families, summaries, and each
                       game's rules detail (see "Content status" below)
  styles/site.css      All styling (felt/leather/brass "card room" theme)
  scripts/site.js       "Shuffle up & deal" picker + smart back button
build.mjs               Zero-dependency Node build script -> dist/
dist/                   Build output (gitignored, generated)
design_handoff_covington_cards/   Design reference bundle — not build input
```

Design source of truth: `design_handoff_covington_cards/README.md`
(options `2a` index / `3a` game screen). `src/data/games.json` is a copy of
the handoff data file, now owned by the site rather than the design bundle.

## Build

```
node build.mjs
```

Reads `src/data/games.json`, renders `dist/index.html` plus one
`dist/games/<slug>/index.html` per game, and copies `assets/`. No
dependencies, no npm install required — Node 20+ only.

## Local preview

```
node build.mjs && npx serve dist    # or: python3 -m http.server -d dist
```

All links are relative, so the site works whether it's served from the
domain root or a subpath (e.g. GitHub Pages' default
`https://<user>.github.io/covingtoncards/` before the custom domain is wired
up).

## Deploy

`.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages
via `actions/deploy-pages` on every push to `main`. One-time manual step:
in the repo's Settings → Pages, set **Source** to "GitHub Actions".

The build writes `dist/CNAME` (`covingtoncards.com`) itself, since a custom
Actions workflow — unlike GitHub's built-in Jekyll/Pages build — doesn't
manage that file automatically.

## DNS (`terraform/`)

`covingtoncards.com` is registered in Route 53. `terraform/` points the
apex and `www` at GitHub Pages:

- apex → GitHub Pages' fixed A/AAAA records (no ALIAS/ANAME support there)
- `www` → CNAME to `lenhofr.github.io.`

```
cd terraform
terraform init
terraform apply
```

Uses the same shared remote-state bucket as the other static sites
(`tf-state-common-217354297026-us-east-1`, key `covingtoncards/terraform.tfstate`).
Assumes the hosted zone already exists (Route 53 creates it automatically
when you register a domain through it) — nothing to import.

**Still manual** (no Terraform resource for it against the GitHub Pages
API/AWS provider): in the repo's Settings → Pages, set **Custom domain** to
`covingtoncards.com` and, once DNS has propagated and GitHub issues the
cert, check **Enforce HTTPS**.

## Content status

Every game now has a `detail` object (stats, deal steps, house notes).
**Krogering**'s is from the design handoff; the rest are standard rules for
each game, written to match its index summary. All of it is still draft —
verify against how the table actually plays and edit `games.json` to match.
**Beat Charlie** in particular isn't a widely documented game, so its rules
are a best guess from the summary.

**Euchre** is the one non-poker game: filed under "Table game" (♣) with a
proposed `J` corner index for the right bower. Games without a `detail`
object still fall back to a "Full house rules ... are coming soon"
placeholder.
