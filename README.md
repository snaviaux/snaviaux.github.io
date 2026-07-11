# StevenNaviaux.com

Portfolio site for Steven Naviaux: systems engineering across identity, cloud infrastructure, and the operational layer of AI. Plain HTML, CSS, and JavaScript with no build step, served by GitHub Pages.

Live at [www.stevennaviaux.com](https://www.stevennaviaux.com/).

## Pages

- `index.html` - portfolio homepage: living topology hero, failure drill, vitals counters, footprint map, contact form.
- `builds/index.html` - selected builds: four case studies with outcome lines.
- `404.html` - incident-report style 404 page; GitHub Pages serves it on every missing path.

## Assets

- `assets/favicon.svg` - SN mark favicon, linked on every page.
- `assets/headshot.png` - self-hosted headshot used by social link cards.
- `assets/lab-*.png` - lab screenshots used on the project cards.
- `assets/contact-form.js` - lead-form handler; posts to Formspree and degrades to a plain notice if the endpoint is unavailable.

## Workflow

Pages are authored in a local `_review/` working area that is intentionally not committed. Edit the drafts there, run `scripts/promote-review.sh` (it asserts expected copy, strips review markers, rewrites canonical URLs, and refuses to ship placeholders under `PROMOTE_STRICT=1`), review the diff, then commit the promoted pages.

`CNAME` pins the GitHub Pages custom domain; `.nojekyll` disables Jekyll so files are served exactly as committed.

## Local preview

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/`.
