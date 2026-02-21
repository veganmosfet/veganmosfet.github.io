# `x.github.io` placeholder page

This repository is configured as a minimal GitHub Pages site that
automatically redirects visitors to the new blog URL.

## Files

- `index.html`: Auto-redirects to your new blog URL and includes a fallback link.
- `404.html`: Redirects old deep links to the new domain while preserving path/query/hash.
- `.nojekyll`: Ensures GitHub Pages serves this as plain static files.

## Publish

1. If needed, change `https://veganmosfet.codeberg.page/` in `index.html` and `404.html`.
2. Push to the `main` branch of your `x.github.io` repository.
3. GitHub Pages will publish this page at `https://x.github.io/`.
