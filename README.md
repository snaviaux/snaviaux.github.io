# StevenNaviaux.com

Static GitHub Pages site for `www.stevennaviaux.com`.

## Files

- `index.html` - portfolio homepage: living topology hero, failure drill, vitals counters, footprint map, contact form.
- `builds/index.html` - selected builds: four case studies with outcome lines.
- `404.html` - incident-report style 404 page; GitHub Pages serves it on every missing path.
- `assets/favicon.svg` - SN mark favicon, linked on every page.
- `assets/headshot.png` - self-hosted headshot used by social link cards.
- `assets/lab-*.png` - lab screenshots used on the project cards.
- `assets/contact-form.js` - static lead-form handler with a configurable backend endpoint.
- `scripts/promote-review.sh` - promotes the local review drafts to the public pages and fails loudly if any review marker survives.
- `.nojekyll` - serves static files directly.

## Editing

Pages are authored in a local `_review/` working area that is intentionally not committed. Edit the drafts there, run `scripts/promote-review.sh`, review the diff, then commit the promoted pages.

## Preview

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/`.
