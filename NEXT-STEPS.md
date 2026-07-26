# Next Steps — Space Tag Launch Checklist

Manual steps for Nick. Ordered by dependency — distribution first, because the
site's CTAs (`brew install`, `curl | sh`, "Download DMG") point at things that
don't exist yet.

## 1. Homebrew distribution for Space-Tag-CLI — DONE

Shipped as a personal tap: [notTag/homebrew-tap](https://github.com/notTag/homebrew-tap),
formula `Formula/space-tag.rb`, pinned to Space-Tag-CLI `v0.4.0`.

Install command (both parts required — see below):

```sh
brew tap notTag/tap && brew install notTag/tap/space-tag
```

Three things came out different from the plan above:

- **Tap is `notTag/homebrew-tap`, not `homebrew-space-tag`** — one tap for all
  notTag CLIs rather than one tap per project.
- **Formula is `space-tag`, not `space-tag-cli`** — it matches the binary name.
- **`yabai`/`sketchybar` are NOT formula deps.** Brew 6 refuses to resolve
  formulae from untrusted third-party taps, so declaring them made the whole
  formula fail to load. The CLI's own `install.sh` already installs both from
  their pinned official taps, so the deps were a duplicate that only bought
  users a trust wall. Only `jq` (homebrew-core) is declared.

`brew tap` cannot be dropped from the one-liner: brew 6 does not auto-tap on a
fully-qualified name — `brew install notTag/tap/space-tag` on a fresh machine
errors with `This command requires the tap nottag/tap`.

The formula pulls the GitHub **source archive**, not the `space-tag-cli-X.Y.Z.tar.gz`
release asset. That asset packs only `sketchybar yabai bin shell`, so `space-tag
version` and `space-tag uninstall` (which read `../VERSION` and `../uninstall.sh`)
would both break under brew.

Still open: submit to homebrew-core once the repo clears notability (~75+
stars/forks/watchers) — then bare `brew install space-tag` works. Core also
generally rejects formulae needing a manual post-install step, which the
required `install.sh` run is, so this may never be viable.

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
- `CliExperience.vue`: Homebrew command is real (step 1 done); Curl command
  still points at the unhosted `spacetag.app/install.sh` from step 2.
- Deploy the site itself (Vercel is the obvious fit for Vite + static).
- Point `spacetag.app` DNS at the deployment.

## 5. Nice-to-haves

- Changelog page sourced from GitHub releases (footer currently links to
  the CLI repo's releases page).
- `og:image` + meta tags for link previews before sharing anywhere.
- App repo is private — decide whether the site should mention the app's
  source at all, or only the CLI's.
