# Update guide

Upload to the root of the `asuf10ppy.github.io` repo (replace `index.html`):

- `index.html` (replaces the old one)
- `ecell.html`, `genesys.html`, `club.css`, `club.js`, `clubs.json` (club pages)
- `certs/` folder with 4 images (upload the folder's files; GitHub keeps the folder name if you drag the folder in)
- `projects.js`, `skills.json`, `resume.pdf`, `og-image.png` stay as before

Keep `stats.json`, `scripts/` and `.github/` as they are.

**Edit a club page:** open `clubs.json` on GitHub, click the pencil, and add a line to the `did` list of that club (keep quotes and commas).

## Cicada 3301 page (new)

Upload: `cicada.html`, `signal_mini.wav`, `clubs.json` (replaces the old one), and the folder `synergy2026/` (its `index.html` must stay inside that folder). On GitHub use Add file > Create new file and type `synergy2026/index.html` as the name, then paste the contents.

Do NOT upload anything from `author-only/`. The key shown on the puzzle is a new web-only key; to change it, edit the key inside `synergy2026/index.html` and replace `HASH` in `cicada.html` with the SHA-256 of the lowercase key (`echo -n 'cicada3301{...}' | shasum -a 256`).
