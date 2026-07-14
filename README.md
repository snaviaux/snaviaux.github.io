# StevenNaviaux.com

Portfolio site for Steven Naviaux: systems engineering across identity, cloud infrastructure, and the operational layer of AI. Plain HTML, CSS, JavaScript, and a vendored HTMX runtime with no build step, served by GitHub Pages.

Live at [www.stevennaviaux.com](https://www.stevennaviaux.com/).

## Pages

- `index.html` - portfolio homepage: living topology hero, failure drill, vitals counters, footprint map, contact form.
- `builds/index.html` - selected builds: four case studies with outcome lines.
- `404.html` - incident-report style 404 page; GitHub Pages serves it on every missing path.

## Assets

- `assets/favicon.svg` - SN mark favicon, linked on every page.
- `assets/headshot.png` - self-hosted portrait used in the contact section and structured profile data.
- `assets/og-home.png` and `assets/og-builds.png` - page-specific 1200 × 630 social cards; the matching `*-source.svg` files are their editable sources.
- `assets/lab-*.png` - lab screenshots used on the project cards.
- `assets/contact-form.js` - lead-form handler; posts to Formspree and degrades to a plain notice if the endpoint is unavailable.
- `assets/ux-fixes.css` - shared responsive navigation, touch-target, and build-chooser styles using the pages' existing CSS variables.
- `assets/site-ui.js` - progressive mobile navigation and current-location behavior.
- `assets/builds-ui.js` - mobile build-partial loading, focus, history, and error recovery.
- `assets/htmx.min.js` - vendored HTMX runtime; its license is retained in `assets/htmx.LICENSE`.
- `partials/nav/` - path-specific mobile navigation states.
- `partials/builds/` - progressively enhanced case-study fragments; the complete static archive remains in `builds/index.html` for no-JavaScript and recovery paths.

## Product and design context

- `PRODUCT.md` defines the three portfolio audiences, the qualified-conversation conversion goal, brand voice, anti-references, and accessibility target.
- `DESIGN.md` captures the current visual system in the Google Stitch format.
- `DESIGN.json` carries the corresponding shadow, motion, breakpoint, component, and narrative extensions.

## Measurement

All pages load the self-hosted Umami tracker with search-parameter and hash collection disabled. Query strings cannot leak visitor-supplied values into analytics, and section jumps or build-detail swaps do not inflate pageviews. Declarative click events cover profile destinations, Builds entry and selection, field notes, build receipts, and contact entry points. `assets/contact-form.js` records only controlled lifecycle properties for form start and submit outcome; names, email addresses, messages, raw errors, response bodies, and endpoint URLs are never sent to analytics.

The primary funnel is:

1. `builds-open`, `field-note-open`, or `build-receipt-open` establishes evidence engagement.
2. `contact-open` or a LinkedIn `profile-link-click` signals conversation intent.
3. `contact-form-start` and successful `contact-form-submit` measure form completion.

## Workflow

The committed live pages are the source of truth. Make routine changes to them in a dedicated worktree and review the resulting diff.

`_review/` is an optional ignored scratch area from the original launch workflow. `scripts/promote-review.sh` still supports those drafts, but it replaces all three live HTML files. Run it only after synchronizing the drafts with the current live pages; otherwise it will overwrite newer live-file work. The script asserts expected copy, strips review markers, rewrites canonical URLs, and refuses to ship placeholders under `PROMOTE_STRICT=1`.

`CNAME` pins the GitHub Pages custom domain; `.nojekyll` disables Jekyll so files are served exactly as committed.

Analytics runtime: when Umami is upgraded in home-ops, `script.js` changes and the `integrity` hash in all three live pages must be regenerated (`curl -s https://umami.naviauxlab.com/script.js | openssl dgst -sha384 -binary | openssl base64 -A`) or tracking silently stops. Synchronize optional review drafts too if that workflow is still in use.

## Local preview

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/`.
