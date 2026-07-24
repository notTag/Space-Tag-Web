# Next Steps — Space Tag Launch Checklist

Manual steps for Nick. Ordered by dependency — distribution first, because the
site's CTAs (`brew install`, `curl | sh`, "Download DMG") point at things that
don't exist yet.

## 1. Homebrew distribution for Space-Tag-CLI

The site advertises `brew install space-tag-cli`. Cheapest path is a personal tap
(no formula review, instant):

1. Cut a tagged release in Space-Tag-CLI: `git tag v0.1.0 && git push --tags`,
   then `gh release create v0.1.0` (Homebrew pulls the release tarball).
2. Create a tap repo: `gh repo create notTag/homebrew-space-tag --public`.
3. Add `Formula/space-tag-cli.rb` pointing at the release tarball
   (`url`, `sha256` via `shasum -a 256 <tarball>`). Declare deps:
   `depends_on "yabai"`, `depends_on "sketchybar"`, `depends_on "jq"`.
   Note: yabai/sketchybar live in `koekeishiya/formulae` and `FelixKratz/formulae`
   taps — either document those taps as prerequisites or vendor the dep check
   into the formula's `caveats`.
4. Install command becomes `brew install notTag/space-tag/space-tag-cli`.
   → Update `CliExperience.vue` Homebrew tab to match (currently shows the
   short form, which only works after homebrew-core acceptance — long-term goal).
5. Later: submit to homebrew-core once the repo has notability (30+ stars,
   30+ forks guideline) — then `brew install space-tag-cli` works as advertised.

## 2. Host install.sh for the curl one-liner

The site advertises `curl -fsSL https://spacetag.app/install.sh | sh`.

1. Buy/confirm the `spacetag.app` domain (`.app` requires HTTPS — fine, every
   host below gives you TLS).
2. Easiest: serve `install.sh` as a static file from this Vite site —
   drop it in `public/install.sh`, it deploys with the site at the root path.
   Keep it a thin bootstrapper: check deps, clone repo (or fetch release
   tarball), run the repo's `./install.sh`.
3. Alternative zero-domain option while domain is pending:
   `curl -fsSL https://raw.githubusercontent.com/notTag/Space-Tag-CLI/main/install.sh | sh`
   — works today; could ship the site with this URL and swap later.

## 3. Host the Space-Tag-App .dmg

Repo is private, so GitHub Releases on it won't serve anonymous downloads.
Options, best first:

- **Vercel/site `public/` dir** — if the DMG is <100 MB, drop
  `Space-Tag.dmg` into `public/` here and the "Download DMG" button links to
  `/Space-Tag.dmg`. Zero extra infra, deploys with the site. Vercel static
  file limit is fine for a menu-bar app DMG.
- **Public "releases" repo** — create `notTag/Space-Tag-App-Releases` (public,
  empty except releases), upload the DMG as a release asset. Keeps source
  private, gives versioned download URLs + download counts. This is the
  standard pattern for closed-source Mac apps on GitHub.
- **AWS S3 + CloudFront** — most control (custom domain, analytics), most
  setup. Overkill until download volume matters.
- **Serving from local** — no. Machine must stay up, IP exposed, no TLS.

Also required for a public DMG regardless of host:
- **Codesign + notarize** the app (Apple Developer ID, `notarytool`) or every
  user hits the Gatekeeper "unidentified developer" wall.

## 4. Wire up the site (after 1–3)

- `HeroSection.vue` + `TopNavBar.vue`: point "Download DMG" buttons at the real
  DMG URL.
- `HeroSection.vue`: point "View on GitHub" at the CLI repo.
- `CliExperience.vue`: update Homebrew/Curl commands to the real ones from
  steps 1–2.
- Deploy the site itself (Vercel is the obvious fit for Vite + static).
- Point `spacetag.app` DNS at the deployment.

## 5. Nice-to-haves

- Changelog page sourced from GitHub releases (footer currently links to
  the CLI repo's releases page).
- `og:image` + meta tags for link previews before sharing anywhere.
- App repo is private — decide whether the site should mention the app's
  source at all, or only the CLI's.
