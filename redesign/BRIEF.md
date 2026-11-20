# mutschler.dev redesign: shared brief

Design prototypes for mutschler.dev, each built as a real Hugo theme that renders the real content.
This file is the brief every design shares. Each design also has its own creative brief in `redesign/briefs/<slug>.md`.

## Round 2: Willi's feedback (18 November 2026). This section overrides anything below it.

Round 1 produced "Boot menu", "Partition map" and "Handbook". Willi's verdict: the first two are **far too playful**. He likes the **Handbook** style and keeps it. He wants four more designs: one in line with his academic site mutschler.eu, one in line with his modCraft web app, and two that are **professional but minimal** (Inter Tight or similar).

What he asked for, in priority order:

1. **Readability above everything.** The guides are dense with technical terms, paths, package names and long command windows. The design must look nice and clean, professional, calm. No gimmicks, no metaphors acted out in the interface, no novelty fonts, no playful chrome.
2. **Text scales with the window on computers.** On a wide desktop browser a fixed narrow column looks cramped (his screenshot: the Handbook at about 2000 px wide uses barely half the window, the code window is clipped). From about 1024 px up, the base font size and the layout widths must grow with the viewport (fluid type with `clamp()` and `vw`, layout in `rem`/`ch` so it grows with the type), up to a sensible cap around 2200 to 2560 px. Rough targets: base text about 17 px at 1024 px, 19 to 20 px at 1440 to 1680 px, 21 to 22 px at 2000 px and above. Phones and tablets keep comfortable fixed sizes. Prose measure stays readable (about 65 to 80 characters).
3. **Command windows that are wide enough.** Code blocks may and should be wider than the prose column (break out into the margin or span the content area), so typical commands and output fit without horizontal scrolling on a desktop. Longer lines scroll inside the block with a visible hint at the edge. Code font at least 14 px on desktop (scaled), line height about 1.55 to 1.65.
4. **Colour in the command windows: subtle but distinguishable, not greyscale.** Readers must tell commands, flags, strings, variables, numbers and comments apart at a glance. 54 % of all code lines (3,855 of 7,163) start with `#`: Willi's explanations and the expected command output. They must read as clearly secondary to the commands, yet stay comfortable to read (many are tables like `lsblk` output). Chroma classes in use, most frequent first: `c1`/`c` (comments, also output), `s2`/`s1`/`s` (strings), `nf` (command names in fish; in `sh`/`bash` the command is plain text without a class, so plain text is the command colour), `nv`/`si` (variables, interpolation), `p`/`o` (punctuation, operators), `k` (keywords), `na` (flags in fish), `m` (numbers), `nb` (builtins like `cd`, `echo`), `se` (escapes), `nt` (keys in yaml/json), `err` (Chroma lexing errors: style as plain text, never with a red box). Plain text and `nf` should share the strongest code colour so fish and bash blocks look alike. Every token colour needs at least 4.5:1 against the code background, in light and dark mode. Document the token palette in DESIGN.md.
5. **Inline code** (`@containerd`, `/etc/fstab`, `dell-wyse-*`) distinct but calm, no line-height jumps, long paths may break (`overflow-wrap: anywhere`).

Everything else below still applies (required pages and features, base theme API, quality floor, real data only, the process with DESIGN.md and self-review). Where the "Design direction rules" conflict with an explicit request from Willi (for example Inter Tight, or the caps labels that are part of his own modCraft design system), Willi's request wins.

Correction to the content facts below: the guides contain 1,052 fenced code blocks: 465 `sh`, 282 `bash`, 257 `fish`, 38 without a language (mostly config file contents such as fstab, crypttab, sshd_config, apt sources), 3 `json`, 3 `yaml`, and one each of `mermaid`, `sshconfig`, `text`, `s`.

## The subject

**What the site is.** mutschler.dev is Willi Mutschler's tech site: long, meticulously maintained, step-by-step guides for setting up Linux systems with LUKS encryption, BTRFS subvolumes and automatic snapshots (Pop!_OS, Ubuntu, Debian, Fedora, elementary OS), home servers (a Dell Wyse 5070 thin client with Ubuntu Server 26.04 and Nextcloud AIO; Home Assistant OS on a Raspberry Pi 4), "things to do after installation" guides for each system and for macOS, and notes on BTRFS, Timeshift and his backup strategy. Guides have been written and revised since 2020; the newest are from November 2026.

**Who Willi is** (from `content/authors/Willi Mutschler/_index.md`): software developer, tech blogger and YouTuber, open-source enthusiast. Contributes to Dynare, Timeshift and timeshift-autosnap-apt. Active on the Ask Fedora, Dynare, Destination Linux, EndeavourOS, Pop!_Planet and Ubuntu forums. Links: YouTube, GitHub, GitLab, email, Buy me a coffee. Real photo: `assets/media/YouTubePicture2.jpg` (3264×1830, Willi at his desk with a podcast microphone). Illustrated version: `assets/media/YouTubePicture.png`.

**Audience.** Linux and Mac enthusiasts and self-hosters who are about to install or rebuild a system or a home server. Many arrive from search or YouTube directly on one guide. They follow it step by step and copy commands, often on a second screen or a phone next to the machine they are installing, sometimes printed. They care about: is this guide current for my release, where am I in this long procedure, which shell does this command go into, what can go wrong (warnings).

**The primary job of the site.** Get a reader through a long technical procedure without mistakes: find the right and current guide, navigate it, copy commands, notice warnings. Secondary: introduce Willi, point to his videos and projects, invite feedback on GitHub, and invite support via Buy me a coffee.

## The content (read-only, never edit it)

- `content/linux/` 24 guides, `content/apple/` 1, `content/stuff/` 1 (backup strategy), `content/privacy.md` (Impressum and privacy policy; must be linked from every page footer, German law).
- `content/home/` and `content/authors/` are Wowchemy leftovers that do not render as pages. The author page is readable via `partial "base/author.html"`.
- Front matter: `title` (often long), `summary`, `date`, `tags`, `header.image` (file in `assets/media/`), `header.caption` (Markdown image credit), `type: book`.
- Body: Markdown with shortcodes `callout note|warning` (56×), `toc hide_on="xl"` (26×), `youtube ID` (7×, one empty), `figure` (5×), `list_children` (3×, section pages), `icon` (2×), raw `<kbd>` (36×), tables (wide BIOS-settings tables in `wyse-hardware`), one ```mermaid diagram (`stuff/backup.md`), 1,052 code fences (see the correction in Round 2).
- Size range: `wyse-ubuntu-nextcloud-aio` has 23,037 words, 11 sections, 102 code blocks, 109 minutes reading time. `btrfs` is 44 lines.
- Every guide starts with an italic "Please feel free to raise any comments or issues on the website's Github repository…" paragraph and a red "Buy Me A Coffee" image badge. `partial "base/content.html"` removes both, so your layout must offer them natively: a feedback link (edit on GitHub / open an issue) and a Buy me a coffee link on every guide.

## How the prototypes are wired

- Repo: `/Users/wmutschl/Documents/homepage/mutschler.dev` (a git repo: never commit, checkout, or reset).
- Hugo: `hugo` (v0.120.3 extended, at `/Users/wmutschl/.local/bin/hugo`). No Node, no npm. Do not use features newer than 0.120 (e.g. `try`, `templates.Defer`, `css.TailwindCSS`, `strings.TrimSpace`; use `trim`, use `.Scratch` not `.Store`).
- Each design is a Hugo theme in `themes/<slug>/`, layered over a shared theme `themes/base/`: config `theme = ["<slug>", "base"]`. Any file you create at the same path in your theme overrides the base file.
- Config per design: `redesign/configs/<slug>/_default/hugo.toml` (you own it; Wowchemy is not loaded). URLs stay as on the live site: `/linux/<file>/`, `/apple/…`, `/stuff/…`, `/privacy/`, tags at `/tag/<slug>/`, tag index at `/tags/`.
- Build: `cd /Users/wmutschl/Documents/homepage/mutschler.dev && hugo --configDir redesign/configs/<slug> --destination <SCRATCH>/build-<slug> --cleanDestinationDir --noBuildLock`
- Serve the build: `nohup python3 -m http.server <PORT> -d <SCRATCH>/build-<slug> >/dev/null 2>&1 &` (check first with `lsof -i :<PORT>`; leave it running). Rebuilding refreshes what it serves.
- Screenshot: `<SCRATCH>/tools/shot.sh <url> <out.png> <width> <height> <light|dark>`, then look at the PNG with the Read tool. Width 390 gives a true phone viewport; use a large height (e.g. 2600) to see more of a long page. Use the dark argument to check dark mode.
- Ports 1321 to 1323 are reserved for the final preview; do not use them.
- Always link with `.RelPermalink` and `relURL` (root-relative), so the site works on localhost and on `http://macbook-pro:<port>` (Willi tests on his phone over Tailscale).

## Base theme API (themes/base)

Shortcodes and render hooks produce this markup; style it (or override the file in your theme):

| Source | Markup |
|---|---|
| `callout note|warning` | `aside.callout.callout--note|--warning[data-callout]` > `span.callout__label` ("Note"/"Warning") + `div.callout__body` (rendered Markdown, may contain code blocks) |
| `toc hide_on="xl"` | `div.toc-inline.toc-inline--hide-xl` > `nav#TableOfContents` > nested `ul`. Hide it where your layout shows a TOC beside the text. |
| `figure` | `figure.figure[id]` > `img.figure__img` (responsive WebP srcset) + `figcaption.figure__caption` (contains the image credit, keep it visible) |
| `youtube` | `figure.video[data-video-id]` > `a.video__open` > `span.video__play` + `span.video__label` ("Play the video") + `span.video__note` ("Loads the player from YouTube"). On click base.js swaps in `iframe.video__frame` (youtube-nocookie) and adds `.is-playing`. Style it as a 16:9 box. Nothing loads from Google before the click. |
| `list_children` | `ul.children` > `li.children__item` > `a.children__link` + `p.children__summary` |
| `icon` | inline SVG `svg.icon` |
| headings h2–h6 | `h2#anchor` with a trailing empty `a.heading-anchor` (style it, e.g. a "#" or link glyph on hover/focus) |
| code fences | `div.codeblock[data-lang]` (data-lang is "" when the fence has no language, else `sh`, `bash`, `fish`, …) containing either `div.highlight > pre.chroma > code` (Chroma classes, write your own light and dark colours; `hugo gen chromastyles --style=<name>` prints a starting point) or plain `pre > code`. base.js appends `button.codeblock__copy` > `span.codeblock__copy-text` ("Copy"/"Copied", `.is-copied`). |
| mermaid fence | `pre.mermaid`; base/scripts.html loads Mermaid only on pages that contain one |

Partials (call them, don't copy them):

- `partial "base/content.html" .` → the page content without the legacy intro paragraph and badge. Use it instead of `.Content` on guides.
- `partial "base/guide.html" .` → dict from `themes/base/data/catalog.yaml`: `platform`, `platformName`, `kind` (install, post-install, hardware, notes), `kindName`, `release` (e.g. "Pop!_OS 24.04"), `short` (short title), `status` (current, previous, notes), `note` (why a guide is previous), `successorPage` (page or false). Empty dict for pages not in the catalog. `site.Data.catalog.platforms` gives platform order and names.
- `partial "base/stats.html" .` → `words`, `minutes`, `commands` (number of code blocks), `sections` (number of ## headings), `video` (YouTube ID or ""), `published`, `updated` (git date), `updatedDiffers` (bool).
- `partial "base/links.html" .` → `source`, `edit`, `issues` (GitHub URLs for this page), `repo`, `coffee`, `youtube`, `github`, `gitlab`, `email`, `rss`.
- `partial "base/author.html" .` → author page: `.Title`, `.Params.role` (contains `<br/>`), `.Params.bio`, `.Params.social`, `.Content` (about text, Willi's own words with emoji; you may show it as is or choose shorter fields, but do not rewrite it).
- `partial "base/toc.html" .` → the page TOC as nested `ul` (no `nav#TableOfContents` wrapper), for a TOC beside the text.
- `partial "base/img.html" (dict "img" (resources.Get "media/X") "alt" "…" "sizes" "…" "class" "…" "eager" false)` → responsive WebP `img`.
- `partial "base/icon.html" "name"` → line icon SVG: copy, check, link, search, sun, moon, coffee, mail, play, rss, arrow-up, external, menu, close, download. Brand logos are not provided: name GitHub, GitLab and YouTube in words.
- `partial "base/scripts.html" .` → put before `</body>`: base.js (copy buttons, click-to-load video, `window.siteSearch(query)` → Promise of results `{title, short, url, section, platform, status, summary, tags, headings, date, updated, score, matchedHeading}` from `/index.json`) and Mermaid where needed.

Status counts from the catalogue: 9 current guides, 14 previous, 3 notes. Platforms in order: Pop!_OS, Ubuntu, Debian, Fedora, elementary OS, Dell Wyse home server, Raspberry Pi, macOS, Snapshots and backups.

## Every design must have

Pages: home `/`, section lists `/linux/` `/apple/` `/stuff/`, guide pages, `/privacy/`, tag index `/tags/`, tag pages `/tag/<x>/`, and `404.html`. All of them designed, none falling back to the base layouts.

On guide pages:
- Title, the facts from stats/catalog that help a reader decide and plan (release, published, last updated when it differs, reading time, number of commands). Present facts as structure (a definition list, a table, labelled fields), not as a "A · B · C" string.
- A TOC that stays reachable in long guides (beside the text on wide screens, collapsible on phones) with the current section indicated while scrolling. Hide `.toc-inline--hide-xl` where the side TOC shows.
- For `status: previous` guides: a clear notice at the top with the catalogue `note` and a link to `successorPage` if there is one.
- Code blocks: comfortable mono at ≥13 px on phones, horizontal scroll inside the block (never page overflow), visible language label when `data-lang` is set (fish vs bash matters to readers), the copy button styled and keyboard reachable.
- Callouts: note and warning distinguishable without relying on colour alone.
- `kbd`, tables (wide ones scroll inside a wrapper or reflow; never break the page width), figures with visible credits, the video box, blockquotes, `hr`.
- Feedback link (edit on GitHub and/or open an issue) and Buy me a coffee link.
- Heading anchors for linking to a step.

Site-wide:
- Light and dark mode: follow `prefers-color-scheme` by default, plus a toggle that stores the choice in `localStorage` (wrap in try/catch) and sets `data-theme="light|dark"` on `<html>` from an inline script in `<head>` (no flash). Define colours as CSS custom properties on `:root`, redefine them under `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }` and `:root[data-theme="dark"] { … }`.
- Search UI using `window.siteSearch`, reachable by a visible control and the `/` key (ignore the key while typing in a field), Esc closes, results are links.
- Footer: © 2020–{current year} Willi Mutschler, licensed CC BY-SA 4.0 (link https://creativecommons.org/licenses/by-sa/4.0/), Privacy and Impressum (`/privacy/`), source on GitHub, RSS.
- `<head>`: title, meta description (page summary or site description), RSS alternate link, a favicon (an original SVG mark in your design's language is welcome; do not draw Apple's logo or Tux), theme-color.
- CSS through Hugo Pipes (`resources.Get "css/…" | minify | fingerprint`), vanilla JS only, small. Fonts may load from Google Fonts with `display=swap` for the prototype; list them in DESIGN.md and note that production should self-host them (Willi self-hosts fonts on his other site for privacy).
- Header images from front matter are optional. If you show any third-party image, show its credit (`header.caption`) near it.

Quality floor (build to it without announcing it):
- Responsive from 360 px to 1920 px; no horizontal page scroll at 360–430 px.
- Visible keyboard focus everywhere; skip link; landmarks; `aria-current` on the current nav item; buttons are buttons, links are links.
- WCAG AA contrast (4.5:1 body text, 3:1 large text and UI). Write the key ratios into DESIGN.md.
- `prefers-reduced-motion` respected. Motion only where it means something.
- Prose measure about 60–75 characters; code blocks may be wider than prose.
- Print stylesheet at least hides navigation and keeps code readable (people print install guides).

## Design direction rules (from the frontend-design skill)

- Spend boldness in one place. One memorable signature element, everything around it quiet and disciplined. Before finishing, remove one accessory.
- Typography carries the personality. One or two families (a mono for code counts as part of the system), chosen deliberately, with a clear type scale (Bringhurst-style steps), intentional weights and spacing.
- Visual structure is information: borders, numbers, labels and dividers must encode something real. Numbered markers only for real sequences (guide sections are real sequences; a list of unrelated guides is not).
- Avoid the common tells of generated pages: warm cream background with serif display and terracotta accent; near-black background with one acid-green or vermilion accent; broadsheet hairline-and-columns layouts; identical rounded cards with the same soft shadow and gradient washes; ALL-CAPS tracked eyebrow labels above headings; meta strings joined with middle dots; "Word — fragment" labels; `#0B0B0B`/`#111` standing in for black; monospace for small data labels (unless monospace is the design's own voice); `→` appended to links and buttons; one word in a headline coloured or italicised.
- Words: plain, specific, sentence case, active voice, from the reader's side. No marketing copy. Never invent facts (no fake numbers, testimonials, subscriber counts, dates). Every number shown must come from the content, the catalogue, the stats partial or git.
- Process: first write `themes/<slug>/DESIGN.md` with the plan (concept, colour tokens as named hex values with roles, type families and scale, layout wireframes in ASCII for home and guide at desktop and phone, components, interactions, principles). Then review the plan against these rules: wherever it reads like the default you would produce for any tech blog, change it and record what you changed and why in a "Self-review" section. Only then build. While building, take screenshots and critique them; iterate.
