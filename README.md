# SimpleEnglish / Frog English Subject Drill 500

Manual upload package for GitHub Pages.

## Upload

Upload every file in this folder to the repository root:

- `index.html`
- `manifest.webmanifest`
- `sw.js`
- `icon.png`
- `icon-192.png`
- `icon-512.png`
- `apple-touch-icon.png`
- `.nojekyll`

Then set GitHub Pages to:

- Source: Deploy from a branch
- Branch: `main`
- Folder: `/ (root)`

No build step is required. The app is a static single-page HTML app.

## Notes

- The 500 drill items are embedded in `index.html`.
- Voice playback depends on the voices installed in the browser/device.
- `sw.js` uses a new cache name and network-first behaviour to avoid old cached versions remaining stuck.
