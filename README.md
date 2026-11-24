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

## Admin page (new)

Upload `admin.html`, `certs.json`, and the new `index.html` (it now reads certificates from `certs.json`). Open `https://asuf10ppy.github.io/admin.html` (it is not linked from the site).

Create the token once: GitHub > Settings > Developer settings > Personal access tokens > Fine-grained tokens > Generate new token. Repository access: **Only select repositories** > `asuf10ppy.github.io`. Permissions > Repository permissions > **Contents: Read and write**. Expiration: 90 days. Paste it into the admin page. Turn on two-factor authentication on your GitHub account.

It edits skills, club contributions and certificates (with image upload), plus raw JSON for those three files. Changes go live about a minute after you press Save.

## Round 1: project pages, animations (new)

Upload: `index.html` (replace), `project.html`, `project.js`, `projects.json`, `motion.css`, `motion.js`, and the updated `ecell.html`, `genesys.html`, `cicada.html`, `admin.html`. **Delete `projects.js` from the repo** (projects now live in `projects.json`).

**Add a YouTube video to a project:** open `projects.json`, find the project, and put the link inside its `"videos": []` list, for example `"videos": ["https://youtu.be/XXXXXXXXXXX"]`. Add a repo or other link with `"links": [{"text": "GitHub repo", "url": "https://github.com/..."}]`.
