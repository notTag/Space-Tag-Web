# Space Tag — Website Design Prompt

You are designing a single-product marketing/landing website for **Space Tag**, a pair of macOS tools that let you name your macOS Spaces (virtual desktops) and see those names as pills rendered inside the native menu bar. The site must explain the product, show it in motion via GIFs, and funnel visitors to two install paths: a `.dmg` download for the menu-bar app, and `brew install` / `curl | sh` one-liners for the CLI.

---

## The product

### The problem
macOS Spaces are anonymous. Mission Control shows "Desktop 1, Desktop 2, Desktop 3…" and nothing in the OS tells you which space holds which project. Power users who keep one space per project lose time guessing where they are.

### Space Tag CLI (`Space-Tag-CLI`)
Rename macOS spaces on the fly from the shell. No reboot, no SIP changes.

- Built on `yabai` (stores a label per space) + `sketchybar` (renders one transparent pill per space, overlaid on the native macOS menu bar) + a zsh hook.
- Pills live **inside** the real menu bar, follow the focused display, and fade in on display switches. Native menu items stay clickable.
- **Auto-tagging:** a zsh `chpwd` hook tags the active space with the current git project name when you `cd` into a repo. `cd ~/code/foo` → space is now labeled `foo`. Toggle with `space-tag-auto on|off`.
- **Manual tagging:** `space-tag nagamaki` tags the current space; `space-tag nagamaki 2` tags space 2; `space-untag` clears.
- **Inline rename:** right-click a pill → it becomes an editable text box in place. Type, Enter to save, Escape to cancel.
- **Layout modes** (`space-position`): `center` (in menu bar, centered — default), `notch-left` / `notch-right` (flush against the MacBook notch), `left` / `right` (just below the menu bar). Remembered **per display** by stable UUID — notched laptop can stay `notch-right` while the external monitor stays `center`; survives plug/unplug.
- **Multi-display aware:** single bar pinned to the focused display (no duplication), auto-adjusts for notched MBPs vs flat externals; `space-per-display` toggles showing all spaces vs per-display spaces.
- **Agent completion flash:** optional hook that flashes a space's pill when a long-running AI agent (e.g. Claude Code) finishes in that space — glanceable "your agent is done" signal, with focus-suppression so the current space doesn't flash at you.
- Requirements: macOS (Apple Silicon or Intel), Homebrew (`yabai`, `sketchybar`, `jq`), Xcode CLT, zsh.
- Security posture: no SIP disable required.

### Space Tag App (`Space-Tag-App`)
Native macOS menu-bar control panel for the CLI — the GUI for people who don't live in a terminal.

- SwiftUI `MenuBarExtra`, `LSUIElement` (menu-bar only, no Dock icon).
- Rename spaces, toggle auto-labeling, pick pill placement, and tune the theme from a menu-bar dropdown plus a Preferences window.
- Bundles `yabai` / `sketchybar` / `jq` inside the `.app` — fewer prerequisites than the CLI path.
- Drives the same machinery and reads/writes the same state files as the CLI, so **CLI and GUI stay in sync** — use both interchangeably.
- Distributed as a `.dmg`. Ad-hoc signed (first launch: right-click → Open to clear Gatekeeper — the site should mention this gently near the download button).

---

## Site goals (in priority order)

1. **Instant comprehension** — a visitor understands "named spaces, visible in the menu bar" within 5 seconds of landing. The hero must show the pills in the menu bar (screenshot or looping GIF), not describe them.
2. **Show, don't tell** — GIF-driven feature sections. Placeholder GIF slots for now (I will record and drop in real assets). Each slot needs a caption and a stable filename convention (e.g. `/assets/gifs/auto-tag-on-cd.gif`).
3. **Two clear install paths** — App (download `.dmg`) for GUI users, CLI (brew / curl) for terminal users. Don't bury one under the other; present them as equal peers with a "which one is for me?" cue (App = zero-terminal setup, bundles dependencies; CLI = scriptable, for people already running yabai/sketchybar).
4. **Trust signals** — open source (GitHub links for both repos), no SIP changes, native macOS tech.

---

## Required page sections

1. **Hero** — product name, one-line pitch ("Name your macOS Spaces. See them in your menu bar."), hero visual = looping GIF/screenshot of pills in the menu bar, two CTAs: "Download the App" + "Install the CLI".
2. **How it works** — 3-step explainer: (1) `cd` into a project or tag manually, (2) pill appears in the menu bar, (3) glance and switch — never lose a space again.
3. **Feature showcase** — GIF slots, one per feature, alternating layout:
   - Auto-tag on `cd` (terminal + menu bar side by side)
   - Right-click inline rename of a pill
   - Layout modes / notch-aware placement (cycling through `space-position` modes)
   - Multi-display behavior (bar following focused display)
   - Agent completion flash (pill flashing when Claude Code finishes)
   - The App's dropdown + Preferences window (theme tuning, toggles)
4. **Get it** — split panel:
   - **Space Tag App**: big download button → `.dmg` (placeholder link to GitHub Releases latest), system requirements (macOS, Apple Silicon + Intel), the Gatekeeper right-click→Open note.
   - **Space Tag CLI**: copyable code blocks with copy buttons:
     ```sh
     brew install nottag/tap/space-tag
     ```
     ```sh
     curl -fsSL https://spacetag.sh/install | sh
     ```
     (Exact brew tap path and curl URL are placeholders — make them obvious constants to swap later.) Below: prerequisites (`brew install yabai sketchybar jq`, Xcode CLT).
5. **FAQ** — short: Does this change Mission Control's names? (No — Apple's renderer ignores labels; the tags live in the pills.) Do I need to disable SIP? (No.) Does it work on Intel? (Yes.) Can I use the App and CLI together? (Yes — same state files.)
6. **Footer** — GitHub links to both repos, license, "built on yabai + sketchybar" attribution.

---

## Design direction

- **Audience:** macOS power users and developers — comfortable with terminals, allergic to marketing fluff.
- **Tone:** confident, terse, technical. Think Raycast / Ghostty / Linear landing pages: dark theme default, lots of breathing room, real UI screenshots over illustrations.
- **Aesthetic:** dark background that lets the menu-bar screenshots read as native; the pill motif (rounded, translucent capsules) is the natural visual identity — use pill shapes for buttons, tags, and section badges.
- **Typography:** a clean sans for prose + a monospace face for commands, tags, and anything terminal-flavored.
- **Code blocks:** styled like a real terminal, with one-click copy.
- **Responsive:** desktop-first (the audience is on Macs), but must not break on mobile.
- **Performance:** static site, no heavy framework requirement; GIFs lazy-loaded (consider `<video>` loops over GIF files for size — keep the same slot/filename convention either way).
- **No** stock photos, no fake testimonials, no newsletter modal.

---

## Deliverables

- Full landing page design (all sections above) as a working static site.
- GIF/video placeholder slots with documented filenames so assets can be dropped in without touching markup.
- Install-path constants (dmg URL, brew tap, curl URL) isolated in one obvious place for later swap.
