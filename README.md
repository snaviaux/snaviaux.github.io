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

## Development

The committed pages are the live source of truth. The site has no build step: make changes in a dedicated worktree based on `origin/master`, then validate the exact files that will be published.

Start a local server from the repository root:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/` and check both `/` and `/builds/` at 390px and 1440px. Verify the mobile navigation, build partials, contact anchor, console health, touch targets, and horizontal overflow.

Before publishing, run the lightweight repository checks:

```bash
git diff --check
node --check assets/contact-form.js
node --check assets/site-ui.js
node --check assets/builds-ui.js
jq empty DESIGN.json
```

When Umami is upgraded in home-ops, regenerate the `integrity` value in `index.html`, `builds/index.html`, and `404.html`; tracking stops if the hash no longer matches:

```bash
curl -s https://umami.naviauxlab.com/script.js | openssl dgst -sha384 -binary | openssl base64 -A
```

## Deployment

GitHub Pages publishes the repository root from `master`. Merging to `master` triggers the `pages-build-deployment` workflow and deploys [www.stevennaviaux.com](https://www.stevennaviaux.com/). `CNAME` pins the custom domain, and `.nojekyll` ensures the static files are served as committed.

After deployment, confirm that the Pages workflow succeeded for the merge commit, then verify `/`, `/builds/`, both social-card images, and the custom 404 on the production domain.
