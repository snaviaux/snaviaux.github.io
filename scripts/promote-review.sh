#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

python3 - "$ROOT" <<'PY'
from pathlib import Path
import os
import re
import sys

STRICT = os.environ.get("PROMOTE_STRICT") == "1"

root = Path(sys.argv[1])
source = root / "_review" / "index.html"
target = root / "index.html"
builds_source = root / "_review" / "builds" / "index.html"
builds_target = root / "builds" / "index.html"


def fail(message: str) -> None:
    sys.exit(f"PROMOTION FAILED: {message}")


def strip_review_only(html: str, label: str) -> str:
    if "REVIEW_ONLY_START" not in html:
        fail(f"{label}: expected REVIEW_ONLY block not found")
    html = re.sub(
        r"\n\s*<!-- REVIEW_ONLY_START -->.*?<!-- REVIEW_ONLY_END -->\n",
        "\n",
        html,
        flags=re.DOTALL,
    )
    if "REVIEW_ONLY" in html:
        fail(f"{label}: REVIEW_ONLY markers survived stripping")
    return html


def apply_replacements(html: str, replacements: dict, label: str) -> str:
    for old, new in replacements.items():
        if old not in html:
            fail(f"{label}: expected string not found (copy drifted?): {old[:90]}")
        html = html.replace(old, new)
    return html


def validate_live(html: str, label: str, forbidden: list) -> None:
    leftovers = [needle for needle in forbidden if needle in html]
    if leftovers:
        fail(f"{label}: review markers survived promotion: {leftovers}")


html = strip_review_only(source.read_text(encoding="utf-8"), "index")

replacements = {
    '<meta name="robots" content="noindex,nofollow">': '<meta name="robots" content="index,follow">',
    "<title>[Review] Steven Naviaux | Systems Craft</title>": "<title>Steven Naviaux | Systems Craft</title>",
    'content="[Review] Steven Naviaux | Systems Craft"': 'content="Steven Naviaux | Systems Craft"',
    'content="Draft review copy for Steven Naviaux\'s creative systems portfolio."': 'content="Steven Naviaux is a systems engineer focused on identity, cloud infrastructure, and the operational layer of AI deployment: governance, cost discipline, observability, and agent operations."',
    'class="portfolio-page review-mode" data-site-state="review"': 'class="portfolio-page live-mode" data-site-state="live"',
    "<p>This page is a draft review artifact until approved for launch.</p>": "<p>Systems craft for identity, cloud, platform, and AI infrastructure.</p>",
}

html = apply_replacements(html, replacements, "index")

html = html.replace("https://www.stevennaviaux.com/_review/", "https://www.stevennaviaux.com/")
html = html.replace("../assets/", "assets/")
html = html.replace('href="builds/index.html"', 'href="builds/"')

validate_live(
    html,
    "index",
    [
        "noindex",
        "[Review]",
        "REVIEW_ONLY",
        "_review",
        "../assets/",
        "review-ribbon",
        'data-site-state="review"',
        "index.html",
    ],
)

if "REPLACE_WITH_FORM_ID" in html:
    msg = "index still contains REPLACE_WITH_FORM_ID; the contact form will be live but disabled"
    if STRICT:
        fail(msg + " (run without PROMOTE_STRICT=1 for an intentional dry run)")
    print(f"WARNING: {msg}")

target.write_text(html, encoding="utf-8")
print(f"Promoted {source.relative_to(root)} to {target.relative_to(root)}")

builds_html = strip_review_only(builds_source.read_text(encoding="utf-8"), "builds")

builds_replacements = {
    '<meta name="robots" content="noindex,nofollow">': '<meta name="robots" content="index,follow">',
    "<title>[Review] Steven Naviaux | Selected Builds</title>": "<title>Steven Naviaux | Selected Builds</title>",
    'content="[Review] Steven Naviaux | Selected Builds"': 'content="Steven Naviaux | Selected Builds"',
    'content="Draft review copy for selected independent infrastructure and AI builds by Steven Naviaux."': 'content="Selected independent infrastructure and AI builds by Steven Naviaux, including platform operations, agent workflows, personal intelligence, and AI memory systems."',
    'class="portfolio-page build-page review-mode" data-site-state="review"': 'class="portfolio-page build-page live-mode" data-site-state="live"',
    "<p>This page is a draft review artifact until approved for launch.</p>": "<p>Selected builds from the lab.</p>",
}

builds_html = apply_replacements(builds_html, builds_replacements, "builds")

builds_html = builds_html.replace("https://www.stevennaviaux.com/_review/builds/", "https://www.stevennaviaux.com/builds/")
builds_html = builds_html.replace("../../assets/", "../assets/")
builds_html = builds_html.replace('href="../index.html#', 'href="../#')
builds_html = builds_html.replace('href="../index.html"', 'href="../"')

validate_live(
    builds_html,
    "builds",
    [
        "noindex",
        "[Review]",
        "REVIEW_ONLY",
        "_review",
        "../../assets/",
        "review-ribbon",
        'data-site-state="review"',
        "index.html",
    ],
)

builds_target.parent.mkdir(parents=True, exist_ok=True)
builds_target.write_text(builds_html, encoding="utf-8")
print(f"Promoted {builds_source.relative_to(root)} to {builds_target.relative_to(root)}")

# 404 page: GitHub Pages serves /404.html for any missing path, so all URLs must be absolute
notfound_source = root / "_review" / "404.html"
notfound_target = root / "404.html"
nf_html = notfound_source.read_text(encoding="utf-8")

nf_replacements = {
    'href="index.html"': 'href="/"',
    'href="builds/index.html"': 'href="/builds/"',
    'href="../assets/favicon.svg"': 'href="/assets/favicon.svg"',
}

nf_html = apply_replacements(nf_html, nf_replacements, "404")

validate_live(
    nf_html,
    "404",
    [
        "_review",
        "../",
        'href="index.html"',
        "REVIEW_ONLY",
    ],
)

notfound_target.write_text(nf_html, encoding="utf-8")
print(f"Promoted {notfound_source.relative_to(root)} to {notfound_target.relative_to(root)}")

print("Validation passed: no review markers in live pages.")
PY
