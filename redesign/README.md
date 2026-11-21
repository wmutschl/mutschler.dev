# mutschler.dev redesign

The new design of mutschler.dev: the Handbook, a real Hugo theme (`themes/handbook/` over the shared `themes/base/`) that renders the real content in `content/`. It is the live site since 21 November 2026 (config `config/_default/hugo.toml`; see "Going live" below); before, the site ran on Wowchemy. This folder keeps the notes from the redesign.

## Round 2 lineup

Round 2 compared five themes on the same content: Handbook (a typeset book with contents, chapters and margin notes), Console (a sibling of mutschler.eu), Workbench (modCraft's design system), Column (one reading column) and Docs (a documentation layout with all guides in a sidebar). You chose the Handbook on 19 November; the other four, round 1's Boot menu and Partition map, their configs and briefs and the overview screenshots were deleted on 21 November 2026.

All five followed the round-2 priorities (see `redesign/BRIEF.md`, "Round 2"), which the Handbook keeps: readability first, nothing playful; on computers the text and the layout grow with the window (about 19 px at 1440 px, 21 to 22 px from 2000 px); command windows are wider than the text column; syntax colours tell commands, flags, strings, variables, numbers and the `#` comment/output lines apart, each at least 4.5:1 in light and dark mode.

`themes/handbook/DESIGN.md` documents its tokens, type scale, layout, syntax palette and every round's decisions and review notes.

## Round 3: the Handbook (19 November 2026)

The Handbook is the chosen direction. Three refinements, each measured; the details are in `themes/handbook/DESIGN.md`, sections 14 to 16.

- **Wider text on big screens.** The text column holds about 66 characters per line up to 1280 px and grows smoothly to about 74 from 2000 px. The right margin keeps its width.
- **More notes in the margin.** From 1280 px every short note (up to 500 characters, with no listing, list or table inside) goes to the margin. A listing, wide table or diagram right beside it then stays in the text column instead of crossing the margin, and scrolls if it has to. All 18 short notes and the 3 footnotes of the guides are now in the margin, "SSH into the installer." in the Nextcloud guide included (round 2: 12 or 13). You can also decide per note in the Markdown:

  ```text
  {{< callout note >}}         automatic, as before
  {{< callout note margin >}}  always in the margin (from 1280 px; in the text on smaller screens and in print)
  {{< callout note inline >}}  always in the text column
  ```

  Warnings always stay Caution panels in the text. For `margin` on a warning or a misspelt placement, Hugo prints a warning with file and line.
- **Readable first columns.** First-column labels up to about 28 characters (15.5em) stay on one line. Longer ones (paths, lists of settings) wrap, and the column keeps at least 9.5em. The eleven BIOS tables of the hardware chapter share their column widths, now measured after the fonts load and again when the window changes width. On tablets and small laptops (640 to 1279 px), a table whose paths would otherwise break mid-word lets its labels wrap instead.

Left as it is, on purpose:

- "UEFI Capsule Firmware Updates" (just over the threshold) wraps in the BIOS tables, where round 2 kept it whole from 1440 px; in exchange the four short labels round 2 broke at 1024 px are whole.
- A listing beside a margin note scrolls in the text column, e.g. the 33-line `lsblk` listing in chapter 8, section 3.1, shows about 64 of its 98 characters per line at 1440 px.
- Checked in headless Chrome only; one look in Safari at chapter 8, sections 3.1 and 7, and at chapter 7 is worth it. (You looked at the tables in Safari on 21 November: fine.)

## Round 4: note icon and tints (decided 20 November 2026)

You kept both: a circled "i" before "Note", drawn like the Caution's triangle, and very light washes behind notes in the text column (blue, with a thin blue bar), Cautions (red) and the "Earlier edition" notice of old chapters (sand). Margin notes stay plain. Both are now part of the Handbook on port 1423, no longer options. On the way, listings inside notes now stay in their box between 1024 and 1279 px as well (on the comparison page they still ran past it at those widths). Details: `themes/handbook/DESIGN.md`, section 17.

## Round 5: fonts (decided 20 November 2026)

You compared three font pairings (Literata + Atkinson Hyperlegible Mono, Geist + Geist Mono, Inter Tight + JetBrains Mono) and kept **Literata and Atkinson Hyperlegible Mono**. The other two are gone again. One thing found on the way stays: code never uses ligatures, so a listing always shows the characters you type (JetBrains Mono drew `->` as an arrow). Details: `themes/handbook/DESIGN.md`, section 18.

## Round 6: colours (decided 20 November 2026)

You compared the Handbook with the Docs prototype on three points and kept the Handbook's **carmine** and its **links** (ink, underlined in carmine), but took Docs' **background**: the page is now white (#FFFFFF), and in dark mode Docs' near-black (#1A1C1F) instead of the blue-black. Everything else keeps its colour: the listings' grey, the tints of notes, Cautions and the notice, the rules. Readability is the same or better (body text 16.5:1 on white, 13.5:1 in dark mode). The browser's toolbar colour and the favicon follow the white page, and the comparison page with its switch is gone. Details: `themes/handbook/DESIGN.md`, section 19.

## Round 7: code blocks (decided 20 November 2026)

Your listings used one `#` for three things: an explanation of a command, the command's output, and the content of a file. The two Dell Wyse guides now say which is which. Of four ways to set them you chose **Panels**: explanations as text in Literata after their `#`; each output in a white box (the first one in a listing labelled "Output", "Expected output" for a description); `cat` output boxed with the file's path, files written labelled on a thin rule. Listings keep their language label ("sh"); a fence that names its file or output shows the name instead (`~/.ssh/config`, "Kernel log").

**Terminal stays one line away:** `code = "session"` in `config/_default/hugo.toml` sets every marked listing as a terminal session instead (a `$` before each command, none on lines that continue it; output from the left edge, without `#`; explanations in italics; files labelled with their path). The independent review preferred it (all output in view, listings 0.5 % longer, where Panels adds about 4,000 px to chapter 8). "As now", "Folded", the "Only names" label and the switch on port 1428 are gone.

The Copy button copies only what you can run: commands, file contents and explanations (as `#` comments), never output; selecting by hand keeps the `#` of output, so a pasted selection never runs output. Tested with real clicks and the real clipboard: all 225 listings of five guides (both Wyse guides, Pop!_OS 24.04, macOS, Debian) in Panels and the 113 of the two Wyse guides in Terminal copy exactly what the Markdown says, the listing in the margin note and browsers without a secure connection included.

**The markup**, still valid shell, so a pasted block still runs: `# ` explanation (unchanged), `#> ` output, `#~ ` output described in words. File content written with `<<EOF` or shown with `cat FILE` is found automatically; a fence that shows a whole file names it, e.g. ```` ```json {file="Tailscale policy file (excerpt)"} ````. In the Nextcloud guide 443 `#` lines got a `>` or `~` (two independent reviewers per part agreed on 536 of 537 lines; a later audit of 65 lines found none wrong); nothing else changed, and git holds the guides as you committed them. The hardware guide got `codeRoles: true` in its front matter. Note: if these two guides were published with the current Wowchemy site, the `#>` would show as it is written; the markup is meant for the Handbook.

**Now in every guide** (20 November 2026). The other 24 guides with listings got the same markup, checked the same way (two labelers per part, one from rule-based proposals, one blind; they agreed on 3,354 of 3,365 lines): 3,225 output lines got `#>`, 8 descriptions `#~`, 44 listings that show a whole file now carry its name (`/etc/fstab`, `~/.bashrc`, `/lib/systemd/system/btrbk.timer`) and a fitting language, 11 that show only output a label ("Output of systemctl list-timers"), 20 listings without a language got one, and, as you chose, 12 fish listings with bash-only syntax are now sh (commands unchanged). The line roles are on for every page, so the hardware guide no longer needs `codeRoles: true`. Your own `(initramfs) cryptsetup …` line in the Raspberry Pi guide lost its prompt, because Copy would have pasted it. Undoing the markup gives your guides back byte for byte.

**Writing new listings:**

```text
# Explanation for the reader               stays "#": text in the listing
command --flag
#> what the command prints                  output: boxed, never copied
#~ what it should print, in your words      described output
sudo nano /etc/fstab
#> UUID=…  /  btrfs  defaults  0  0          the file as it should look: boxed, labelled /etc/fstab
gpg --edit-key $KEYID
  trust                                      input to the program: indent it under the program
```

A listing that is a whole file gets its name: ```` ```ini {file="/etc/systemd/system/foo.service"} ````; one that is only output gets a label: ```` ```text {output="Output of systemctl list-timers"} ````. Heredocs (`sudo tee FILE <<EOF`) and `cat FILE` are labelled automatically.

Details: `themes/handbook/DESIGN.md`, section 20.

**Also in this round:** the notes' blue wash is half as strong (`#F5F9FD`, dark mode `#1B2329`), and the review of the white paper fixed white bands at the ends of tables inside notes, a printed Caution tab that came out blank, photos staying dimmed in print after choosing dark mode, a footnote set twice in the margin, and two smaller things (DESIGN.md, section 19).

**Found on the way, in your content, and fixed at your request on 21 November** (each fix checked by an independent reviewer, the copied text of every changed listing parsed with bash, zsh, dash or fish):

- Chapter 8, section 3.3: the expected line before the `lsinitrd` loop now reads `wyse-system /dev/disk/by-uuid/... none luks,...`, as `lsinitrd` prints it.
- Chapter 8, section 4: "install the BTRFS tools" (only `btrfs-progs` is installed there; nano comes in 5.1), in the text and in the listing.
- Chapter 8, section 4: the second `cat /etc/fstab` shows the three `# … was on /dev/sdaN during curtin installation` lines that are still in the file.
- Chapter 8, section 5.1: `timedatectl status` has a described output (time zone Europe/Berlin, clock synchronized, NTP service active).
- Chapter 8: whitespace-only output lines are a bare `#>`, the empty last line of a listing in 7.2 and the trailing spaces of 95 output lines are gone; nothing visible changed.
- macOS, elementary OS and Fedora post-install guides: the ssh-agent listing is two listings, one for bash or zsh and one for fish, each copyable as it is.
- Fedora post-install guide: `exit` is indented under `matlab`, so it reads as typed at MATLAB's prompt.

## Tables (20–21 November 2026)

You asked for a check of how all tables look on phones and desktops. Independent reviewers went through all 37 tables (six pages) at eight widths; the fixes went in over three rounds, each checked independently (every before/after pair, the code, resizing, print, pages without JavaScript). Over 19 widths from 360 to 2560 px: no word breaks inside any more (134 before), code runs onto a second line far less often (706 → 202 times), cells that end in a single word 1,867 → 967, the tables 2.6 % shorter in all, and nothing scrolls sideways. Details: `themes/handbook/DESIGN.md`, section 21.

What a reader sees:

- **Phones:** paths and names no longer break inside a word. Two-column tables such as File | Purpose become a list of entries (the path as title, its purpose below), every reflowed row has a semibold title, and the BIOS "System Information" group reads as one entry.
- **Code in cells** breaks after a slash or a hyphen; a path that fits on a line moves there whole, and short names stay whole where that costs little.
- **Words that belong together** stay together: "6 TB", "1 day", "4 weekly", "04:45–05:45", "section 2.2", "Path B", "PCIe 2.0", "Audit Mode". No cell ends in a lone word where the browser can avoid it.
- **BIOS menus:** a setting without a note runs on under the Note column. **Contents page:** wrapped titles in the revision table hang under their first word.

**Labels on tablets (you kept them, 21 November):** from 640 to 1279 px five tables let their first-column labels wrap, because that makes them 7–19 % shorter with wider text columns: Home Assistant Option and App, Mac mini jobs, chapter 8's Path | Result and the backup page's restore table. That relaxes round 3's "labels up to 15.5em never wrap" for these five.

**Content changes the review suggested, made at your request on 21 November:**

- Chapter 8, section 7.2: one Port | USB | Address table for the rear and front ports, instead of two whose columns did not line up ("2.0" rather than "2.0 only"), with one lead sentence.
- Chapter 7, section 3.4: the "No changes" row is gone (the section already says that unmentioned settings stay as they are), and the four lockout pages are a sentence after the table, as in 3.12.
- Backup page, schedule: When holds only the schedule; the UTC/CET/CEST conversions and Home Assistant's "System optimal" time moved into the paragraph above, and the last column, "Reports to healthchecks.io as", holds only check names ("–" for AIO and Time Machine, whose own alerts section 4 describes). Copies table: the "#" column is gone, row 4 reads "AIO's Borg backup" and row 5's Encrypted cell "Borg, and Home Assistant's key" (that keeps the columns balanced), and "before they leave the house" moved into the note on the off-site mirror. Both tables are now shorter than before at every width. These two are in your working copy, next to your own uncommitted edits, not committed.
- Still open, if you like it: writing `Storage&nbsp;Box`, `Raspberry&nbsp;Pi`, `Time&nbsp;Machine` and `Mac&nbsp;mini` on the backup page keeps those names on one line.

## What to look at

- Chapter 8, section 7 (`/linux/wyse-ubuntu-nextcloud-aio/#7-backup-disks-snapshots-alerts-and-the-home-assistant-share`) at your usual width: the table and the listings run across the margin, short notes sit beside the text without covering code, listings have muted printing-ink colours.
- Section 3.1 of the same chapter (`#31-prepare-the-disk-in-the-installer-shell`) at 1440 or 2000 px for the SSH note in the margin, and chapter 7, section 3 (`/linux/wyse-hardware/#3-go-through-the-bios-settings`) for the BIOS tables.
- On a phone: chapter 8's File | Purpose table (in the overview) and its Installed on the Wyse table (section 7) as lists of entries, and the backup page's schedule.

## Run it

To run a live-reloading server, start it from your own terminal in the repository root (when the Claude app starts Hugo itself, macOS keeps asking whether "hugo" may access the Documents folder):

```bash
hugo server --port 1323 --bind 0.0.0.0 --baseURL http://macbook-pro:1323 --noBuildLock
```

With `--bind 0.0.0.0` you can open it on your phone over Tailscale at `http://macbook-pro:1323`; all links are root-relative, so localhost works too. `HUGO_PARAMS_CODE=session` in front of the command shows listings in the Terminal setting. `.claude/launch.json` only attaches the app's browser to servers that are already running.

## How it is put together

- `themes/base/` is shared: shortcodes (`callout`, `toc`, `figure`, `youtube`, `list_children`, `icon`), render hooks (heading anchors, code blocks with copy buttons and the fish newline fix, Mermaid), the search index (`/index.json`) and helper partials (stats counted from the rendered page, catalogue, links, author).
- `themes/base/data/catalog.yaml` groups the 26 guides by platform and marks each as current, previous or notes, with a short title and, for previous guides, why and which guide replaces them. These are proposals; please check them. If you pick a design, this could move into front matter.
- The YouTube shortcode is click-to-load: nothing is requested from Google until a reader presses play.
- The legacy "Please feel free to raise any comments…" line and the red Buy Me A Coffee badge at the top of each guide are removed at render time; every design offers feedback and support links in its layout instead.
- The fonts are self-hosted (`themes/handbook/static/fonts/`, with their licences), and so is Mermaid, which draws the night chart on the backup pages (`themes/base/assets/js/vendor/`, version 10.9.8, MIT licence): no page loads anything from another server.
- Round 1's "Boot menu" and "Partition map" were rejected as too playful; they and round 2's other themes were deleted on 21 November 2026.

## Content fixes (18 and 19 November 2026, committed by you on 20 November)

- 44 relative links in 14 older guides that returned 404 (also on the live site) now point to the current pages: `../../install-guides` → `/linux/`, `../../timeshift` → `/linux/timeshift/`, the backup links → `/stuff/backup/…`, `../-20-04/` → `/linux/ubuntu-btrfs-20-04/`, `#visual-studio-code-free` → code.visualstudio.com.
- The old References page no longer exists: the four "(see the References on how to deal with Legacy installs)" remarks were removed, and the two "[WIP] efi is broken" stubs in the RAID1 guides now point to the chroot section of the Timeshift notes. Please check these two wording changes.
- `ubuntu-post-install.md` is tagged `ubuntu` instead of `pop-os`.

- Three smaller slips: the ```` ```s ```` fence in `pop-os-btrfs-21-10.md` is now ```` ```sh ````, the `rsync -avuP …` command in `macos-post-install.md` got its closing backtick, and "directls" reads "directly".
- In `raspi-home-assistant-os.md` (Step 7), the note "If you prefer the automation editor, …" is indented into step 5, the end of the procedure, without a blank line, so the list stays tight. In the Handbook it now sits beside step 5 from 1280 px (before: beside steps 1 and 2, and the listing of step 2 had to make room for it).

## Going live (21 November 2026)

- `config/_default/hugo.toml` is the Handbook's config, with the live address, `robots.txt` (with the sitemap, as before) and Wowchemy's accent-free paths. Wowchemy's YAML config, `go.mod` (its Hugo module) and its data files are gone; the publish action is unchanged (Hugo 0.120.3, full history for the revision table, `hugo --gc --minify`).
- The fonts are self-hosted: 18 WOFF2 files (806 KB, one per script, as Google serves them; a page loads only what it uses) and their licence texts, downloaded from Google Fonts and google/fonts on GitHub. The text face's Latin file is preloaded.
- Checked before the switch: every URL of the live sitemap except the empty `/categories/` and `/publication_types/` lists exists in the new build; the minified build looks exactly like the previews on all 96 pages at 390 and 1440 px, and every listing's Copy copies the same; no page throws an error or scrolls sideways; 0 broken internal links.
- Still possible: move the catalogue data (`themes/base/data/catalog.yaml`, proposals) into front matter, and fold `themes/base/` into the Handbook.
