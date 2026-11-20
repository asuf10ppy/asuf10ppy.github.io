# Deploy guide

1. On GitHub, create a **public** repo named exactly `asuf10ppy.github.io`.
2. Upload everything in this folder, including the hidden `.github` folder (drag the whole folder in, or use git).
3. Repo Settings > Pages > Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Repo Settings > Actions > General > Workflow permissions: **Read and write permissions**.
5. Actions tab > "Update stats" > **Run workflow** once to fill `stats.json`. After that it runs daily.
6. Your site: https://asuf10ppy.github.io. Put it in LinkedIn under Contact info > Website and in your Featured section.

**Photo:** add a square image named `photo.jpg` next to `index.html`. It appears automatically.

**If a stat is wrong or blank** (TryHackMe and LeetCode use unofficial endpoints), set it by hand in `stats.json`, for example:
`"override": {"tryhackme": {"rank": 12345, "rooms": 40}}`
Overrides are re-applied after every daily update.
