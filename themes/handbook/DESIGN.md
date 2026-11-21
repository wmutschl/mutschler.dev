# Handbook: design

mutschler.dev typeset as a handbook in its seventh year of revisions (first guide April 2020, latest revision November 2026): contents up front, chapters with margin notes, earlier editions kept in an appendix.

This file was written as a plan before building (sections 1 to 8) and updated afterwards to match what was built. Section 9 records what changed while building and why; section 11 lists what changed after an independent review. Section 12 records round 2 (Willi's feedback of 18 November 2026): on computers the page grows with the window, listings and wide tables use the margin, and listings have colour. Where an earlier section states a size or a rule that round 2 changed, it says so and points to section 12. Section 13 lists what changed after an independent review of round 2. Section 14 records round 3 (Willi's feedback of 19 November 2026): a wider text column on big screens, margin notes that win over the listings beside them, with an override in the Markdown, and first table columns that keep their labels whole; the sections it changes point to it. Section 15 records the independent verification of round 3 and the two things it fixed.

## 1. Concept

The guides are long, numbered procedures that people follow at a machine, often from a phone or a printout. A handbook is the form made for that: a contents page that tells you what is in it and how long each chapter is, chapters that tell you where you are, notes in the margin that do not interrupt, cautions that do. Older guides become earlier editions in an appendix, which explains honestly why they are still there.

Signature: the typesetting itself, in two places.

1. **The contents page.** Parts with roman numerals, chapter numbers hanging in the margin in carmine, a dotted leader running from each title to its reading time, one line of summary, an appendix of earlier editions (A.1 to A.14) with the reason each is kept, and a revision history taken from git.
2. **The chapter page.** The chapter numeral in the margin, Willi's own section numbers (1, 3.1, Step 2) hanging in the gutter so every heading's text aligns with the text column, short notes and footnotes set in the right margin as sidenotes, cautions set in the text column as an interrupting panel.

Everything else is quiet: one serif family, one mono, one spot colour, no imagery except the content's own figures and Willi's photo.

## 2. Colour tokens

Ink on paper, one spot colour. The spot colour is carmine: the printer's traditional second colour (rubrication, the red chapter numbers and paragraph marks of printed books) and the colour of danger and caution in technical documentation (ISO 3864). One colour therefore does both jobs the brief gives it: it marks numbers and links, and it marks cautions. Carmine is a cool, bluish red (hue about 350 degrees), far from terracotta or clay (hue about 15 degrees, a desaturated orange), from acid green, and from the firmware blue of the "Boot menu" prototype.

Light ("paper")

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#FFFFFF` | Page. White, from the Docs prototype (round 6, section 19); until then `#F6F7F8`, a cool off-white with a trace of blue-grey. Not cream. |
| `--tint` | `#E8EBEE` | Listings, inline code, the video box. Cool grey, two steps below the paper. |
| `--ink` | `#1C1F24` | Text, headings, rules of tables and the earlier-edition notice. Cool blue-black printing ink. |
| `--pencil` | `#4A515B` | Secondary text: running head, standfirst, margin notes, captions, field labels, TOC entries, earlier-edition numbers. |
| `--leader` | `#9AA1AA` | Dotted leaders, the hairline beside inline notes, `kbd` borders. Never the only carrier of meaning. |
| `--rule` | `#C9CED4` | Hairlines: under the running head, between table rows, above the facts. |
| `--spot` | `#B0122C` | Carmine. Chapter and section numbers, link underlines, the current-section marker, focus rings, index letters, the margin notes' rule. |
| `--warn` | `#B0122C` | The Caution panel's rules and tab: carmine too, as a token of its own (round 6). |
| `--on-warn` | `#FFFFFF` | Text on the Caution tab. |
| `--selection` | `#F3D3D9` | Text selection. |
| `--shade` | `rgba(28,31,36,.16)` | Edge shading on listings and tables that can scroll sideways (`.11` in round 1). |
| `--code-comment`, `--code-flag`, `--code-string`, `--code-var`, `--code-number` | see 12.4 | Listing colours (round 2). |

Dark ("night paper"): the same system with the light lowered, not a neon-on-black theme.

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#1A1C1F` | A near-black with hardly any hue, from the Docs prototype (round 6); until then `#1D2126`, a dark slate. Never black. |
| `--tint` | `#272C33` | Listings. |
| `--ink` | `#E3E5E8` | Text. |
| `--pencil` | `#A7AEB7` | Secondary text. |
| `--leader` | `#5E6670` | Leaders. |
| `--rule` | `#3A4048` | Hairlines. |
| `--spot` | `#F27D8F` | Carmine lifted for dark paper. |
| `--warn` | `#F27D8F` | The Caution, as above. |
| `--on-warn` | `#1A1C1F` | Text on the Caution tab: the paper. |
| `--selection` | `#5A2A33` | Text selection. |
| `--shade` | `rgba(0,0,0,.5)` | Scroll shading (`.45` in round 1). |
| `--code-*` | see 12.4 | Listing colours (round 2). |

Photos are dimmed to 86 % brightness in dark mode.

Measured contrast (WCAG 2; recomputed for the white and near-black paper of round 6):

| Pair | Light | Dark |
|---|---|---|
| ink on paper (body text) | 16.5:1 | 13.5:1 |
| ink on tint (code) | 13.8:1 | 11.1:1 |
| pencil on paper (secondary text, 14 px and up) | 8.0:1 | 7.6:1 |
| pencil on tint (shell name, Copy button) | 6.7:1 | 6.3:1 |
| carmine on paper (numbers, hover links, focus ring) | 7.1:1 | 6.6:1 |
| carmine on tint ("Copied") | 5.9:1 | 5.4:1 |
| on-warn on carmine (Caution tab) | 7.1:1 | 6.6:1 |
| pencil underline on paper (quiet links: byline, revision subjects, side links, index terms and locators) | 8.0:1 | 7.6:1 |
| leader on paper (decorative leaders and hairlines) | 2.6:1 | 2.9:1 |

Every text pair passes AA at any size; the focus ring passes the 3:1 UI threshold with room to spare. The listing tokens (section 12.4) are each at least 5.4:1 on the listing tint, in both modes. Links that share the colour of the text around them are marked by an underline in pencil or carmine, never by a hairline-coloured one. The backup diagram uses the same tokens: ink for boxes and their labels, pencil for the connecting lines and their labels.

## 3. Type

- **Literata** (variable: optical sizes 7 to 72, weights 300 to 800, roman and italic). Designed for long reading on screens; `font-optical-sizing: auto` lets one family carry 14 px margin notes and a 72 px chapter numeral. Text, headings, labels, UI.
- **Atkinson Hyperlegible Mono** (weights 400 to 700). Chosen for character disambiguation: slashed zero, distinct 1, l and I, open forms. Readers retype commands like `cryptsetup luksOpen /dev/sdc3`, sometimes from paper. Code and `kbd`. No italics in code: comments, which in these guides are mostly the expected output, are set in a lighter pencil, roman; commands in ink; flags, strings, variables and numbers in four muted ink colours (round 2, section 12.4).
- No sans, no all-caps. Labels are small italic Literata; running heads are small italic.
- Both load from Google Fonts with `display=swap` for the prototype (`Literata:ital,opsz,wght@0,7..72,300..800;1,7..72,300..800` and `Atkinson+Hyperlegible+Mono:wght@400..700`). Production should self-host them, as Willi does on his other site.

Scale (Bringhurst steps; desktop px at 1024 px wide, phone in brackets). Round 2: from 1024 px the root size grows with the window and every step grows with it, so body text runs from 18 px at 1024 px to 22.5 px from about 2200 px (section 12.1); phones and tablets keep these sizes.

| Step | Size | Use |
|---|---|---|
| 0 | 14 | running head, margin notes, captions, field labels, TOC, listing labels, listings (14 on all screens) |
| 1 | 16 | inline notes, tables (15), facts values, UI controls, phone standfirst |
| 2 | 18 (17) | body text, h4 (italic), entry titles |
| 3 | 21 (19) | h3, part titles |
| 4 | 24 | chapter subtitle (21 from 640 to 1023 px, 18 on phones), h2 on phones |
| 5 | 30 | h2; chapter title from 640 to 1023 px |
| 6 | 36 (24) | chapter title from 1024 px, "Contents", section titles on the contents page |
| 7 | 48 (36) | section and index titles, chapter numeral on phones |
| 9 | 72 (48) | site title, chapter numeral |

Standfirst 19 px on wide screens. Body line height 1.65 in chapters (a serif at screen sizes wants more leading than a sans), headings 1.2 to 1.3, display 1.0 to 1.12. Measure: text column 35rem up to 1280 px (560 px at 1024 px), widening to 39.25rem from 2000 px (757 px at 2000, 785 px at 2560; round 3, section 14.1). Measured with the chapters' own text, the column holds about 66 characters up to 1280 px, 68 at 1440, 71 at 1680 and 74 from 2000 px (43 on a 390 px phone). Round 1 and 2 measured 66.8 on another sample of text at every width. Numbers in the contents, index, facts and TOC are tabular lining figures.

Line breaking: display lines (site subtitle, page and chapter titles, part titles, h2 and h3) are balanced (`text-wrap: balance`), so no word is left alone on a last line; paragraphs, leads, the standfirst and the contents lines use `text-wrap: pretty`. Dates and counts are set with non-breaking spaces, so "15 December 2025" never breaks between day and month, nor "10 chapters" between number and noun.

## 4. Layout

Grid on wide screens, centred:

- 1280 px and wider: `[ left margin 14.5–20rem | gutter 4rem | text 35–39.25rem | gap 3rem | right margin 14–28rem ]`; the two margins grow with the window faster than the type (round 2, section 12.1; round 1 had 15rem and 15 to 17rem), and the text column widens from 35rem at 1280 px to 39.25rem at 2000 px (round 3, section 14.1).
- 1024 to 1279 px: `[ left margin 13.5rem | gutter 3.5rem | text 35rem | free column 4–12rem ]`; notes return to the text column; listings, wide tables and the diagram reach into the free column (round 2; round 1 had no fourth column).
- Below 1024 px: one column; the TOC is a collapsible block under the chapter opener and the running head is sticky. Once the reader is past the opener, its left side names the current section and opens the TOC.

The left margin holds the chapter numeral and the sticky TOC. The gutter holds hanging section numbers and the "Earlier edition" label. The right margin holds margin notes and sidenotes; from round 2 listings, wide tables and the diagram cross it, except where a margin note is beside them: then they stay in the text column (round 3, section 14.2; in round 2 the note gave way, section 12.3). Listings hang 1rem into the left gutter so the code aligns with the text and, from 1024 px, reach right to the edge of the frame; on phones they run to the screen edges.

Alignment: everything ranges left on the text column's edge. Numbers and labels hang to the left of that edge. Nothing is centred.

The contents, section, index and tag pages use a single column with chapter numbers hanging 3.25rem into the margin: 46rem up to 1280 px, and from there 46/35 of the text column, so it widens with it (736 px at 1024 px, 808 at 1440, 995 at 2000, 1032 at 2560; round 3, section 14.1; round 2 had 46rem at every width, 920 px from about 2200 px).

The running head and the colophon are set to the page's frame (`--frame`), the width of its text block: the 46rem column on the contents, section, index, tag and 404 pages; on chapters the whole grid, from the TOC column to the right margin (below 1024 px, the text column). Their left edge is therefore the contents column or the TOC column, and their side padding is the page's (16 px on phones).

### Contents page, desktop (1440)

```
                     mutschler.dev                Contents  Index  About   Search /   (moon)
 ------------------------------------------------------------------------------------------

                     mutschler.dev
                     Step-by-step guides to installing Linux with encryption
                     and snapshots, setting up Linux and macOS after
                     installation, and running a home server.
                     by Willi Mutschler
                     Revised 18 November 2026; first published April 2020. 12 chapters and 14 earlier editions.

                     Contents                                           reading time
                     Part I  Installing Linux with encryption and snapshots
                1    Install Pop!_OS 24.04 with BTRFS, LUKS and Timeshift . . . 18 min
                     Written for Pop!_OS 24.04; revised 15 December 2025.
                2    Install Debian 13 with BTRFS, LUKS and Timeshift . . . . . 10 min
                     Written for Debian 13 Trixie; revised 10 December 2025.
                     Part II  After installation
                3    Pop!_OS: things to do after installation . . . . . . . .  16 min
                     Written for Pop!_OS 24.04; revised 14 January 2026.
              ...
                     Appendix A  Earlier editions                   first published
                     Guides for releases that have reached end of life …
                     Pop!_OS
              A.1    Install Pop!_OS 22.04 with BTRFS, LUKS and Timeshift . . . 2022
                     Superseded by the guide for Pop!_OS 24.04
              ...
                     Revision history
                     Date          Chapter                         Last change
                     18 Nov 2026   7 Dell Wyse 5070: RAM, SSD…     Adds Dell Wyse 5070…
                     ...
                     About the author
                     [photo]  Willi Mutschler
                              Software Developer / Tech Blogger & YouTuber / …
                              YouTube  GitHub  GitLab  Email  Buy me a coffee
 ------------------------------------------------------------------------------------------
 © 2020–2026 Willi Mutschler. CC BY-SA 4.0. Privacy and Impressum. Source on GitHub. RSS feed.
 Set in Literata and Atkinson Hyperlegible Mono.
```

### Contents page, phone (390)

```
 mutschler.dev       Contents Index (search)(moon)
 -------------------------------------------------
 mutschler.dev
 Step-by-step guides to installing
 Linux with encryption and snapshots,
 setting up Linux and macOS after
 installation, and running a home server.
 by Willi Mutschler
 Revised 18 November 2026; first
 published April 2020. …

 Contents                       reading time
 Part I
 Installing Linux with encryption and
 snapshots
  1  Install Pop!_OS 24.04 with
     BTRFS, LUKS and Timeshift . . 18 min
     Written for Pop!_OS 24.04; revised
     15 December 2025.
 …
 Appendix A  Earlier editions
 A.1 …
 Revision history (rows stacked, date in italic)
 About the author (photo above text)
 Colophon
```

### Chapter, desktop (1440)

```
 mutschler.dev   8  Dell Wyse 5070: Ubuntu Server 26.04…      Contents  Index  About  Search /  (moon)
 -----------------------------------------------------------------------------------------------------
     (earlier editions only)
     Earlier edition ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                     This chapter is kept from an earlier edition … A newer edition is A.8, …
                     ───────────────────────────────────────────────────────────────────────

                 8   Dell Wyse 5070 Thin Client
                     Ubuntu Server 26.04 LTS, BTRFS and Nextcloud AIO with a Tailscale sidecar
                     How I turned my Dell Wyse 5070 Thin Client into a home server: …  (standfirst)
                     ─────────────────────────────────────────────────────────────────────
                     Written for        First published    Reading time   Code blocks
                     Ubuntu Server…     18 November 2026   108 minutes    102

 In this chapter          Overview
   Overview               text …                                          ── 
 1 The intended layout                                                    Note
 2 Preparations     1     The intended layout                             Be patient after
 3 Install Ubuntu…        text…                                           the RAM upgrade…
   3.1 Prepare… ▌   3.1   Prepare the disk in the installer shell
   3.2 …                 ┌ fish ─────────────────────────────── Copy ┐
 …                        │ sudo lsblk                                 │
 Suggest an edit          └────────────────────────────────────────────┘
 Open an issue            ┏ ⚠ Caution ┓━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Buy me a coffee          Do not reformat partition 4. …
                          ────────────────────────────────────────────── (carmine)
                          Something wrong or out of date?  Suggest an edit / open an issue
                          If this chapter saved you time, you can buy me a coffee.
                          ── Previous chapter          ── Next chapter
                             7 Dell Wyse 5070: RAM…       9 Home Assistant OS…
```

This wireframe shows round 1. In round 2 listings and wide tables run from the text column across the gap and the margin, and a margin note never sat beside them (wireframe in 12.2). From round 3 the margin note keeps its place and a listing or table beside it stays in the text column (section 14.2).

### Chapter, phone (390)

```
 [ 3.1 Prepare the disk…  ≡ ]  (search)(moon)   <- sticky running head once past the opener
 ---------------------------------------------
 8
 Dell Wyse 5070 Thin Client
 Ubuntu Server 26.04 LTS, BTRFS and
 Nextcloud AIO with a Tailscale sidecar
 How I turned my Dell Wyse 5070 …
 Written for        First published
 Ubuntu Server …    18 November 2026
 Reading time       Code blocks
 108 minutes        102
 > Sections of this chapter                 <- details, collapsed
 Overview
 …
 Note. Be patient after the RAM upgrade…    <- margin notes fall back into the text
 1  The intended layout                     <- section numbers inline
```

## 5. Components

- **Running head.** Handbook title (link to the contents) and, on chapters, the chapter number in carmine (pencil for earlier editions) and the short title in small italic; on the right Contents, Index, About, Search with its `/` key shown, and the theme toggle. Set to the page's frame, so it ranges with the text block below it. A hairline below. Static on wide screens. Below 1024 px it is sticky and compact (About and the key hint drop out; below 384 px also "Contents", because the title leads there), and on chapters its left side becomes the current-section button.
- **Contents entry.** Number (hanging, carmine, tabular), title (catalogue `short`, linked; the whole entry is the click target), a dotted leader filling the last line of the title, reading time on the right, and below it, in pencil italic, the line that answers this audience's first question, "is this the guide for my system, and is it current?": "Written for Pop!_OS 24.04; revised 15 December 2025." (catalogue release; git date of the last revision, or "published" and the publication date when the chapter has not been revised since). The three notes chapters have no release; they show their summary, a single short sentence, in full. Earlier editions show the catalogue note instead, the year first published instead of the reading time, and their number in pencil. Nothing is truncated.
- **Parts.** Curated in `data/handbook.yaml`: I Installing Linux with encryption and snapshots; II After installation; III Home servers; IV Snapshots and backups. Appendix A collects every catalogue guide with status `previous`, grouped by platform in catalogue order, installation guides first, newest first. A current guide missing from the parts would still appear, under "Other chapters".
- **Revision history.** The eight most recently revised chapters: git date, chapter, and the git commit subject linking to the commit on GitHub. Booktabs rules; rows reflow into stacked entries on phones.
- **About the author.** Willi's photo at its own ratio, name, roles, his about text word for word but set without its colour emoji (section 13), links in words (YouTube, GitHub, GitLab, Email, Buy me a coffee).
- **Chapter opener.** Numeral (72 px, weight 300, carmine; pencil for earlier editions) hanging in the left margin on the title's baseline; title split at its last colon into title and subtitle (both stay in one `h1`, and the accessible name keeps the colon and "Chapter 8"); summary as standfirst; facts as a `dl` of labelled fields: Written for (catalogue release), First published, Last revised (when it differs; git), Reading time, Code blocks (fences to type or copy; a ```` ```mermaid ```` diagram is not counted, and the field is left out when there are none), Video (when the chapter has one).
- **Earlier-edition notice.** Between a 2 px ink rule and a hairline, the label "Earlier edition" hanging in the gutter like the numbers; the catalogue note; a link to the newer chapter when the catalogue names one ("The current edition is chapter 1, …" or "A newer edition is A.8, …, itself kept as an earlier edition"), otherwise a pointer to the contents.
- **Side TOC.** Sticky in the left margin, numbers in their own column, current section in ink with a carmine bar and carmine number, only the h3 entries of the current h2 unfolded (all unfolded without JavaScript), scrolls itself to keep the current entry in view. In a numbered TOC, an unnumbered sub-section ("Changes to fstab" under "3 Configure BTRFS …") lines up with the text of numbered sub-sections ("3.1 …"), one level inside its parent. Number and title are separated by a real space in the text (not rendered by the flex layout), so screen readers and copied text read "3.1 Prepare …". Suggest an edit, Open an issue and Buy me a coffee at its foot.
- **Phone TOC.** A `details` block ("Sections of this chapter") under the opener, plus a dialog opened from the running head with the current section centred in the list and focused. The dialog's title, Close button and "Contents of the handbook" stay in view; only the list scrolls. The base shortcode's `.toc-inline--hide-xl` is hidden at every width, because the handbook always shows its own TOC. On the privacy page, which is not a chapter, the TOC is "On this page" and "Sections of this page".
- **Headings.** Section numbers parsed from Willi's headings and typeset as hanging carmine numbers: `3.1 General` and `Step 2 (optional): Install …` become a number and a title; "Step" stays in the accessible name; "(optional)" moves to the end in italic. Headings without a number are left as written; numbers are never invented. Ids are unchanged. A `§` anchor appears on hover and keyboard focus.
- **Margin notes (the rule).** A `callout note` whose text is at most 500 characters and contains no code block, list, table, figure or other block is set in the right margin on screens 1280 px and wider, in 14 px pencil (at 1024 px; it grows with the type) under a short carmine rule and the label "Note", at most 23rem wide. The Markdown can override the rule: `{{< callout note margin >}}` puts any note in the margin, `{{< callout note inline >}}` keeps any note in the text column (round 3, section 14.2). A small script lifts each margin note level with the block it comments on (the paragraph before it), below the note above. The margin note wins: a listing, wide table or diagram that would cross the margin beside it stays in the text column (round 3, section 14.2; round 2 moved the note or set it in the text column instead, section 12.3). Longer or structured notes stay in the text column as an indented note with a hairline and a run-in "Note." label. Below 1280 px, in print and without JavaScript every note is in the text column. A note that opens with Willi's own label ("**Note on GRUB:** …") keeps his label and the theme's "Note" is visually hidden (screen readers still hear it), so it never reads "Note. Note on …"; in the margin the short carmine rule stays above it. Footnotes are also repeated as sidenotes beside their reference; the numbered footnotes stay at the end for screen readers and print.
- **Caution panel.** Every `callout warning`, always in the text column: a 2 px carmine rule with a filled carmine tab reading "Caution" with a warning triangle, text in ink at body size, a carmine hairline below. Notes and cautions differ in label, shape, position and colour, so colour is never the only signal.
- **Listings.** Tint background, Atkinson Hyperlegible Mono at 14 px (at 1024 px; 17.5 px at 2560 px), horizontal scroll inside the block with edge shading while more is hidden, a slim strip on top with the shell name (`fish`, `bash`, `sh`, …) in italic on the left and the Copy button on the right. From 1024 px a listing reaches from the text column to the right edge of the frame (round 2, section 12.2), also inside a note (section 13); a listing inside a Caution panel stays in the panel, one beside a margin note stays in the text column and scrolls (round 3, section 14.2), and one inside a margin note stays in the note, one step smaller. Ink means "type this", a lighter pencil means "output"; flags, strings, variables and numbers have muted ink colours and keywords are bold, never italic (section 12.4). The code-block hook restores each fence's final newline before highlighting, because Chroma's fish lexer otherwise read the last line of expected output as a command (76 listings in chapters 1 to 5), and it marks flags in sh and bash listings, which Chroma leaves unmarked.
- **Tables.** Booktabs rules (ink above and below, ink under the header, hairlines between rows). A table that is wider than the column becomes a keyboard-focusable scroll region named after its section ("Table: 3 Install Ubuntu on an encrypted system disk"); a table that fits is neither a region nor a tab stop (checked again on resize). Tables on one page that share a header row (the eleven BIOS menus of the Wyse chapter) get identical column widths, so they read as one series; a row without a note runs on under the Note column. From 1024 px a table whose natural width is more than the text column takes the space to its right as well, no wider than it needs (round 2, section 12.2), unless a margin note is beside it (round 3, section 14.2). From 640 px a first-column label up to 15.5em wide never wraps, and a first column with longer labels keeps at least 9.5em (round 3, section 14.3), except where wrapping labels makes a table clearly shorter from 640 to 1279 px (section 21); a series is measured again when the fonts load and when the window changes width. Below 640 px, tables with three or more columns reflow into rows labelled from the header ("Setting: …", "Note: …"), each titled by its first cell, and a two-column table becomes a list of entries where that keeps its paths whole. Code in a cell breaks after a slash or a hyphen, never inside a word; a number keeps its unit (section 21).
- **Diagram** (the Mermaid figure in "My backup strategy"). Set in Literata with the colour tokens (ink boxes and labels, pencil lines and line labels), so it follows the theme toggle. It keeps a minimum width of 55rem instead of shrinking to the column: labels render at about 11 px instead of 7 px. From 1024 px (1280 px in round 1) it also takes the space to the right of the text, as a wide figure does in a book, unless a margin note is beside it (round 3); where that is still too narrow, it scrolls sideways inside its box with edge shading. In print it fits the page width.
- **Figures** with their credit visible in italic; **video box** 16:9 in tint with a drawn play mark, "Play the video" and "Loads the player from YouTube"; **kbd** as small mono keycaps; **blockquote** and **hr** in pencil.
- **End matter.** "Something wrong or out of date?" with Suggest an edit and Open an issue; Buy me a coffee; previous and next in contents order, each under an ink rule. They stay on their side of the book: chapters lead to chapters and earlier editions to earlier editions ("Previous in the appendix", numbers in pencil), so the last chapter does not lead into A.1, a guide for an end-of-life release.
- **Index** (the tag index). In two columns from 768 px. Letter groups in carmine; each term (as written in the content, lowercase) followed by the chapter numbers that use it, as locators, earlier editions in pencil; each locator names its chapter for screen readers and on hover. On touch screens every locator is at least 24 × 24 px and the lines open up to match. The search field sits above it.
- **Search.** A dialog opened from the running head or with `/`; inline on the index and on the 404 page. Results show chapter number, short title, the matching section (linked to its anchor) and "Earlier edition"; current chapters are listed before earlier editions. In the dialog the field and Close stay in view; only the results scroll.
- **Links in the text.** Relative links are resolved against the page's own address, exactly as a browser does, so print can name their site address; everything else is rendered as written. The old site's relative links (`../../install-guides`, `../../timeshift`, `../../references/`, `../../backup/#5-…`), which resolved to nothing, were redirected by a map in the link hook in round 1; since 18 November 2026 the Markdown itself is fixed (section 12.6), and the review removed the map (section 13), so the link check of the build reports any link that goes nowhere.
- **Section and tag pages.** The part of the contents for that section or term, with a sentence that counts chapters and earlier editions.
- **404.** "This page is not in the contents", the search, and a link to the contents.
- **Privacy.** A plain chapter-like page with its TOC and "Last revised"; the Impressum address keeps the line breaks it has in the source.
- **Colophon footer.** © 2020–2026 Willi Mutschler, CC BY-SA 4.0 (linked), Privacy and Impressum, Source on GitHub, RSS feed, and the typefaces it is set in. Set to the page's frame, like the running head.
- **Favicon.** A carmine pilcrow on paper (`static/handbook-mark.svg`), the rubricator's paragraph mark; no logos.

## 6. Interactions and keyboard shortcuts

| Key or control | Effect |
|---|---|
| `/` | Opens the search (focuses the inline search on the index and 404 pages). Ignored while typing in a field or with a modifier key. |
| Enter in the search field | Moves focus to the first result. |
| Arrow Down / Arrow Up | Move between results and back to the field. |
| Esc | Closes the search dialog and the TOC dialog (native `dialog`); a click on the backdrop does too. |
| Theme toggle | Switches light and dark, stores `handbook-theme` in `localStorage` (try/catch); an inline script in `<head>` applies it before first paint; `theme-color` follows. |
| Running-head section button (phones) | Opens the TOC dialog with the current section centred in the list and focused; the dialog's title and Close stay in view; choosing a section closes it. |
| Copy | "Copy" becomes "Copied" (base.js). Video loads only after a click (base.js). |
| Without JavaScript | The Search button and the theme toggle are hidden, because they cannot work; the theme follows the system setting and the index at `/tags/` still finds terms. Every TOC entry is unfolded. Short notes, also those marked `margin`, stay in the text column and wide tables in the column (round 2); tables keep the browser's own column widths (round 3). |

Motion: none. Nothing animates on load or scroll; dialogs and the details block open instantly; `prefers-reduced-motion` disables transitions and smooth scrolling anyway.

## 7. Principles

1. The typesetting is the design. No decorative imagery, no cards, no gradients.
2. Numbers are structure. Chapter numbers come from the order of the contents; section numbers come from Willi's own headings and are never invented; numbers hang in the margin so text aligns.
3. One spot colour with fixed jobs: numbers, link underlines, caution, the current section, focus.
4. The margin is for asides: short notes go there; warnings never do. Wide material (listings, wide tables, the diagram) may cross it, as a wide figure crosses the margin of a book (round 2), but beside a margin note it stays in the text column, so the note sits next to what it comments on (round 3).
5. Every fact is real: the catalogue, the stats partial, the author page or git.
6. Print is a first-class output: navigation hidden, chapter numeral and facts kept, URLs printed after external links and site addresses after internal ones (relative links in the content included, since the link hook makes them root-relative), listings wrap instead of scrolling and keep their token colours (legible in greyscale too), short listings and table rows do not break across pages, figures capped at 70 mm, the diagram fitted to the page, margin notes printed inline at their place (whatever the screen layout was, and also those marked `margin`), notes one step below the text (9.5 pt; section 13), a series of tables kept aligned (round 3), caution text at body size with the tab and rules carrying the emphasis, light paper even when the system is in dark mode.

## 8. Self-review (plan against the brief and against a generic tech blog)

I wrote down what I would produce for "a redesign of a Linux tech blog" by default, compared it with the plan, and changed every place where they matched.

| Default for a tech blog | What I changed it to | Why |
|---|---|---|
| Hero with a headline and a grid of post cards with tag pills and dates | A contents page: parts, hanging chapter numbers, dotted leaders, reading time | Cards hide order and length; the contents page shows both, and the guides are a book already (`type: book`). |
| Dark code blocks in a popular editor theme, traffic-light dots | Listings in a tint of the paper, the shell name in italic, Copy | A listing is part of the page and must print; the shell name is the information readers need. |
| Teal or blue accent, because it looks "technical" | Carmine | It is the book's historical second colour and the safety colour for caution, so one colour does both jobs; blue would collide with "Boot menu". |
| Warning box with a coloured left border and tinted fill | Caution panel with a signal-word tab between carmine rules | Borrowed from printed safety messages; it interrupts the procedure, which is its job. |
| "CHAPTER 7" all-caps eyebrow above the title | The numeral alone, large, in the margin; "Chapter" only for screen readers | All-caps eyebrows are a tell; the numeral is display type that carries meaning. |
| Metadata line "Dec 10, 2025 · 35 min read · Linux" | A `dl` of labelled facts | Facts as structure; no dot strings. |
| Tag cloud or tag pills | A printed-book index with chapter numbers as locators | Same data, more useful: you see which chapters use a term. |
| Auto-numbered TOC (1, 2, 3 for every guide) | Only the numbers already in the headings | Inventing numbers for post-install guides would misstate their structure. |
| Sticky header with logo and menu | A running head; sticky only on phones, where it shows the current section | On wide screens the TOC already orients; on phones the reader needs "where am I" more than a logo. |
| Round avatar crop | Willi's photo at its own ratio | The photo shows him at his desk with the microphone; cropping it to a circle loses that. |
| A sans for UI next to the serif | Literata for everything except code | Two families are enough; labels in small italic read as a book. |

Checks against the list of tells in BRIEF.md: the paper is cool, not cream; the accent is a cool red, not terracotta, and the dark mode is slate, not black with a neon accent; there are no broadsheet columns or hairline grids (rules appear under the running head, in tables, above the facts and around the notice and caution); no cards or shadows (the only shadow lifts open dialogs off the page); no all-caps labels; no middle-dot strings; no "Word — fragment" labels; mono only for code, keys and the `/` key hint; no arrows appended to links; no single coloured word in a headline.

Accessory removed before building: a "bookmark ribbon" that would have remembered the last section read and shown it on the contents page. It is charming but it is a second idea; the contents page and the margin notes are the idea.

## 9. Build review: what the screenshots changed

Three rounds of screenshots (1440 × 900 and 390 × 844, light and dark, every page type, plus 768, 1100 and 1920 wide, interactive states through a test harness, and a printed PDF) led to these changes:

| Seen in the screenshots | Change | Why |
|---|---|---|
| A margin note floated beside the next heading (section 2) although it belonged to section 1 | A small script lifts each margin note level with the block before it; footnote sidenotes align with their reference | A sidenote must sit next to what it comments on. |
| The earlier-edition notice was a box with a thick left border | Ink rules above and below, label hanging in the gutter | The box was the generic alert shape; the hanging label belongs to the handbook's grid. |
| Previous and next chapter were two bordered boxes | Plain lines under an ink rule | They read as cards. |
| Search listed earlier editions above the current chapter for "luks" | Current chapters first, then earlier editions | Most readers want the current guide; the base scoring ranks them about equally. |
| Contents summaries wrapped to two lines | Cut at about 100 characters | The brief asks for one line on the contents page. |
| The text column held 72.5 characters per full line (measured) | Column narrowed from 38rem to 35rem: 66.8 characters; the margin-note column gained the space | The brief asks for a measure around 66. |
| Comments in listings were italic | Roman, in pencil | Comments here are mostly expected output; italics made it harder to compare with the screen. |
| Long listings were clipped with no hint | Edge shading while more is hidden | Readers need to know a command continues. |
| The BIOS tables had different column widths from one menu to the next | Same widths for tables that share a header | They are one series and should read as one. |
| The play mark rendered as a square | Drawn with `clip-path` | Hugo's CSS minifier rewrites `currentColor` to `initial` inside a multi-value `border-color`, which voids the declaration. |
| The phone running head overflowed by 8 px at 360 px with a classic scrollbar | Tighter spacing; "Contents" drops out below 384 px | No horizontal page scroll at 360 to 430 px. |
| "A.13" wrapped inside the number column on phones | Wider column, smaller numerals for earlier editions | Numbers must stay whole. |
| Phone chapter openers filled the whole first screen | Phone standfirst one step smaller | The first step should be closer. |
| The Impressum address ran together into one line | Line breaks from the source kept for that paragraph | An address needs its lines. |
| Photos glared on dark paper | 86 % brightness in dark mode | Comfort, without altering colours. |
| Printed figures took most of a page | Capped at 70 mm | Paper is for the steps. |

Second accessory removed after building: the faint `§` heading anchors on touch screens. They added noise to every heading on phones, and the TOC links already give each section's address; on keyboards and mice they still appear on focus and hover.

## 10. Files and overrides

- `data/handbook.yaml`: subtitle, parts and the appendix (curated grouping of the catalogue), and the number of chapters in the revision history. (Round 1 also kept `legacy` here, the map for the old site's relative links; removed in the review of round 2, section 13.)
- `layouts/partials/handbook/`: `chapters.html` (contents order and numbering, cached), `entry-for.html`, `contents.html`, `entry.html`, `split-title.html`, `toc.html` (numbered TOC), `facts.html`, `notice.html`, `endmatter.html`, `runninghead.html`, `search.html`, `colophon.html`.
- Overrides of `themes/base`: `_default/_markup/render-heading.html` (hanging numbers; ids unchanged), `_default/_markup/render-codeblock.html` (same markup; restores the final newline so the last line of output stays a comment; from round 2 also marks flags in sh and bash listings), `shortcodes/callout.html` (margin-note rule and, from round 3, the `margin` and `inline` placement in a second parameter, which the base shortcode ignores; "Caution" label, self-labelled notes; same markup API), `index.json` (adds chapter number, kind and heading anchors; fixes two base issues: headings inside code fences were indexed, such as the shell comments "## Put in your first yubikey" in `fedora-post-install`, and heading strings kept HTML entities such as `Docker&rsquo;s`). New: `_default/_markup/render-link.html` (relative links made root-relative; everything else as written).
- `assets/css/handbook.css` (minified and fingerprinted through Hugo Pipes, 40.8 KB; 39.5 KB in round 2, 38 KB in round 1), `assets/js/handbook.js` (built with `js.Build`, 14.9 KB; 11.8 KB in round 2, 9.6 KB in round 1).
- Config: `titleCaseStyle = "none"` keeps index terms as written ("btrfs", "dell wyse").

## 11. Review changes

An independent critic reviewed the built prototype (every page type at 360 to 1920 px, light and dark, print, a crawl of all links, the Markdown against the rendered HTML). The concept and the signature stayed as they were; these are the changes, in the order of the review's findings.

| Finding | Change | Where |
|---|---|---|
| The contents' second line was the summary cut at 100 characters: 10 of 12 entries ended in "…", 6 opened with the same boilerplate, and none said which release a chapter covers or how current it is | Each chapter's line now reads "Written for Pop!_OS 24.04; revised 15 December 2025." (catalogue release and git date; "published" when never revised). Notes chapters show their full one-sentence summary. No truncation anywhere; `oneline.html` removed | `partials/handbook/entry.html` |
| In 76 fish listings (chapters 1 to 5) the last line of expected output was set in command ink, with bold tokens: Chroma's fish lexer needs a final newline that Hugo strips | The code-block hook highlights each fence with its final newline restored; all 354 listings that end in a `#` line now end in pencil. The visible text of all 1,051 listings is unchanged (checked against the previous build) | `_markup/render-codeblock.html` |
| In numbered TOCs, unnumbered sub-sections sat to the left of their parent's title (side TOC, phone block and dialog of 14 chapters) | They line up with the text of numbered sub-sections, one level inside the parent (84 px against 64 px at 390 px) | `handbook.css` (TOC lists) |
| On phones the TOC dialog opened scrolled down to the current section, with its title and Close button out of view; the search dialog did the same with many results | Both dialogs are flex columns: head, field and footer stay in view, only the list scrolls; the script centres the current section inside the list instead of scrolling the dialog. Dialog height follows the visible viewport (`dvh`) | `handbook.css` (dialogs), `handbook.js` |
| The backup diagram was shrunk to the column: 7 px labels at 1440, about 5 px on a phone, in Trebuchet and grey, not following the theme | Minimum width 55rem, the right margin on wide screens, sideways scrolling with edge shading below; Literata and the colour tokens (measured as Mermaid sizes the boxes). Labels now render at about 11 px | `handbook.css` (diagram) |
| 43 internal links from the content resolved to no file (the old site's `../../install-guides`, `../../timeshift`, `../../references/`, `../../backup/`) | A link hook sends them to Part I, chapter 11 and chapter 12, with the old numbered anchors of the backup chapter mapped to the current ones. A crawl of 5,294 internal links now finds one broken link, a content error (below) | `_markup/render-link.html`, `data/handbook.yaml` |
| Previous and next crossed from chapter 12 into A.1; A.n numbers were carmine in the running head and pager | Previous and next stay within the chapters or within the appendix ("Previous in the appendix"); earlier-edition numbers are pencil in the running head, pager and revision history too | `partials/handbook/endmatter.html`, `runninghead.html`, `index.html`, `handbook.css` |
| "Code blocks 1" on the backup chapter, whose only fence is the diagram | Mermaid fences are not counted; the field is left out when nothing is left | `partials/handbook/facts.html` |
| Single words alone on the last line of display type ("server.", "Timeshift") | `text-wrap: balance` on display lines, `pretty` on paragraphs and leads; non-breaking spaces inside dates | `handbook.css`, `entry.html`, `index.html` |
| The running head and colophon sat in an 80rem box (left edge 104 px at 1440, missing the 352 px contents column and the 128 px TOC column); the footer was inset 24 px on phones, the page 16 px | Both are set to the page's frame (`--frame` per page kind and breakpoint) with the page's padding, so they range with the text block everywhere | `handbook.css` (tokens, running head, colophon) |
| Quiet links (byline, revision subjects, side links, index terms) were marked only by a hairline-coloured underline (1.5:1) | Their underline is pencil (7.5:1 light, 7.2:1 dark), still 1 px | `handbook.css` |
| Index locators were about 21 px tall and 9 px wide on phones (WCAG 2.5.8) | On coarse pointers each locator is at least 24 × 24 px, right-aligned so the comma stays against its number; lines open up to 1.9 | `handbook.css` (index) |
| TOC and running-head text ran number and title together ("Step 3Configure …") | A real space between number and title in the TOC partial, the running-head script and the search results | `partials/handbook/toc.html`, `handbook.js` |
| Three notes that begin with Willi's own "Note on …:" read "Note. Note on …" | The theme's label is visually hidden on such notes (kept for screen readers); margin notes keep their carmine rule | `shortcodes/callout.html`, `handbook.css` |
| Every table was a focusable region named "Table", 11 on one page, even where nothing scrolls | Only a table wider than its column is a region and tab stop, named after its section; re-checked on resize | `handbook.js` |
| The privacy page's TOC said "In this chapter" | "On this page" / "Sections of this page" | `_default/single.html`, `runninghead.html` |
| Printed cautions were set at 13.5 pt against 10.5 pt body text | Body size in print; the tab and rules carry the emphasis | `handbook.css` (print) |
| Search and theme buttons did nothing without JavaScript | Hidden when the `js` class is absent | `handbook.css` |

Found while verifying these changes:

- The phone contents lines broke dates between day and month ("revised 15 / December 2025"), and the section lead broke "10 / chapters": dates and counts are now set with non-breaking spaces.
- Relative internal links printed without an address, contrary to the print principle: the link hook resolves them against the page's address (as the browser does), so print names their site address. All 1,288 links in chapter text resolve to the same place as before, apart from the legacy ones.
- Balancing the multi-line leads of the index and 404 pages made them look like a narrower measure; leads use `pretty`, only display lines are balanced.

Content errors to report to Willi (the content is read-only here; both were fixed in the Markdown on 18 November 2026, see 12.6):

- `content/linux/raspi-post-install.md`, line 398: `[swapfile on btrfs](../-20-04/#option-b-swapfile)` points to no page. The only page with that anchor is `ubuntu-btrfs-20-04`.
- `content/apple/macos-post-install.md`, line 633: `[VScode](#visual-studio-code-free)` points to an anchor that no heading on the page has.

Verified after the changes: zero Hugo warnings (also with `--printPathWarnings`); no duplicate ids; all 648 search-index anchors resolve; no horizontal page scroll on any of the 35 pages at 360, 390, 768, 1024, 1280 or 1920 px; every listing's visible text unchanged; pages checked by screenshot at 1440 and 390 px in light and dark, at 768 and 1024 px, and in print.

## 12. Round 2 changes (Willi's feedback, 18 November 2026)

Willi keeps the Handbook. His screenshot: chapter 8, section 7, in Safari at about 2000 px wide. The chapter's contents and a narrow text column sat in the left half, the right third of the window was empty, the listing was cut off after about 75 characters, and the text looked small for the window. He asked for text that scales with the window on a computer, and for colour in the listings that tells commands, comments and the rest apart, "not just greyscale but something subtle but still distinguishable". The revision brief (`redesign/briefs/handbook-revision.md`) turned this into three changes, below. Concept, palette, typefaces, contents page, margin notes, Caution panels, print, phones and tablets stay as they were.

### 12.1 The page grows with the window

The root font size is fluid from 1024 px. Every size and width in the stylesheet is in rem, so type, columns and spacing grow together:

```css
@media (min-width: 64rem) { html { font-size: clamp(1rem, .9rem + .15625vw, 1.025rem); } }
@media (min-width: 80rem) { html { font-size: clamp(1.025rem, .705rem + .4vw, 1.25rem); } }
```

The rem inside these formulas and in every breakpoint is the browser's default size, so a reader who sets a larger default gets larger type, and the breakpoints move with it. Below 1024 px the root stays at the default (16 px): phones and tablets are unchanged.

A chapter's two margins (the TOC on the left, the notes on the right) grow faster than the type, so that a wide window is filled with balanced outer margins instead of a narrow island: `--side-w: clamp(14.5rem, 60px + 13.28vw, 20rem)` and `--note-w: clamp(14rem, 25.78vw - 100px, 28rem)`. The text column (35rem), gutter (4rem) and gap (3rem) grow with the type only, so the measure stays at 66.8 characters. (Round 3 widens the text column from 1280 px to about 74 characters at 2000 px: section 14.1.) The type stops growing at about 2200 px and the margins at 2560 px; a wider window only adds outer margin.

Measured in Chrome on chapter 8 (px):

| Window | Root | Body text | Code | TOC column | Text column | Right margin | Frame | Each outer margin |
|---|---|---|---|---|---|---|---|---|
| Round 1 at 2000 | 16 | 18 | 14 | 240 | 560 | 272 | 1232 (62 %) | 384 |
| 1024 | 16.0 | 18.0 | 14.0 | 216 | 560 | 96 (free column) | 976 (95 %) | 24 |
| 1280 | 16.4 | 18.5 | 14.4 | 238 | 574 | 230 | 1206 (94 %) | 37 |
| 1440 | 17.0 | 19.2 | 14.9 | 251 | 596 | 271 | 1290 (90 %) | 75 |
| 1680 | 18.0 | 20.3 | 15.8 | 283 | 630 | 333 | 1426 (85 %) | 127 |
| 2000 | 19.3 | 21.7 | 16.9 | 326 | 675 | 416 | 1608 (80 %) | 196 |
| 2560 | 20.0 | 22.5 | 17.5 | 400 | 700 | 560 | 1860 (73 %) | 350 |

The frame (TOC, gutter, text, gap, margin and side padding) still sets the running head and the colophon, so they range with the page at every width. The contents, section, index, tag and 404 pages keep their single 46rem column, which grows with the type (736 px at 1024 px, 920 px from about 2200 px): a contents page is a column of entries, and its design did not change. (Round 3 widens it with the text column: section 14.1.)

### 12.2 Listings, wide tables and the diagram use the margin

From 1024 px a listing starts 1rem to the left of the text column, as before, and reaches the right edge of the frame: across the free fourth column from 1024 to 1279 px, across the gap and the whole margin from 1280 px. Listings inside notes and Caution panels stayed inside the panel in round 2; since the review, listings inside notes reach the frame's edge too and only a Caution panel keeps its listing (section 13). A line that is still longer scrolls inside the listing; the edge shading that shows more is hidden is stronger than in round 1 (`--shade` .16 instead of .11 in light, .5 instead of .45 in dark).

```
 In this chapter      7   Backup disks, snapshots, alerts and the Home Assistant share
 …                        Set this up before either Nextcloud path, …
 7 Backup disks, … ▌      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   7.1 Alerts to …        Job              When          From → to            Reports to healthchecks.io as
   7.2 Prepare the …      BTRBK snapshot   Hourly        Live subvolumes → …  dell-wyse-btrbk-snapshot
                          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                          On Ubuntu, install Tailscale from its signed        ──
                          repository, as with Docker in section 6, and …      Note
                          approve the device if device approval is on.        A leftover dell-wyse node. …
                         ┌ sh ──────────────────────────────────────────────────────────────────── Copy ┐
                         │ sudo apt install --no-install-recommends tailscale -y                         │
                         │ sudo tailscale up --hostname=dell-wyse --advertise-tags=tag:server …          │
                         └────────────────────────────────────────────────────────────────────────────────┘
 |← TOC →|← gutter →|←───────── text column 35rem ─────────→|← gap →|←──── margin ────→|
```

Characters per line of a listing (Atkinson Hyperlegible Mono advances 0.632 em), and the share of the guides' listings (1,017, without the diagram) and code lines (6,984) that fit without scrolling:

| | Round 1 | 1024 | 1280 | 1440 | 1680 | 2000 | 2560 |
|---|---|---|---|---|---|---|---|
| Characters per line | 63 | 72 | 92 | 95 | 100 | 105 | 117 |
| Listings that fit whole | 55 % | 64 % | 75 % | 77 % | 79 % | 81 % | 86 % |
| Code lines that fit | 78 % | 84 % | 91 % | 92 % | 93 % | 94 % | 96 % |

Listings that still scroll, measured: chapter 8 (102 listings) 68 in round 1, now 63 at 1024 px, 51 at 1280, 43 at 2000 and 31 at 2560; chapter 1 (43) 15, now 12, 8, 5 and 3; chapter 6, macOS (35) 8, now 6, 5, 3 and 0; A.9, Fedora 33 (24) 9, now 8, 7, 7 and 6. What still scrolls at 2560 px holds lines of more than 117 characters: long URLs and keys, and explanations written on one comment line.

Tables follow the rule the diagram already had in round 1, that a wide figure may cross the margin. handbook.js measures each table's natural width (every cell on one line); a table wider than the text column is marked `table-wrap--wide` and from 1024 px takes the space to its right as well, but only as much as it needs (`width: auto`, at least the column). A table that fits stays in the column. Tables of one series (the eleven BIOS menus of chapter 7) are marked together, so their columns stay aligned. In Willi's screenshot section, the four-column table (Job, When, From → to, Reports to healthchecks.io as) now spans text and margin, and `dell-wyse-btrbk-snapshot` no longer breaks inside the word. Wide: 9 of the 14 tables in chapter 8, all 11 in chapter 7, the one in chapter 9; from 1024 px no table scrolls. The diagram of chapter 12 now takes the space to the right from 1024 px too (from 1280 px in round 1).

### 12.3 Margin notes and listings: the rule

Superseded in round 3 (section 14.2): the margin note now keeps its place and the listing, wide table or diagram beside it stays in the text column; rules 3 to 5 below are gone. This section records round 2.

Listings, wide tables and the diagram cross the margin; margin notes live in it. From 1280 px, handbook.js (`alignNotes`) places every margin note and footnote sidenote by this rule:

1. A note starts level with the block it comments on (a sidenote level with its footnote reference), and never above the note before it.
2. A note never sits beside a listing, a wide table or the diagram (since the review also a listing inside an inline note, section 13); it keeps 1rem clear of them.
3. If one is in the way, the note may end just before it, as long as at least a line of it still sits beside the paragraph it comments on, it rises no more than 8rem, and it stays below the heading of its own section. A note that comments on a listing (the listing is the block before it) has its place right below that listing.
4. Or the note may start just below the listing (or listings) in the way, if that is no more than 8rem further down. Of 3 and 4, the nearer place wins.
5. If neither is possible, the note is set in the text column, exactly as longer notes always are, and a footnote's sidenote is left out (the footnote itself stays at the end of the chapter).

A note in the margin never moves the text. The rule runs again on resize, since the root size and the columns change with the window. Without JavaScript nothing can place the notes, so they all stay in the text column (in round 1 they floated into the margin unaligned, which would now risk overlapping a listing). Outcome: 18 short notes in 7 chapters; from 1440 px 13 sit in the margin (12 at 1280 and 1366 px), the rest in the text column. Those are the four notes in chapters 2, 3 and 4 that comment on a listing and are followed by a short paragraph and another listing (in round 1 they sat beside their listing, which now spans the margin), and one or two in chapter 8 with a listing close below them. The three footnote sidenotes (chapters 1 and 10, A.8) all stay in the margin. Checked by measuring every note against every listing, table, diagram and other note on all pages with notes or sidenotes at widths from 1280 to 3000 px: nothing touches.

### 12.4 Listing colours

Ink still means "type this", and colour tells the parts of a command apart. The hues are printing inks from the handbook's world of paper, ink and carmine: Prussian blue, viridian, violet and yellow ochre, all muted and set to the same weight (about 6.5 to 6.8:1 on the listing tint), a clear step below the command ink and above the output. Carmine is never a token colour: it means chapter numbers and Caution.

| Token | Chroma classes | Light | On tint `#E8EBEE` | Dark | On tint `#272C33` | Print, on `#F0F1F3` |
|---|---|---|---|---|---|---|
| Commands | plain text (sh, bash), `nf` (fish); operators, punctuation, escapes | ink `#1C1F24` | 13.8:1 | ink `#E3E5E8` | 11.1:1 | `#000000`, 18.6:1 |
| Keywords and builtins | `k`, `kc`, `kd`, `kn`, `kp`, `kr`, `kt`, `nb`, `bp` | ink, bold | 13.8:1 | ink, bold | 11.1:1 | bold |
| Flags | `na` (fish; in sh and bash marked by the code-block hook) | `--code-flag` `#2A517E` | 6.8:1 | `#91B8E4` | 6.8:1 | 7.2:1 |
| Strings, heredocs | `s`, `s1`, `s2`, `sa`, `sb`, `sc`, `sd`, `sh`, `sr`, `ss`, `sx`, `dl` | `--code-string` `#235D42` | 6.5:1 | `#81C2A1` | 6.8:1 | 6.8:1 |
| Variables, interpolation, json and yaml keys | `nv`, `vc`, `vg`, `vi`, `vm`, `si`, `nt` | `--code-var` `#6A3D7E` | 6.8:1 | `#CDA7DD` | 6.8:1 | 7.2:1 |
| Numbers | `m`, `mb`, `mf`, `mh`, `mi`, `mo`, `il` | `--code-number` `#6E4C10` | 6.5:1 | `#D3B068` | 6.8:1 | 6.9:1 |
| Comments and expected output | `c`, `c1`, `cm`, `ch`, `cs`, `cpf`, `cp` | `--code-comment` `#545D67` | 5.6:1 | `#99A1AC` | 5.4:1 | 5.9:1 |
| Lexing errors | `err` | plain text, no box | | | | |

- Comments and expected output are 54 % of all code lines. They are a lighter pencil than in round 1 (`#545D67` for `#4A515B`, 5.6:1 for 6.7:1; dark `#99A1AC` for `#A7AEB7`), so they read as clearly secondary to the commands (2.5:1 between comment and command ink in light, 2.1:1 in dark) and stay comfortable for `lsblk` tables. Roman, never italic.
- Plain text and `nf` share the ink, so fish and bash listings look alike. Chroma's bash lexer does not mark flags, so the code-block hook does: in sh and bash listings, a word that starts with `-` or `--` and a letter, after a space, in plain text (never inside a comment, string, variable or other token) gets the class `na`. That marks 1,108 flags; the visible text of all 1,051 listings is unchanged (compared with the round 1 build), and Copy copies the same text.
- Keywords and builtins (`for`, `if`, `$(`, `echo`, `cd`, `export`) stay bold ink as in round 1: structure, without another colour.
- `gd` and `gi` (diffs; not used in the guides) are ochre struck through and viridian, so no token is carmine.
- Print keeps the light colours (each at least 5.9:1 on the print tint); a greyscale printer turns them into dark greys, all legible.

### 12.5 Print

The print stylesheet is unchanged apart from three fixes found while checking it:

- Margin notes printed over the text when a chapter was printed from a window 1280 px or wider: the screen script's offsets reached the paper (round 1 has the same fault, checked with its build). Print now sets the notes' margins with `!important`. Checked: chapter 1 printed from a 1600 px window.
- With the system in dark mode, the dark tokens could outrank the print tokens. The print token block now also matches `:root:not([data-theme="light"])`. Checked: chapter 8 printed with Chrome's dark mode forced comes out on light paper with the light listing colours, the same size as the light print.
- Print keeps the 16 px root and the one-column listings even when a small print scale makes the page wider than 1024 CSS px.

### 12.6 The content links

The 45 relative links of the old site structure in 14 older guides, and the three slips noted in section 11 and by Willi (`#visual-studio-code-free` in the macOS chapter, `../-20-04/` in the Raspberry Pi post-install guide, the `pop-os` tag on the Ubuntu post-install guide), were fixed in the Markdown on 18 November 2026. The link hook's map of old addresses (`legacy` in `data/handbook.yaml`) then matched no link; the review removed it (section 13), and the build's HTML is byte-identical without it.

### 12.7 Self-review

- The colour stays in the listings; nothing else gained colour, and carmine keeps its jobs (numbers, links, Caution, current section, focus).
- Nothing new was added to the page: the margin is used by what was already there (listings, tables, the diagram), by a rule a printed book also follows.
- Considered and left out: a switch to wrap long lines in listings (a wrapped command is easy to retype wrongly; the edge shading says there is more), line numbers in listings (not asked; they add noise to every line a reader retypes), a wider contents column on large screens (it would only lengthen the dotted leaders), and figures and the video in the margin (not asked; they read well in the column).

### 12.8 Verified

- Screenshots: 14 pages (contents, Linux section, chapter 1, chapter 7, chapter 8 at the top and at section 7, A.9 Fedora 33, the macOS chapter at the top and at Terminal, chapter 12 with its diagram, index, tag "btrfs", privacy, 404) at 1024×768, 1280×800, 1440×900, 1680×1050, 2000×1200 and 2560×1440, light and dark, and at 390×844; 202 in all, reviewed on contact sheets and at full size where detail mattered.
- No horizontal page scroll at 360, 390, 768, 1024, 1100, 1279, 1280, 1366, 1440, 1536, 1680, 1920, 2000, 2560 or 3000 px; the running head and colophon range with the frame at every width. At 390 px the top of chapter 8 is pixel-identical to round 1; pages with listings differ only in the listing colours.
- Print: chapters 1 and 8 to PDF from a 1600 px window, in light and with dark mode forced.
- Link check of the build: 5,289 internal references, 0 broken, 0 missing anchors. Hugo: no warnings, also with `--printPathWarnings`.

### 12.9 Files changed in round 2

- `assets/css/handbook.css`: fluid root size; the desktop columns; listings, wide tables and the diagram across the margin; note width; listing colours; print fixes.
- `assets/js/handbook.js`: wide tables; the margin-note rule of 12.3.
- `layouts/_default/_markup/render-codeblock.html`: flags in sh and bash listings.
- `DESIGN.md`: this section, and pointers to it in sections 2 to 11.

No change to the config, to `themes/base` or to the content.

## 13. Review changes (round 2)

An independent reviewer checked the round 2 build against Willi's priorities and the revision brief: every page type at 1024, 1440, 2000 and 2560 px and on a 390 px phone, light and dark; the listing colours measured against their tint; search, theme toggle, copy buttons, contents tracking and both dialogs exercised through a test page on the same origin; chapters 1 and 8 printed to PDF; every page loaded at ten widths to look for overflow; code blocks, notes, cautions and tables counted in the Markdown and in the HTML of three chapters (8: 102, 22, 5, 14; 1: 43, 3, 5, 0; macOS: 35, 0, 0, 0; all equal).

Round 2 holds up. The type and the columns grow as section 12.1 says (measured: body text 18 px at 1024 px, 19.2 at 1440, 21.7 at 2000, 22.5 from about 2200; listings 72, 95, 105 and 117 characters per line; the chapter frame 95 %, 90 %, 80 % and 73 % of the window). Every listing colour is at least 5.4:1 on its tint in both modes (comments 5.6:1 light, 5.4:1 dark; flags, strings, variables and numbers 6.5 to 6.8:1; commands 13.8:1 and 11.1:1), plain text and `nf` are both ink, `err` is plain. No margin note touches a listing, a wide table, the diagram or another note at 1280, 1366, 1440, 1680, 2000, 2560 or 3000 px. The review changed four things:

| Finding | Change | Where |
|---|---|---|
| Listings inside notes stayed inside the note: about 57 characters per line at every desktop width, so 17 of the 21 scrolled, even with an empty margin beside them (in Willi's chapter 8, the kernel messages of the hung-task note in 7.3 and the `lsusb` loop of the USB-hub note in 7.2) | They reach the frame's right edge like every other listing; the note's hairline still marks its left side. Characters per line: 68 at 1024 px, 91 at 1440, 101 at 2000, 113 at 2560. Of the 21 listings in notes, 12 still scroll at 1024 px, 8 at 1440, 5 at 2000 and 3 at 2560. A listing in a Caution panel (there are none in the guides today) stays between the carmine rules. `alignNotes` counts listings in notes as obstacles, so the rule of 12.3 keeps margin notes clear of them; placement is unchanged (13 of 18 short notes in the margin from 1440 px) | `handbook.css` (listings), `handbook.js` (`alignNotes`) |
| The link hook still carried round 1's map that redirected the old site's relative links by best guess. With the Markdown fixed it matched nothing, and it would have hidden a future broken link from the link check | Map and data removed; relative links are still resolved as a browser does. Every page's HTML is byte-identical without the map, which also confirms that the Markdown fixes cover every old link | `_markup/render-link.html`, `data/handbook.yaml` |
| The author section set Willi's about text with its eleven colour emoji (apple, penguin, nerd face, magnifier, keycap, scroll, waving hand, technologist, folded hands, speaking head): the one playful element left on the site | The about text is set word for word, without its emoji and the space before each. To show them again, replace the filtered `.Content` in `layouts/index.html` by `{{ .Content }}` | `layouts/index.html` |
| Printed notes came out at 12 pt (their 1rem screen size) against 10.5 pt text, so an aside printed larger than the procedure (also in round 1) | Notes print at 9.5 pt, like margin notes. Chapter 8 now prints on 82 pages instead of 84 | `handbook.css` (print) |

Checked and left as it is:

- The contents, section, index, tag and 404 pages keep their single centred column. It grows with the type (835 px at 1440 px, 945 at 2000, 980 at 2560), so it is not cramped, but it takes 47 % of a 2000 px window and 38 % of a 2560 px one. The revision brief keeps the contents page as it is; a wider column would only stretch the dotted leaders between title and reading time, and a second column would set earlier editions beside the current chapters. If Willi wants these pages to fill wide windows too, the next step is to set them on the chapter grid, with the side column listing the parts. (Round 3 widens the column with the text column instead: section 14.1.)
- Lines longer than a listing still scroll; the edge shading and the cut-off character show that the line goes on. Wrapping commands would make them easier to retype wrongly.
- On phones a section number runs in before the first line of its heading instead of hanging; a hanging number would take a sixth of the phone's measure from every numbered heading.
- In fish listings Chroma marks some digits inside paths as numbers (`/snapshots/2025-12-10_10-00-00/`), which colours parts of a path ochre. That is the lexer, not the palette, and it affects a handful of listings.
- Everything was checked in headless Chrome only. Willi reads in Safari: one look at chapter 8 at about 2000 px there is still worth doing (all CSS used here is supported from Safari 15.4).

Verified after the changes: Hugo builds with no warnings, also with `--printPathWarnings`; link check of the build: 5,289 internal references, 0 broken, 0 missing anchors; no horizontal page scroll on any of the 85 pages at 360, 375, 390, 414, 430, 768, 1024, 1280, 1440 or 2560 px (850 page loads); search (the `/` key and the button, results as links, current chapters first, Enter and the arrow keys, `/` typed inside a field and Ctrl+/ ignored), theme toggle with stored choice and theme colour, copy buttons (43 for 43 listings in chapter 1), heading anchors, feedback and coffee links, colophon links, the earlier-edition notices (A.9 Fedora 33 names A.8 Fedora 35), the phone running head and section dialog (current section centred and focused); without JavaScript notes stay in the text and every TOC entry is open; chapter 8 printed with dark mode forced comes out on light paper.

## 14. Round 3 changes (Willi's feedback, 19 November 2026)

Willi approved three changes: a wider text column on big screens; more notes in the margin, with an editorial override ("Sometimes the notes block (or footnotes) is to the right in an extra column (I really like that), but most of the times it is not"); and readable first table columns ("Why is the first column in the tables fixed and very small?"). Everything else stays as it was: type, colours, the contents page, Caution panels, listings and their colours, and the layout below 1280 px (apart from the table rule of 14.3, which applies from 640 px).

### 14.1 A wider text column on big screens

The text column is 35rem (about 66 characters) up to 1280 px. From there it gains 11.375 % of every further pixel of window, on top of the type, which grows too, until it reaches 39.25rem (about 74 characters) at 2000 px; after that it grows in px only with the type, which stops at about 2200 px, and from 2560 px nothing grows any more (section 12.1).

```css
@media (min-width: 80rem) { :root { --measure: clamp(35rem, 35rem + (100vw - 1280px) * .11375, 39.25rem); } }
```

The TOC column, gutter, gap and right margin keep their round 2 formulas, so the extra width comes out of the outer margins, and the margin keeps all its room for notes. Characters per line are the column's capacity: its width divided by the mean advance of the chapter's own paragraph text (chapter 8: 80 paragraphs, 432 full lines). Measured this way chapter 8 holds 66.0 in round 2 at every width and chapter 1 65.7; round 1 and 2 reported 66.8 from another sample. A full line holds about 3.5 characters fewer than the capacity, because lines break before a word that does not fit. Measured in Chrome on chapter 8 (px; round 2 in brackets where it differs):

| Window | Root | Body text | Text column | Capacity | Full line | TOC column | Right margin | Frame | Each outer margin |
|---|---|---|---|---|---|---|---|---|---|
| 1024 | 16.0 | 18.0 | 560 | 66.0 | 62.7 | 216 | 96 (free column) | 976 (95 %) | 24 |
| 1280 | 16.4 | 18.5 | 574 | 66.0 | 62.7 | 238 | 230 | 1206 (94 %) | 37 |
| 1440 | 17.0 | 19.2 | 615 (596) | 68.0 (66.0) | 64.5 (62.7) | 251 | 271 | 1307 (1290), 91 % | 66 (75) |
| 1680 | 18.0 | 20.3 | 676 (630) | 70.8 (66.0) | 67.5 (62.7) | 283 | 333 | 1472 (1426), 88 % | 104 (127) |
| 2000 | 19.3 | 21.7 | 757 (675) | 74.1 (66.1) | 70.6 (62.7) | 326 | 416 | 1691 (1608), 85 % | 155 (196) |
| 2560 | 20.0 | 22.5 | 785 (700) | 74.1 (66.1) | 70.7 (62.8) | 400 | 560 | 1945 (1860), 76 % | 308 (350) |

The note box is unchanged: 230 px wide at 1280, 271 at 1440, 333 at 1680, 416 at 2000 and 460 (23rem) from 2560 px, with 14.4 to 17.5 px type. The standfirst, the earlier-edition notice and the end matter follow `--measure`, so they range with the text.

Listings that cross the margin gain the same width. Characters per line (chapter 8): 92 at 1280 px, 98 at 1440 (96), 105 at 1680 (100), 113.5 at 2000 (106), 125 at 2560 (117.5); a listing that yields to a note (14.2) holds 61 at 1280, 64 at 1440, 66 at 1680 and 69 from 2000 px. Of the 102 listings of chapter 8, 46 scroll at 1280 px (46 in round 2), 44 at 1440 (45), 35 at 1680 (42), 25 at 2000 (35) and 19 at 2560 (21), the listings that now yield included.

The contents, section, index, tag and 404 pages keep the proportion of their single column to the text column: `--page-w: calc(var(--measure) / 35 * 46)`, so 46rem up to 1280 px, then 808 px at 1440 (784), 888 at 1680 (828), 995 at 2000 (887) and 1032 at 2560 (920), 53 % of a 2000 px window with its padding (47 %). The running head and colophon follow, through `--frame`. On the contents page the leaders get longer, the revision table and the author's text gain room; the entries fit on one line already. To keep these pages at 46rem, set `--page-w: 46rem`. The privacy page is set on the chapter grid and takes the wider text column.

### 14.2 The margin note wins

Which notes go to the margin: the rule of section 5 is unchanged (a note of at most 500 characters with no code block, list, table, figure or other block), and every footnote is repeated as a sidenote. The Markdown can now override the rule, as a purely editorial choice:

| Markdown | Where the note goes |
|---|---|
| `{{< callout note >}}` | by the rule |
| `{{< callout note margin >}}` | in the margin, however long it is and whatever it holds |
| `{{< callout note inline >}}` | in the text column |
| `{{< callout warning >}}` | always a Caution panel in the text column; `margin` on a warning is ignored, with a build warning |

A note in the margin is there from 1280 px; below 1280 px, in print and without JavaScript every note is in the text column, also one marked `margin`. An unknown placement (`margn`) gives a build warning with file and line and keeps the rule. The override is read only by `themes/handbook/layouts/shortcodes/callout.html`, which records it in `data-place`; the base shortcode reads only the first parameter, so the other prototypes render the same Markdown as before. In the margin a listing inside a note stays inside it, one step smaller (`.8125rem`) and scrolling with its edge shading; lists and tables stay inside the note box too.

Placement (`alignNotes` in handbook.js), from 1280 px, for each margin note and sidenote in the order of the text:

1. The note starts level with the block it comments on (the block before it; a sidenote level with its footnote reference; a note inside a list item, the block before it in the item, or the item when the note opens it, section 15), and at least 1rem below the note before it, so notes never overlap. It is a float in the margin, so it never moves the text.
2. Every listing, wide table or diagram that would cross the margin within the note's height, with 1rem to spare above and below, yields: handbook.js marks it `is-yielding` and it stays in the text column. A listing then scrolls inside, with its edge shading; a wide table is set like any table in the column (full width, its cells wrap; a table of a series leaves the shared widths, 14.3); the diagram keeps its minimum width and scrolls. A listing inside an inline note counts as well; a listing inside a Caution panel never crosses the margin anyway.
3. A table that yields can grow taller, so the note's place and what it overlaps are measured again before the note is moved.
4. Everything else keeps crossing the margin. Nothing is moved away from what it comments on and nothing is hidden: round 2's rules 3 to 5 (end the note before a listing, start it below one, or set it in the text column and leave out a footnote's sidenote) are gone.

The rule runs again after the web fonts load, when the page has loaded (images), when the window changes width (150 ms after the last change) and when Mermaid, which draws after the page has loaded, changes a diagram's height; every run starts afresh, with all wide elements across the margin and every note at its place in the text.

Outcome, measured on every page with notes (N = short note, S = footnote sidenote; M = in the margin at 1280, 1440, 2000 and 2560 px, – = in the text column):

| Chapter | Note | Characters | Round 2 | Round 3 | What yields to it |
|---|---|---|---|---|---|
| 1 Pop!_OS 24.04 | S "If you already have (a previous version of) Pop!_OS …" | 163 | MMMM | MMMM | nothing |
| 1 | N "Note on discard=async: …" | 336 | MMMM | MMMM | nothing |
| 1 | N "If the LVM group is not activated, see this issue …" | 59 | MMMM | MMMM | nothing; follows 6 lines after the note before, so it sits right below that one, 61 px under its paragraph at 1280 px and 15 at 1440, level from 1680 px |
| 2 Debian 13 | N "debian–vg-root: …" | 169 | –––– | MMMM | the 3-line listing it comments on |
| 2 | N "Note on GRUB: …" | 230 | –––– | MMMM | the 2-line listing it comments on; at 1280 and 1440 px also the next one-line listing |
| 3 Pop!_OS after installation | N "I use the same LUKS passphrase across all disks …" | 176 | –––– | MMMM | the 4-line listing it comments on |
| 4 Ubuntu after installation | N the same note | 177 | –––– | MMMM | the 4-line listing it comments on |
| 7 Dell Wyse 5070 hardware | N "Be patient after the RAM upgrade." | 119 | MMMM | MMMM | nothing |
| 8 Dell Wyse 5070 server | N "SSH into the installer." | 439 | –––– | MMMM | the 33-line `lsblk` listing below "Inspect first:" |
| 8 | N "If the unlock fails." | 470 | MMMM | MMMM | nothing |
| 8 | N "A leftover dell-wyse node." | 183 | –MMM | MMMM | the 19-line listing below it, at 1280, 1440 and 2560 px |
| 8 | N "UFW needs no rule for this." | 334 | MMMM | MMMM | nothing |
| 8 | N "Only the mastercontainer and the sidecar …" | 123 | MMMM | MMMM | nothing |
| 8 | N "Reconnect every client from scratch." | 113 | MMMM | MMMM | nothing |
| 8 | N "Rebuilding the Wyse." | 238 | MMMM | MMMM | nothing |
| 9 Home Assistant OS | N "I wrote this guide for Home Assistant OS 18.5 …" | 274 | MMMM | MMMM | nothing |
| 9 | N "Why the extension cable and the USB 2.0 port?" | 361 | MMMM | MMMM | nothing |
| 9 | N "If you prefer the automation editor, …" | 203 | MMMM | MMMM | a one-line listing (round 2 lifted the note 17 to 57 px above its paragraph instead) |
| 9 | N "Alternative without copying the backup: …" | 467 | MMMM | MMMM | nothing |
| 10 BTRFS | S "Granted there are always ways …" | 281 | MMMM | MMMM | nothing |
| A.8 Fedora 35 | S "Note that in a previous guide for Fedora 33 …" | 879 | MMMM | MMMM | nothing |

All 18 short notes are in the margin at every width from 1280 px (round 2: 12 at 1280, 13 from 1440), and the 3 sidenotes stay there. 20 of the 21 sit exactly level with what they comment on at every width. 8 listings yield at 1280 and 1440 px, 7 at 1680, 6 at 2000, 7 at 2560; no wide table and no diagram has a note beside it in the guides. The 23 notes that are longer or hold code stay in the text column, as before, until the Markdown says otherwise.

### 14.3 Readable first columns

What Willi saw, measured in chapter 8: the browser's automatic table layout gives each column its longest word plus a share of the rest in proportion to its one-line width, so the long description columns took the room and the first column shrank towards its longest word. At 2000 px 6 of its 14 tables wrapped first-column labels (7 at 1024 px): "2 wyse-boot", "3 wyse-swap" and "4 wyse-system" in a 122 px column, "BTRBK send/receive" broken after "BTRBK". The eleven BIOS tables of chapter 7 had fixed column widths, measured once when the page loaded.

The rule (handbook.js `labelTables`, CSS from 640 px): every first-column label, the header included, is measured on one line, in em of the table's type. A label up to 15.5em wide is marked `is-label` and never wraps (`white-space: nowrap`), so the column is at least as wide as its longest short label. A table that also has longer labels is marked `has-long-labels`: those wrap, and its first column keeps at least 9.5em for the text (`min-width: calc(9.5em + .9rem)`, the cell's padding included), so it never collapses to one word. Below 640 px tables are as before: three or more columns reflow into labelled rows (pixel-identical at 390 px). (Changed since, see section 21: from 640 to 1279 px a table also lets its labels wrap when that makes it at least 5 % shorter with the 9.5em floor, or 8 % without it; Willi kept this on 21 November 2026.)

The threshold comes from the labels of all 28 tables of the guides (chapters 7, 8 and 9), sorted by width: … 13.2, 13.7, 14.7, 14.8, 14.9 | 16.1, 16.3, 16.4, 16.9, 17.0, 17.1, 18.7 … up to 46.7em. Below 17em the widest gap lies between 14.9em ("Advanced SSH & Web Terminal", 27 characters; "Dell-Wyse-Thin-Client-5070/" and "NVMe SSD in a USB enclosure" just below) and 16.1em ("UEFI Capsule Firmware Updates", 29 characters); beyond it labels turn into phrases ("Path A, replacing another instance", "2.5″ SATA SSD in a USB 3 enclosure"). 15.5em, about 28 characters, lies in the middle of that gap, so small differences in how browsers render the type cannot flip a label. The gap from 17.1 to 18.7em is wider, but first columns of 18em would take two fifths of a table at 1024 px.

A series (tables with the same header row: the eleven BIOS menus) still shares its column widths, now measured from natural widths with the rule applied, after the web fonts load and whenever the window changes width (`fitSeries`). All its rows are laid out together in one hidden table, at the width the series takes (as wide as it needs, at least the text column, no wider than the text column and the margin), and every table of the series takes those widths. When the series has long labels, its first column is set to the floor of the rule: its longest short label ("Internal HDD-0 Password", 12.7em), at least 9.5em, so that the lists of settings in two of the eleven menus wrap instead of widening the first column of all of them. Page | Setting | Note, px: 207 | 180 | 269 at 1024 (round 2: 184 | 211 | 261), 212 | 230 | 411 at 1280, 220 | 252 | 465 at 1440 (232 | 250 | 436), 249 | 328 | 653 at 2000 (290 | 301 | 557), 258 | 373 | 774 at 2560.

First-column labels that wrap, before and after (tables with a wrapping label; labels that wrap, of all first-column labels):

| Chapter | 1024 px | 1440 px | 2000 px |
|---|---|---|---|
| 8 Dell Wyse 5070 server (14 tables, 84 labels) | 7 → 5 tables; 28 → 17 labels | 6 → 4; 26 → 13 | 6 → 4; 21 → 10 |
| 7 Dell Wyse 5070 hardware (11 tables, 48 labels) | 6 → 2; 11 → 6 | 2 → 2; 6 → 6 | 2 → 2; 6 → 6 |
| 9 Home Assistant OS (3 tables, 13 labels) | 3 → 1; 6 → 1 | 3 → 1; 5 → 1 | 3 → 1; 5 → 1 |

No label up to 15.5em wraps at any width from 640 px; what still wraps is longer: paths and lists of files in chapter 8 (`Dell-Wyse-Thin-Client-5070/docker-compose.yml`, `/etc/btrbk/btrbk.conf, dell-wyse-btrbk-snapshot.timer, …`), phrases ("B: reinstall from an AIO backup (section 9.4)", "Docker configuration and named volumes", "2.5″ SATA SSD in a USB 3 enclosure"), the lists of settings in chapter 7. First columns of chapter 8 at 1024, 1440 and 2000 px: Path 136, 176, 214 → 233, 266, 313; File 105, 141, 174 → 255, 286, 334; Partition 90, 104, 122 → 120, 128, 145; Job 118, 139, 164 → 181, 193, 218. No table scrolls and no page scrolls sideways.

One label of the BIOS series now wraps where round 2 kept it whole from 1440 px: "UEFI Capsule Firmware Updates" (16.1em, just above the threshold) breaks after "Firmware" in the first column, 13.8em wide with its padding. In exchange the four short labels round 2 broke at 1024 px ("UEFI Boot Path Security", "Expert Key Management", "Extend BIOS POST Time", "Wireless Device Enable") are whole at every width.

### 14.4 Print

- Notes print inline at their place, whatever the screen layout was, also those marked `margin` (checked: chapter 8 printed from a 1600 px window; "SSH into the installer." follows "Help → Enter shell" in the text). The yielding rules apply only from 1024 px and never reach paper.
- Tables take the page width and lay themselves out, with the first-column rule (labels whole at 9 pt). A series stays aligned on paper: every column but the last keeps its screen width in em (`--print-w`, with room for the padding, which is in rem), and the last column takes the rest of the page. Round 2 printed the screen's percentages, which with the first column at its floor could have been narrower than the labels. Checked from 1600 and 1024 px windows.
- Chapters 7 and 8 print on as many pages as round 2 printed the same way (8 and 84, Letter, from a 1600 px window).

### 14.5 Scratch site for the override

The content stays untouched, so the override was tested on a scratch Hugo site outside the repository (`themesDir` pointing to these themes, `theme = ["handbook", "base"]`, a copy of the catalogue with one test chapter). Its page holds an automatic note before a long listing, a long note marked `margin` before a wide table, a short note marked `inline` before a listing, a note with a listing marked `margin` and a listing beside it, a listing and a wide table far from any note, a series of two tables with a note before the second, a footnote before a listing, a warning marked `margin`, a misspelt placement and a short note before a Mermaid diagram. At 1280, 1440 and 2000 px every note was where its Markdown says, level with its paragraph, and exactly the expected elements yielded (the listing, the wide table, the listing beside the note with code, the second table of the series, which then lays itself out in the column, and the diagram, which then scrolls in the column); the far listing and table, and the first table of the series, kept crossing the margin; the two build warnings named file and line. At 1024 px every note was in the text column and the diagram crossed into the free column. Once Mermaid had drawn, nothing changed any more (no class or style changed in the next 3 seconds), there and on chapter 12, whose diagram has no note beside it and keeps crossing the margin.

Found there and fixed: inside a margin note the size for inline code (`.82em`) also reached the code of a listing, which came out at 11 px; listings in margin notes now keep their `.8125rem`.

### 14.6 Verified

- Hugo builds with no warnings, also with `--printPathWarnings`. Link check of the build: 85 pages, 5,336 internal references, 0 broken, 0 missing anchors.
- Every page at 360, 390, 768, 1024, 1280, 1366, 1440, 1680, 2000, 2560 and 3000 px (935 page loads): no horizontal page scroll; no margin note or sidenote overlaps another note or any block of the text, listings and tables included; 21 of 21 in the margin at every width from 1280 px, none below.
- Resizing a page loaded at 2000 px to 1280, 1024, 1440, 2560 and back to 2000 px gives the same notes, yields and series widths as loading it at each width. A change of the window's height alone (phone toolbars) does not run the layout again.
- Without JavaScript nothing floats, no table is wide, nothing overflows.
- With the browser's default size at 24 px, where the chapter grid with its margin starts at 1920 px, nothing overflows either: there the text column gives up 12 px of its width (922 instead of 934 px), since it is the one column of the grid that may shrink.
- At 390 px chapters 7 and 8 are pixel-identical to round 2 over the first 3000 px. (The contents page and chapter 9 differ only in chapter 9's reading time, 28 instead of 27 minutes: its Markdown was edited on 19 November after the round 2 build used for the comparison.)
- Screenshots: chapter 8 at 3.1 and at 7, chapter 7 at 3.1, chapter 1 and the contents page at 1440 × 900 and 2000 × 1200, light and dark, and at 390 × 844; the index, Linux section and privacy pages at 2000 px; the scratch page at 1440 px; printed pages of chapters 7 and 8.
- Checked in headless Chrome only. In Safari, one look at chapter 8 at 3.1 and at 7 and at chapter 7 is still worth it: `min-width` on table cells is honoured by WebKit's table layout as by Chrome's, but it was not tested there.

### 14.7 Files changed in round 3

- `assets/css/handbook.css`: the wider text column from 1280 px (`--measure`), `--page-w` for the one-column pages, `is-yielding`, the first-column rule (`is-label`, `has-long-labels`), listings, lists and tables inside margin notes, print rules for tables and series.
- `assets/js/handbook.js`: the first-column rule (`labelTables`), series measured from natural widths (`fitSeries`), margin notes that win (`alignNotes`, `yieldTo`), all in one layout pass after the fonts load, after the page loads, when the window changes width and when a diagram changes height.
- `layouts/shortcodes/callout.html`: `margin` and `inline` in a second parameter, with build warnings for an unknown placement and for `margin` on anything but a note.
- `DESIGN.md`: this section, and pointers to it in sections 3 to 13.

No change to the config, to `themes/base`, to other themes or to the content.

### 14.8 Left as it is

- A note that follows close after another sits right below it, however far that is from its paragraph: the margin note wins, and nothing limits the push. In the guides the largest push is 61 px (chapter 1 at 1280 px).
- A listing that yields scrolls inside the text column, the cost the revision accepted: the 33-line `lsblk` listing in chapter 8, 3.1, shows about 64 characters per line at 1440 px instead of 98.
- "UEFI Capsule Firmware Updates" wraps in the BIOS series (14.3). Raising the threshold above 16.1em would keep it whole, but widen the first column of all eleven menus by about 3em, at the cost of the Setting column at 1024 px.

## 15. Round 3 verification

An independent check of round 3 on 19 November 2026, with its own measuring scripts (headless Chrome through the DevTools protocol), against Willi's three requests and the rest of the design, compared with the round 2 build where it matters.

What holds:

- **Characters per line.** Measured from the rendered line boxes of chapter 8's own paragraphs (532 full lines): the column holds 65.5 characters at 1024 and 1280 px, 66.6 at 1366, 67.5 at 1440, 70.2 at 1680 and 73.6 from 2000 px (2560 and 3000 the same); a full line holds 61.7, 63.5, 66.5 and 69.6. Round 2's build, measured the same way, holds 65.5 to 65.6 at every width, so from 2000 px the column is 12.2 % wider: Willi's "about 66" becomes 74. Chapter 1: 65.1 at 1280 px, 73.4 from 2000. The growth is linear from 1280 to 2000 px and continuous at 1280 px. The grid at 1280, 1440, 2000 and 2560 px: TOC 238, 251, 326, 400; text 574, 615, 757, 785; gap 49, 51, 58, 60; margin 230, 271, 416, 560 (as in round 2); each outer margin 37, 66, 155, 308.
- **Margin notes.** All 18 short notes and the 3 sidenotes are in the margin at 1280, 1366, 1440, 1680, 2000, 2560 and 3000 px, none at 1024 px. 20 of the 21 sit exactly level with what they comment on; chapter 1's "If the LVM group …" sits 1rem below the note before it, 61, 41 and 15 px under its paragraph at 1280, 1366 and 1440 px. "SSH into the installer." is in the margin at every width, the 33-line `lsblk` listing beside it in the text column. Nothing overlaps: every note was tested against every element of the page, clipped to what is visible, and against every other note, on the 11 pages with notes, sidenotes or the diagram at those 7 widths; no note's text spills out of its box (147 boxes). The elements that yield are exactly those within 1rem of a note's height: 8 listings at 1280 and 1440 px, 7 at 1680, 6 at 2000, 7 at 2560. Every other listing, table and the diagram keeps crossing the margin; the nearest starts 1.06rem below a note. Resizing in one page load (1440 to 2000 px, and 2000, 1440, 1280, 2560, 1024, 1366, 3000 px in a row) gives the same notes and yields as loading the page at each width. With the web fonts held back until after the page had loaded, the first layout was off (fallback metrics) and the layout once the fonts arrived was the normal one, for notes, yields and the BIOS series.
- **The override.** A scratch site outside the repository (the repository's themes, one test chapter) holds an automatic note, a long note marked `margin` beside a wide table, a short note marked `inline`, a note holding a listing marked `margin`, a footnote, a series of two tables with a note before the second, a warning marked `margin`, a misspelt placement, a note before a Mermaid diagram, two notes in a row, a long note marked `inline` and notes inside list items. Every note is where its Markdown says at 1280 to 2560 px and in the text column at 1024 and 1279 px, in print and without JavaScript; exactly the elements beside a margin note yield; the warning stays a Caution panel; the two build warnings name file and line. The same chapter builds without errors or warnings with the docs, column, base, bootmenu, console, partition and workbench themes, and the repository builds with the docs config without errors.
- **Tables.** In all 28 tables (173 first-column cells, headers included) at 640, 768, 1024, 1280, 1440, 2000 and 2560 px, no label up to 15.5em wraps (round 2: 26 did at 640 px, 22 at 1024, 15 at 1440, 12 at 2000). The labels around the threshold measure 14.72, 14.79 and 14.90em, then 16.08, 16.32 and 16.38em: 15.5em lies in that gap. Every table with longer labels keeps at least 13.8em for its first column. The eleven BIOS tables share their widths at every width, and a resize gives the same widths, labels and series as a fresh load. Code broken inside a word in a table cell: none from 1100 px (round 2: two at every desktop width), one at 1024 px, "/mnt/backup/bor|g" in chapter 8, section 7 (round 2: three), and one at 640 and 768 px, "/mnt/btrbk/w|yse" in the same table (round 2: eleven).
- **Everything else.** No page scrolls sideways (85 pages at 360, 390, 768, 1024, 1280, 1366, 1440, 1680, 2000, 2560 and 3000 px, 935 loads; chapters 1, 7 and 8 and the contents page also with a 24 px browser default, from 1536 to 3000 px). At 390 px chapters 1, 7 and 8 are pixel-identical to round 2, and the contents page differs only in chapter 9's reading time. Chapters 1, 7 and 8 print on as many pages as in round 2 (20, 8 and 84, Letter, from a 1600 px window; chapter 7 also from 1024 px), with the notes inline at their place, the BIOS series aligned and light paper also with the system in dark mode. Hugo builds without warnings, also with `--printPathWarnings`; the link check finds 85 pages, 5,336 internal references, 0 broken, 0 missing anchors.

What failed, and the fix:

| Finding | Fix | Where |
|---|---|---|
| A margin note inside a list item, automatic or marked `margin`, floated into the margin but was never placed: `alignNotes` only took notes that are direct children of the text. It sat below its step, and the listing of the next step crossed the margin over it (scratch site, 1280 to 2560 px). No guide has such a note today, but the guides are numbered steps, and moving a note into the step it belongs to is the natural editorial choice | A note inside a list item is placed by the same rule: level with the block before it in the item, or with the item when the note opens it; what is beside it yields. On the scratch site both cases now sit level with their step and nothing overlaps; in the guides every placement and yield is unchanged at every width | `handbook.js` (`marginNotes`, `alignNotes`) |
| The 500-character rule counted bytes (`len`), so every dash, arrow or curly quote counted as three characters: a note of 490 characters with a few of them would have stayed in the text column | The rule counts characters (`strings.RuneCount`). No note changes today: the nearest are 470 characters (in the margin) and 534 (in the text column) | `shortcodes/callout.html` |

Seen and left as it is:

- Chapter 9's note "If you prefer the automation editor, …" follows a five-step list and refers to the automation of step 4, but sits level with the top of the list, beside steps 1 and 2, where it makes step 2's one-line listing yield at every width (it scrolls from 1280 to 1680 px). Round 2 placed it there too: a note comments on the block before it, here the whole list. If Willi prefers it beside the end of the procedure, indenting the note into step 5 of the Markdown puts it there. (Done on 19 November 2026, at Willi's request: the note is now part of step 5 and sits level with it from 1280 px; step 2's listing no longer yields. See section 17.)
- The 1rem rule decides near misses: a listing that starts 1.06rem below a note keeps crossing the margin (chapter 8, "A leftover dell-wyse node" at 2000 px), one 0.93rem below yields (the same note at 2560 px).
- On tablets, from 640 to 1023 px, whole first-column labels take width from the other columns: in chapter 8's backup table at 700 px, "From → to" holds one or two words a line. (Changed since, see section 16: such a table now lets its labels wrap.)
- With a browser default of 24 px, the text column widens in one step of 61 px (861 to 922 px) where the margin column appears, at 1920 px, because the formula counts window pixels from 1280 px; nothing overflows. With the usual 16 px default the growth is continuous.
- Checked in headless Chrome only; Safari was not tested.

## 16. Round 3 review: narrow tables

A last review on 19 November 2026, after the verification: the rebuilt preview, "SSH into the installer." in the margin at 1440 px with the `lsblk` listing yielding beside it, the BIOS series at 1440 px (none of its 53 short labels wraps), and the tablet case left open in section 15, which this changes.

What it was: from 640 to 1279 px a table can be too narrow for its whole labels and for the paths and names in its other columns, which then break in the middle. Chapter 8's backup table (Job | When | From → to | Reports to healthchecks.io as) at 768 px: Job 181 px wide for "Home Assistant backup" on one line, "From → to" 115 px, `/mnt/btrbk/w|yse` and `/mnt/backup/|borg` broken, 919 px tall.

The rule (handbook.js `relieveTables`, right after `labelTables`, from 640 to 1279 px): for each table that is not part of a series, count the places where code without spaces (paths, file and check names) runs onto another line, in every column; then let its labels wrap (without `is-label` and `has-long-labels`) and count again. With fewer breaks the table keeps its wrapping labels (`is-relieved`), as in round 2; otherwise the rule of 14.3 stays. Counting every line a path runs onto, in every column, keeps a first column of paths from collapsing: chapter 8's File | Purpose table would go from 5 to 24 breaks at 768 px, so it keeps the rule. The count reads the text, not the code boxes: an inline code box that starts at the end of a line has an empty first fragment, which is no break. From 1280 px, where wide tables also take the margin, the rule as agreed applies unchanged, also where letting labels wrap would save a break (three tables of chapter 8 at 1440, 1680 and 2560 px would otherwise have wrapped short labels to save one). (Extended since, see section 21: also when wrapping labels makes the table clearly shorter; and with code that keeps its pieces whole, most of the breaks this rule counted no longer happen.)

Effect, breaks inside paths and names on the four pages with tables, before → after: 23 → 21 from 640 to 834 px, 17 → 14 at 1024, 12 → 8 at 1100, 12 → 9 at 1180; from 1280 px unchanged (6, 7, 7, 6, 6 and 5 at 1280, 1366, 1440, 1680, 2000 and 2560 px). Tables that change: chapter 8's backup table from 640 to 1180 px (at 768 px columns 181 | 133 | 115 | 131 → 113 | 156 | 135 | 156 px, 919 → 766 px tall, 9 → 7 breaks; at 1100 px 3 → 0) and "Installed on the Wyse | Purpose" at 1100 and 1180 px (5 → 4 breaks, same height). Compared with the verified build at 13 widths from 640 to 2560 px (52 page and width combinations): no other table, note or yield changes, and from 1280 px all 24 combinations are identical; no page scrolls sideways. A chain of nine resizes in one page load (1100, 1440, 768, 2000, 1024, 1280, 1180, 2560, 640, 1366 px) gives the same tables as fresh loads. Phones are untouched: below 640 px their tables reflow into rows. Hugo builds without warnings; the link check finds 85 pages, 5,336 internal references, 0 broken, 0 missing anchors.

## 17. Round 4: note icon and tints (decided 20 November 2026)

Willi asked for two things to look at before deciding: the circled "i" that Docs puts before "Note", and a very light wash behind notes (blue), Cautions (red) and similar boxes, like Console's but much more subtle. On 19 November both were options of the theme (classes `has-note-icon`, `has-tints` and `has-margin-tints` on `<html>`, set from site params) with a switch on a comparison build. On 20 November Willi kept the note icon and the tints and left margin notes plain. Both are now simply the Handbook's design: no params, no classes; the rules sit with the notes and Cautions in `handbook.css` ("Notes and cautions") and in the margin-note rules.

**Note icon.** Drawn like the Caution's triangle on the same 16-unit grid, so the two read as a pair told apart by shape: circle r 6.5 with a 1.5 stroke, the stem 1.7 with round caps, the dot r 1; 1.05em, `aria-hidden` (the label still says "Note"). It sits before "Note" in the label, run-in or on its own line; a note that opens with its own label ("**Note on GRUB:**") gets it before that label, at the start of the first paragraph (`callout.html`). Colour: note blue (`--note-ink`) in the washed box; pencil grey in a margin note, so a blue mark never sits under the carmine rule.

**Tints.** One hue per kind of box, at about the same lightness, between the paper and the listing tint, with about half the chroma of Console's boxes:

| Token | Light | Dark | OKLCH (light) | Contrast (light / dark) |
|---|---|---|---|---|
| `--note-wash` | `#F5F9FD` | `#1B2329` | .980 .007 248 | ink 15.6 / 12.6, pencil 7.6 / 7.1 (round 7: half as strong on the white paper, at Willi's request; until then `#ECF4FB` / `#1E2831`) |
| `--caution-wash` | `#FBEEEF` | `#312323` | .960 .014 12 | ink 14.6 / 11.9, pencil 7.1 / 6.7 |
| `--notice-wash` | `#F8F2E7` | `#2C271C` | .963 .016 83 | ink 14.8 / 11.8, pencil 7.2 / 6.6 |
| `--note-bar` | `#91AFC9` | `#486781` | .740 .050 245 | decorative, like the hairline it replaces |
| `--note-ink` | `#335E89` | `#9EC2E7` | .471 .085 250 | 6.4 / 8.6 on the note wash |

- A note in the text column gets the wash, room inside (.7rem 1rem .75rem 1.1rem) and a 2px blue bar instead of the hairline.
- A Caution keeps its carmine rules and tab; the wash fills the band between the rules, the text moves 1rem in, the tab stays at the box's edge.
- The earlier-edition notice gets a sand wash between its ink rules: archival, neither note nor warning.
- Listings and inline code keep their own tint, a step darker than any wash, so they stay boxes of their own (painting them paper-white, as Console does, made a listing two-toned under its language strip).
- Listings, diagrams and wide tables inside a note or a Caution stay inside the tinted box and scroll there if they have to, from 1024 px up (`.prose :is(.callout--note, .callout--warning) …` in the 64rem block); `handbook.js` (`crossing`) leaves them out of what crosses the margin. Round 2 let a note's listing run on past its hairline (section 13).
- Margin notes stay plain text in the margin: there, position already says "aside", and a box takes padding from a column of 230 to 560 px and reads like a sticky note. Below 1280 px, in print and without JavaScript they are notes in the text column and washed like the others.
- Print keeps the paper white; browsers leave the washes out unless backgrounds are printed.

**Fixed on the way.** On the comparison build of 19 November the rule that keeps a note's listings in the box sat in the 80rem block, so between 1024 and 1279 px the listings of a washed note still ran 80 to 180 px past the box (16 in chapter 8, one each in the Debian guide and chapter 7). The rule now applies from 64rem, for Cautions as for notes, and covers diagrams and wide tables as `crossing` always did.

**Verification** (headless Chrome, 20 November 2026). The new build against the approved state (icon and tints on, margin tints off), rebuilt from the theme as it was that morning with the same content: element boxes and computed styles of every note, Caution, notice, mark, listing, table, diagram, sidenote and heading on the 23 pages with notes or notices, at 375, 768, 1023, 1024, 1200, 1279, 1280, 1440 and 2000 px, and dark mode at 1440 px. 212 of 230 page and width combinations are identical; the other 18 are the tablet widths (1024 to 1279 px) on six guides, where only the listings inside notes changed (now inside the box: right edge pulled in, nothing else moved, no page longer). Afterwards no listing leaves its box on seven guides at 1023 to 1280 px (42 measurements). On 19 November the options themselves were checked in all five states on five guides (no sideways scroll, no overlap, switch equals fresh load in 36 of 36 cases, 0 broken links).

## 18. Round 5: three font pairings (decided 20 November 2026: Literata stays)

Willi asked for three font options to choose from: the Handbook's own (Literata and Atkinson Hyperlegible Mono), the pair of the Docs prototype (Geist and Geist Mono), and Inter Tight with a fitting code font. They were built as one site param with a switch on the comparison build, and he kept **Literata and Atkinson Hyperlegible Mono**. The other two pairings, the param, `--fit`, `--code-ex` and the `font-size-adjust` rule were removed again; two things stay: the token `--serif` is now `--text-font`, and code has no ligatures (below). The record of the comparison:

| Pairing | Text | Code | Why this pair |
|---|---|---|---|
| `literata` (kept) | Literata | Atkinson Hyperlegible Mono | the Handbook as designed: a book face with optical sizes, a mono drawn for legibility |
| `geist` | Geist | Geist Mono | the Docs prototype; Google Fonts now has Geist's own italic (Docs loaded none, so its italics were slanted by the browser) |
| `inter-tight` | Inter Tight | JetBrains Mono | modCraft sets all its text in Inter Tight; JetBrains Mono is drawn for reading code, has Inter Tight's x-height (.550 against .546) and was Column's code face |

**A fair comparison: same sizes, same line length.** Every pairing kept the type scale of round 2 (body about 19 px at 1440 px, 22.5 px from about 2200 px) and the characters per line of round 3. The faces differ in width, so the widths that hold running text scaled with the face: `--fit` was its mean advance on chapter 8's paragraphs (45,048 characters, body size at 1440 px) relative to Literata's, and multiplied the text column (`--measure`), the single column of the contents and list pages (`--page-w`) and the margin note's box (23rem).

| Face | Mean advance | `--fit` | x-height |
|---|---|---|---|
| Literata | .467 em | 1 | .514 (at 19 px; optical size) |
| Geist | .453 em | .971 | .530 |
| Inter Tight | .425 em | .910 | .546 |
| Atkinson Hyperlegible Mono | .632 em | | .496 |
| Geist Mono | .600 em | | .530 |
| JetBrains Mono | .600 em | | .550 |

Code kept its size relative to the text: in the Handbook the mono's x-height is .964 of the text's (.496 on .514), and `font-size-adjust: ex-height` gave the other monos the same relation (`--code-ex`: .511 for Geist Mono, .526 for JetBrains Mono, i.e. 96.4 % and 95.7 % of Atkinson Hyperlegible Mono's size). The diagram's labels are text, so `pre.mermaid` was left out of this and is left out of the next rule.

**No ligatures in code (kept).** JetBrains Mono draws `->` as an arrow, `!=` as ≠, `>=` as ≥ and `|-` as a turnstile (the `lsblk` tree in chapter 8, 3.1, read `⊢sda1`). Code has `font-variant-ligatures: none`; for Atkinson Hyperlegible Mono and Geist Mono this changes nothing (their test lines render pixel for pixel the same with and without), so for the Handbook it is a safeguard for any later face.

Measured in Chrome on chapter 8 (characters per line; the text column's capacity as defined in section 14.1; a listing that crosses the margin, not in a note):

| Window | Literata: text / listing | Geist: text / listing | Inter Tight: text / listing | Text column (px) |
|---|---|---|---|---|
| 390 (phone) | 43 / 39 | 44.5 / 42 | 47.5 / 43 | 343 for all |
| 1024 | 66.7 / 72 | 66.7 / 77 | 66.8 / 73 | 560 / 544 / 510 |
| 1280 | 66.7 / 92 | 66.7 / 99 | 66.7 / 95 | 574 / 557 / 522 |
| 1440 | 68.8 / 98 | 68.8 / 105 | 68.7 / 101 | 615 / 597 / 559 |
| 2000 | 74.9 / 114 | 74.8 / 122 | 74.8 / 118 | 757 / 735 / 689 |
| 2560 | 74.9 / 125 | 74.8 / 135 | 74.8 / 131 | 785 / 762 / 714 |

On a phone the column is the screen, so the narrower faces fit a few more characters per line there.

**Renamed token (kept).** `--serif` is now `--text-font`, a name that holds for any face.

## 19. Round 6: accent, links and background (decided 20 November 2026: white paper)

Willi compared three things with the Docs prototype on a comparison page with a switch: its turquoise (petrol) colour theme against the Handbook's carmine, how it shows links, and its page colour. He kept the **carmine** and the Handbook's **links** (ink, underlined in carmine; carmine with a 2px underline on hover) and took Docs' **paper**: white, and Docs' near-black in dark mode. The paper is now simply the theme's token; the params, the classes, the switch and the rules of the other values are gone again.

What changed with the paper:

- `--paper` is `#FFFFFF` (until then `#F6F7F8`) and, in dark mode, `#1A1C1F` (until then `#1D2126`). Every other token stays as designed: the listing tint (`#E8EBEE` / `#272C33`), the washes, the rules and the greys. All contrasts stay or rise (section 2): ink on paper 16.5:1 and 13.5:1, pencil 8.0:1 and 7.6:1, carmine 7.1:1 and 6.6:1.
- The Caution's text on its tab is the paper, so in dark mode it is `#1A1C1F` now.
- The browser's toolbar colour (the theme-color metas in `baseof.html` and the colours in `handbook.js`) is `#FFFFFF` and `#1A1C1F`, and the favicon's tile (`static/handbook-mark.svg`) is white.
- Kept from the comparison: Cautions have their own token, `--warn` (and `--on-warn`), with the carmine's values, so that a warning never depends on the accent.

**The options not chosen** (for the record): with `accent = petrol` the Docs petrol (`#0A6676`, dark `#62C0CD`) took the carmine's place for numbers, link underlines, the current place, the margin notes' rule, footnote numbers and focus, with the selection `#C2E3EB` / `#1D3A40` (Docs' own `#E7F2F4` does not show on grey paper); Cautions stayed carmine, as Docs kept its warnings red, and notes stayed blue (Docs' notes were neutral grey). With `links = accent`, links in running text were set in the colour with a 40 % underline, and on hover a step darker with a solid 1px underline, as on Docs (carmine `#950020` / `#FC9CA8` on hover); every such link colour was at least 5.4:1 on every paper, wash and tint.

**Verification** (headless Chrome, 20 November 2026). On the comparison page all eight combinations on chapter 8, Fedora 35 and the contents page, light and dark, gave the intended colours (48 of 48), nothing moved, print stayed white, and switching on the page gave the same result as a fresh load (6 of 6). The final build against the approved combination (carmine, ink links, white paper) on the comparison page: element boxes, page heights and the colours of links, numbers, Cautions, notes, the notice, the page, the listing tint, the selection, the running head, `kbd`, the contents, the footer and the toolbar on 29 pages at 375 to 2000 px, light, dark (by the system and by the toggle): 261 of 261 identical; the one raw difference is the intended one, the Caution tab's text and triangle in dark mode (`#1D2126` → `#1A1C1F`). Print on a system in dark mode: white paper. The link check finds 96 pages, 5,757 internal references, 0 broken; nothing of the comparison machinery is left in the theme or the configs.

**Review of the final state** (three independent reviewers, each finding reproduced by a fourth, 20 November 2026). Fixed:

- Tables and diagrams inside a note, a Caution or the notice showed paper-coloured bands at both ends: their scroll covers were painted in `--paper`, which round 4's washes no longer match. A new token, `--ground`, is the colour a box sits on (the paper; the note, Caution or notice wash; the paper again in a margin note), and the covers of `.table-wrap` and `pre.mermaid` use it.
- A printed Caution tab was white text on its carmine fill, and browsers print no backgrounds by default, so it came out blank. On paper the tab is now outlined, with text and triangle in `--warn` (the print rule no longer hard-codes the carmine).
- Photos printed after choosing dark mode with the toggle stayed dimmed to 86 %: the dimming is now for the screen only.
- A footnote cited twice appeared twice in the margin (chapter 8, 11.3): only its first citation makes a sidenote now.
- A note opening with a list item or heading that begins with "Note" lost both its label and its mark; a note only carries its own label when it opens with a paragraph.
- The browser's toolbar colour followed a stored theme only once `handbook.js` had run; a small script after the theme-color metas sets it on the first paint.

Left for Willi to decide: the design reviewer suggests keying the remaining surfaces to the white paper, which they were designed against grey for: the listing tint `#E8EBEE` → `#EEF0F3`, the Caution wash `#FBEEEF` → `#FEF3F4` and the notice `#F8F2E7` → `#FCF6EC` (the notes' wash was already halved in round 7). The reviewers disagreed on whether photos with a white background, such as the Dell Wyse, need a hairline frame on white paper.

## 20. Round 7: code blocks that tell commands, explanations, output and files apart (decided 20 November 2026: panels, session kept as a setting)

Willi asked for better ways to read the listings, because one `#` line can be an explanation of a command, the command's output, or the content of a file. Tried on the two Dell Wyse guides first. Also in this round, at his request, the notes' wash became half as strong (section 17).

**The markup** (in the Markdown; every marker is a shell comment, so a pasted block still runs):

| Line | Role |
|---|---|
| `# text` | an explanation (as before) |
| `#> text` | output, exactly as the terminal prints it; `#>` alone is an empty output line |
| `#~ text` | the output described in words ("apt-daily.timer and apt-daily-upgrade.timer, each with a NEXT time") |
| body of `<<EOF … EOF` | a file being written, labelled with the `tee`, `>` or `>>` target (marked "appended to" for `tee -a` and `>>`); a script fed to a program (`sudo bash <<'EOF'`) is input and gets no label |
| output of `cat FILE` | that file's content, labelled with `FILE` |
| ```` ```json {file="…"} ````, ```` ```text {output="…"} ```` | a fence that shows a file or an output names it; a shell fence with `{file="…"}` is a script file and keeps the plain rendering |

A page opts in by using `#>` or `#~` in one of its own shell fences (sh, bash, shell, zsh, fish), or with `codeRoles: true` in its front matter, as the hardware guide does (its one listing has no output); every other page renders as before. `#>` and `#~` inside a file's body stay as they are.

**The two guides.** The hardware guide's one listing (two explanations, two commands) needed only the front matter line. In the Nextcloud guide 537 `#` lines in 107 shell listings were sorted: simple rules proposed a role for each (a `#` line right after a command or output is output, otherwise an explanation); then, for each quarter of the guide, one reviewer checked the proposal and a second labelled blind. They agreed on 536 of 537 lines and on 8 corrections to the rules (e.g. "# HDD 1's LUKS mapping passes cache flushes on to the disk" is an explanation, the ssh warning at line 1230 is output); the one disagreement (line 546, a pattern of the expected line before the loop that prints it) is an explanation. A later audit of all 5 `#~` lines, 40 random `#>` lines and 20 random `#` lines found none mislabelled. Result: 438 output lines (`#>`), 5 described outputs (`#~`), 94 explanations, and four fences named (`~/.ssh/config`, the Tailscale policy file twice, the kernel log). Only those characters changed: undoing the markup (`perl -pi -e 's/^(\s*#)[>~]/$1/'` on the file, removing the four `{…}` and the `codeRoles` line) gives the original byte for byte, and git holds the guides as they were (Willi's commits of 20 November).

**The hook** (`render-codeblock.html`) highlights a listing as before, with `#>` and `#~` shown as `#`, then gives every line a role class: `r-cmd`, `r-com`, `r-out`, `r-exp`, `r-here`, `r-blank`. A line that goes on with the command before it gets `r-cont`, so that `session` sets no prompt before it: after a trailing `\`, `|`, `||`, `&&`, `do`, `then`, `else`, `{` or `(`; inside a string left open on an earlier line; inside `do…done`, `if…fi`, `case…esac` or `{ … }`; after a heredoc whose start line went on with `&&` or `|` or left `$(` open; and a heredoc's end line. A comment or blank line after a backslash ends the command, as in bash. A small lexer on each command line (strings and comments set aside) does this; checked with `bash -n` (parse only) on every listing of the guide, it marks 50 lines as continuing (28 after a backslash, 6 heredoc ends, 16 others), and bash agrees on every one, with no continuation left with a prompt. Groups of output, described output and file lines carry `r-first` / `r-last` and, for a file, `data-file` and `data-mode` on their first line and `r-file` on every line; the `#` of each output and explanation line sits in `span.pfx`. Listings of pages without the markup render as before. Known limit: of two heredocs on one line (`cat <<A <<B`) only the first is recognised; no guide has one.

**The two settings** (site param `code` in `config/_default/hugo.toml`, until the switch to the live site `redesign/configs/handbook/_default/hugo.toml`; one class on `<html>` from `baseof.html`; any other value gives a build warning and panels):

| `code` | Commands | Explanations | Output | Files |
|---|---|---|---|---|
| `panels` (default, Willi's choice) | as before | `# ` in the mono, then the text in Literata italics (Willi asked for the `#` to stay) | in a white box with a hairline; the first box of a listing is labelled "Output" ("Expected output" for `#~`) | `cat` output in a white box labelled with the path; files written on a thin rule, labelled |
| `session` | after a `$` prompt (not copied), none on continuation lines | `# …` in the mono's own italic, in line with the commands | without `#`, from the left edge; described output after one "→" | on a thin rule, labelled with the path |

The comparison had two more: `asnow` (the listings as before) and `folded` (output of three lines or more behind a toggle, "▸ Output · 23 lines"). Both are gone, with the switch on port 1428 (partial `handbook/variants.html`, `redesign/configs/handbook/variants/`, the `.variants` rules), the fold markup (`data-g`, `data-n`, `r-folds`, `line.r-fold`) and the `codelabel` param. Willi first chose `session`, then `panels`, and kept `session` as the setting he may switch to later.

In both settings the Copy button copies what can be run: commands, heredoc bodies and explanations (as `#` comments), never output (`handbook.js`, `window.codeText`, which `base.js` asks first; a listing with nothing to run copies as before). The hidden markers (`#` of output) are clipped, not removed, so a hand selection still pastes output as comments. Output keeps round 2's colour (`--code-comment`); a comment at the end of a command line is set in italics. Print shows all output and wraps long lines in both settings. Atkinson Hyperlegible Mono's own italic is now loaded (before, the browser slanted the upright). In panels the white boxes would hide the listing's sideways-scroll shading, so it is drawn on top of them (`handbook.js` marks which side can still scroll).

**The label above a listing** stays the fence's language, as before ("sh"): Willi tried "only names" (nothing on shell listings, where "sh" tells the reader little) and kept the language. A fence that names its file or output shows the name in its place (`~/.ssh/config`, "Kernel log"), on every page.

**Review of round 7** (four independent reviewers: code, rendering, design, labels; the two most severe findings of each reproduced by a fifth and sixth). Fixed: long lines were cut off in print in the three options (high); 16 lines that continue a command got a prompt in `session`; heredoc labels missed `cat <<EOF > FILE`, `tee --append` and a target on an earlier line, and a script fed to `bash` was boxed as a "File"; `#>`/`#~` inside a file's body were rewritten; one-line boxes lost their top corners; `folded` hid output without JavaScript; Copy of a listing with only output copied nothing; opt-in reacted to `#>` outside shell fences; fish listings showed the raw markers; a highlighted line shifted the roles; a named shell fence was set as a session; an opened `cat` output showed its label twice; the Copy button of a listing in a sidenote did nothing. Improved for a fair comparison, as the design reviewer advised: copy-safe markers, the real italic, the output colour, and in panels the hairline, one "Output" label per listing and files written on the tint. The design reviewer's verdict: `session` serves this handbook best (all four roles apart, everything visible, listings 0.5 % longer); `panels` is the clearest for first-time readers but adds about 4,000 px to chapter 8; `folded` is the shortest but hides 88 % of the output, including what the prose asks the reader to check, and find-in-page cannot reach it.

**Verification** (headless Chrome, 20 November 2026): the hook's roles match the labels on all 1,142 lines; `bash -n` finds no line with a wrong or missing prompt; the default build renders both guides as before (same text, same heights); for all four options on the Nextcloud guide, the hardware guide and the Debian guide (which does not use the markup) at 390, 1024, 1440 and 2000 px and in dark mode: no sideways scroll, no margin note overlapping a listing, the roles styled as described, Copy without output, the Debian guide unchanged; opening and closing all 45 toggles restores every position; print at A4 has no listing wider than its box in any option; the reviewer's test page of edge cases (heredocs on continuation lines or in `$( )`, `<<-`, here-strings, arithmetic `<<`, markers in a file, fish, highlighted lines, `tee --append`, `cat FILE # comment`) renders as described above; 97 pages, 5,901 internal links, 0 broken.

**After the decision** (headless Chrome, 20 November 2026): the panels build and a build with `code = "session"` against the two approved states of the comparison build, on the Nextcloud, hardware, Pop!_OS 24.04, macOS, backup and BTRFS guides and the home page at 375, 768, 1200 and 1440 px and in dark mode: every listing's box and label, every line's class, box and computed style (the line, its `::before`, its `#`), the sideways-scroll shading and what Copy copies are identical (35 of 35 views each). Copy with real clicks on the real clipboard: in panels all 225 listings of five guides (the two Wyse guides, Pop!_OS 24.04, macOS, Debian), in session the 113 of the two Wyse guides, copy exactly what the Markdown says (on a marked page the fence without its `#>` and `#~` lines, elsewhere the fence as written), with "Copied" on the button; so do the listing in the margin note and the fallback without a secure context (textarea and `execCommand`). Selecting a whole marked listing by hand and pressing Cmd+C pastes output as `#` comments; all 107 such selections parse as shell (`bash -n`).

**Rolled out to every guide** (20 November 2026, at Willi's request). The line roles are now on for every page (`params.codeRoles = true` in the Handbook's config; a page can still set `codeRoles: false`), so the hardware guide's front matter line went. The 24 other guides with listings got the markup by the method of the Nextcloud guide: rules proposed a role for each line; for each of 21 parts (998 listings, 3,457 lines), one labeler checked the proposals and a second labelled blind. They agreed on 3,354 of 3,365 lines and on the kind of all 998 listings; the 11 lines and 6 names they differed on were settled by hand, as were 33 runs of `#` lines right after an editor (`nano /etc/fstab`), which the labelers had split between output and explanation (see below). Result:

| Change | Count |
|---|---|
| output lines `#` → `#>` | 3,225 (30 of them in a listing of `lsblk` output written as `#` lines) |
| described output `#` → `#~` | 8 |
| output written without `#` → `#> ` | 6 (blank lines inside output, so it stays one box; a separator; the two lines of a script printed by `cat`) |
| explanations, unchanged | 85 |
| listings that show a whole file, named and given its language | 44 (`text {file="/etc/fstab"}`, `ini {file="/lib/systemd/system/btrbk.timer"}`, `bash {file="~/.bashrc"}`, `sshconfig`, `yaml`, `json`) |
| listings that show only output, named | 11 (`text {output="Output of systemctl list-timers"}`, "Error from kernelstub", "GRUB passphrase prompt") |
| listings without a language, given one | 20 (sh, bash or fish, as the guide around them) |
| fish listings that fish cannot parse but bash can (heredocs, `VAR=$(…)`, `${USER}`, `do … done` in a chroot), relabelled sh, commands unchanged | 12 (Willi's choice) |

Two rules were added to the hook on the way. **Editors:** the output written right after `nano FILE` (or vi, vim, micro, gedit …) is that file as it should look, so it is labelled with the file like the output of `cat FILE` ("/etc/fstab" over a box of fstab entries); a line there that tells the reader what to do ("# Add your public keys, one per line:", "# UNCOMMENT THE NOT WORKING DEVICE") stays an explanation. **Input:** a command line indented deeper than the command before it, outside a loop or condition, is input to an interactive program (gpg's `trust`, `5`, `y`, `quit`; parted's `mklabel gpt`), and so is a line after the program's own prompt (`gpg/card> fetch`): both go on with the program's command, so `session` sets no prompt before them (70 lines; nothing else changed). By hand: the Raspberry Pi guide's `(initramfs) cryptsetup …` lost its prompt, which Copy would have pasted. A long name above a listing now stops before the Copy button, and a path loses its start rather than its end ("…/scripts/btrbk-precision.conf", right-to-left overflow with a left-to-right mark at both ends).

Verification (20 November 2026): undoing the markup gives the 23 guides byte for byte as committed; all 1,111 listings of the 25 guides build, 1,052 with roles; what Copy copies parses as shell for every one of them (`bash -n`, `fish -n` for fish) except four that did not parse before either (three listings that show the bash and the fish way to start ssh-agent on two lines, and a `<YOUR-UUID>` placeholder); in both settings, print at A4 has no listing wider than its box and no page scrolls sideways at 375 px; every name fits beside the Copy button at 375 and 1440 px. Known limit: `exit` typed at the MATLAB prompt (Fedora post-install) is written unindented and so gets a `$` in `session`.

## 21. Tables on phones, tablets and desktops (table review, 20–21 November 2026)

Willi asked for a check of how all the tables look on desktops and phones, and for fixes where the columns look off, particularly on phones.

**The review.** The 37 tables of the six pages that have tables were measured and photographed at eight widths from 360 to 2000 px: the revision table on the contents page, three in the Mac mini guide, three in the Raspberry Pi guide, the eleven BIOS menus of chapter 7, fourteen in chapter 8 and five on the backup page. Five reviewers looked at every screenshot and a sixth at the rules; a skeptic re-measured each group's findings, and all 53 held (4 high, 16 medium, 33 low). The worst came from one rule, `.prose td code { overflow-wrap: anywhere }`, which lets the browser shrink a column of paths to a single character: on phones chapter 8's File | Purpose table gave its paths 61 px ("Clien|t-") and one cell eleven lines; 10 to 12 words broke inside at 360–414 px, 4 at 480–1000 px. Also: two-column tables stayed tables on phones however cramped, and reflowed rows had no title; on tablets whole labels took 40–45 % of a table; the BIOS menus wrapped settings beside an empty Note column; the backup schedule split all eight check names after a hyphen from 1280 px; numbers parted from their units ("6 / TB") and section numbers from "section"; many cells ended in one word.

**The rules** (`handbook.js`, "Tables"; `handbook.css`, "Tables", the phone block and print). The review's plan was simulated on every table at 19 widths, built (round 1, which measured exactly as simulated), then checked independently three times; the side effects each check confirmed were fixed (rounds 2 and 3) or, where a fix cost more, accepted (below).

| Where | Rule |
|---|---|
| Code in cells | handbook.js puts a break point (`<wbr>`) after each slash inside a path longer than 16 characters, never after a leading `/` or `~/`, and then sets `has-cells` on the root. From then on code without spaces keeps the pieces between its break points whole (`overflow-wrap: break-word`): a path breaks after a slash, a name after a hyphen, and only a piece longer than the line breaks inside. Code with spaces breaks at its spaces, and anywhere as before; code in a header keeps the browser's default. Without handbook.js the old rule stays. |
| Words that belong together | No-break spaces in cell text outside code: a number and its unit or what it counts ("6 TB", "1 day", "04:00 UTC", "4 weekly"); HDD, SSD, USB or PCIe and their number; a word and a one-letter name ("Path B", "Model B"; not "I", not before a comma); a bold name of two words of up to 12 characters inside a sentence ("Audit Mode"). A range of numbers keeps its dash ("04:45–05:45", word joiners). Link texts keep "section", "Step" and "chapter" with their number (`render-link.html`, at build time). |
| Last lines | `text-wrap-style: pretty` on header and body cells once handbook.js has run: no lone last word where the browser can avoid one. It replaces round 1's `text-wrap: balance` on headers, which made "Period" over "/ grace". The longhand matters: the shorthand also sets `text-wrap-mode` and could undo the nowrap of a label. |
| Phones (below 640 px) | A two-column table becomes a list of entries, the first cell as title and the second below it without a label, when its code then breaks at fewer places and it is no taller, or when it scrolls sideways and the entries do not; only the body's code counts, since entries hide the header. The first cell of every reflowed row is its title (600, its code 500; a title bold in the Markdown keeps 650). In the BIOS menus a row with an empty first cell continues the row above: no hairline between them, and from 640 px no rule under the label. A name (code without spaces, up to 25 characters) moves to the next line whole. |
| Tablets and small laptops (640–1279 px) | A table lets its labels wrap when that saves a break in a path (section 16), or when it gets at least 5 % shorter with the first column's floor of 9.5em, or 8 % without it; where labels without the floor qualify, the floor is used if it helps at all, so labels do not collapse to their longest word. This reverses round 3's promise (section 14.3) for five tables; Willi kept it (below). |
| BIOS series | A row without a note lets its setting run on under the Note column (`colspan`), and the header does the same where no row has a note; the columns stay the series' columns. On paper each menu stays on one page. |
| The last word on code | Decided on every layout after the columns, dropped first and when a table yields to a margin note; screen only. Names: a table keeps them whole if that saves breaks, does not scroll and costs at most 1 % of its height per break saved (5 % in all). Paths that fit: a broken path that would fit on one line of its cell moves there whole, as an inline block (columns unchanged within a pixel) or without wrapping (its column may widen), if the table then breaks code at fewer places, grows by at most a pixel and does not scroll; the paths of a table are tried together, then one by one; no block for code in a link or under a strike-through, or touching anything but a space. Loose code: a table lets code break anywhere again where that saves a break at most a pixel taller, or the same breaks and some height, and every remaining break falls after a hyphen or a slash, or where that ends sideways scrolling. Chrome breaks at a `<wbr>` even under `white-space: nowrap`, so the break points of whatever stays whole are hidden. |
| Revision table | The last column ends where the rules end (no right padding), and a wrapped chapter title hangs under its first word. |
| Resize | The layout runs again whenever the last one ran at another width, so a pass at a passing width (a capture tool sets 1 × 1 px for a moment) is always redone. |
| Print | The address printed after a link in a first-column label wraps: chapter 8's File | Purpose table printed at twice its height before. |

**Effect.** All 37 tables at 19 widths from 360 to 2560 px (703 table-widths), before → after:

| | Before | After |
|---|---|---|
| words broken inside (not after a hyphen or a slash) | 134 | 0 |
| lines that code without spaces runs onto beyond its first | 706 | 202 |
| cells whose last line is one word | 1,867 | 967 |
| summed height | 390,879 px | 380,568 px (−2.6 %) |
| tables or pages scrolling sideways | 0 | 0 |

Examples: File | Purpose at 360 px 1,077 → 633 px, every path whole as an entry's title (35 → 2 code line breaks); BIOS 3.1 one "System Information" entry over six settings; BIOS 3.9 at 640–1024 px 423 → 314 px, every setting on one line; the backup schedule keeps all eight check names whole from 1280 px; the Home Assistant Option table at 768 px 759 → 628 px. With the theme changes alone, 17 table-widths were taller than before, 4 of them by more than 5 %; the content changes below made the backup schedule and copies table shorter than before at every width, which leaves the Situation table at 400–420 px (see "Accepted").

**Verification** (headless Chrome, 20 and 21 November 2026). Each of the three independent checks looked at every before/after pair at eight widths (296 pairs), reviewed the code, ran dynamic tests, and had skeptics re-test every reported problem. The first confirmed 37 side effects of round 1, fixed in round 2: among them the BIOS series' Setting column 3 px narrower (break-word on the SGX log line), paths that used to move to the next line whole now split at a slash, label layouts switching from one width to the next, "Period" over "/ grace", and four latent bugs. The second confirmed 44 smaller ones; round 3 fixed those worth a rule: paths as inline blocks, loose code only with clean breaks, the floor preference, the lone-word rule as a longhand that waits for handbook.js, "PCIe 2.0", "Path B", "Audit Mode". The third found no reader-visible problem from round 3 and confirmed eight small or latent ones: six fixed, one comment corrected, one accepted (printed tables up to 9 % taller, because break-word keeps paths whole on paper too; page counts unchanged). After the last fix: a chain of resizes gives the same tables as fresh loads on the six pages, and a pass at a passing width is redone; without JavaScript, and when handbook.js fails to load, tables lay out as before apart from the link texts' no-break spaces; print at A4 cuts off no table; all 96 pages load at 390 and 1440 px without a JavaScript error or sideways scrolling; Hugo builds without warnings; 97 pages, 5,901 internal links, 0 broken.

**Accepted** (measured; each alternative cost more):
- The Situation | `TAILSCALE_HOSTNAME` table is 16 % taller at 400–420 px: "Path A, replacing another instance" takes four lines, because "section 9.4.3" no longer splits.
- The backup machines table is 4 % taller at 1100–1280 px (its names whole); its checks table 4 % at 640–1000 px (numbers kept with their units).
- The Mac mini jobs table's log path, longer than its cell, runs onto three lines at 1024–1250 px; `/srv/ha-backups` breaks at its hyphen in chapter 8's jobs table at 1320–1620 px (whole it costs 4–13 % of the table).
- Compound words break at their hyphen ("power- / on", "self- / tests"), as anywhere in text.
- While a window is resized, a few tables switch between two label layouts, or code rules, at single widths. Each state reads well, and a given width always gives the same layout; a memory of the last decision would end that.
- Without JavaScript, cells keep their lone last words as before, and a few columns move by about a pixel because of the link texts' no-break spaces.

**Known limits.** A first-column label that holds a `<wbr>` (code or a link text longer than 16 characters) can still break at it, since Chrome breaks at a `<wbr>` even under nowrap; no page has such a label that wraps, and hiding its break points would move chapter 8's Installed on the Wyse table at many widths. Printed from a window under 640 px, the BIOS menus are not a series and can split across pages, as before. Measured in Chrome; Willi looked at the tables in Safari (21 November 2026) and found them fine.

**Labels on tablets (decided 21 November 2026: kept).** The tablet rule changes five tables from 640 to 1279 px, each 7–19 % shorter, with wider text columns: Mac mini jobs (525 → 459 px at 640–900 px), Home Assistant Option (759 → 628 px) and App (467 → 423 px), chapter 8's Path | Result (311 → 290 px) and the backup page's restore table (1,574 → 1,269 px). Labels that wrap there include "NVMe SSD in a USB / enclosure", "Advanced SSH & Web / Terminal" and "A: fresh install / (section 9.3)". Willi compared it with a build without the rule, every other change in, and kept it. Undoing it would mean taking the height tests out of `relieveTables` (about ten lines), so that only a saved break lets labels wrap.

**Content changes** (the review's suggestions, made at Willi's request on 21 November 2026 and checked by an independent text reviewer and a rendering checker; every fact of the old tables is still on the pages):
- Chapter 8, section 7.2: one Port | USB | Address table for the rear and front ports, instead of two tables whose columns did not line up; "2.0" instead of "2.0 only" (the note says the black ports are USB 2 only); one lead sentence. 390 → 352 px at 640–1024 px.
- Chapter 7, section 3.4: the row "Strong Password, Password Configuration, Password Bypass, Password Change | No changes" is gone (the section says that what it does not mention stays as it is), and the four lockout pages are a sentence after the table, as in 3.12 (not a range, since their order in the BIOS could not be checked). 827 → 597 px at 768 px; the series keeps its column widths.
- Backup page, schedule: When holds only the schedule; the UTC/CET/CEST conversions, the guide's 03:00 UTC and Home Assistant's "System optimal" time are in the paragraph above, and "once AIO's backup has finished" is in the Job cell. The last column, "Reports to healthchecks.io as", holds only check names, "–" where nothing reports there (section 4 names AIO's, Home Assistant's and macOS's own alerts). 1,303 → 1,127 px at 640–1000 px, shorter than before at every width, with every check name whole from 1100 px.
- Backup page, copies table: no "#" column (nothing referred to the numbers); "AIO's Borg backup" and "Borg, and Home Assistant's key" keep its columns balanced, and "before they leave the house" is in the note on the off-site mirror. 689 → 602 px at 640–1000 px and 1,060 → 913 px at 360 px, shorter than before at every width.
- The backup page's two changes are in Willi's working copy, beside his own edits, not committed. On 21 November Willi also had `Storage&nbsp;Box`, `Raspberry&nbsp;Pi`, `Time&nbsp;Machine` and `Mac&nbsp;mini` written with no-break spaces on the backup page (59 places in its text and tables; not in the front matter, the chart or code), so those names never split.

**Left as it is**, from the review's plan: the BIOS series keeps the browser's split between Setting and Note (a least-height split costs about 20 layouts per pass and lengthens other menus); the SGX note; "Every five / minutes" in the Mac mini jobs table; wide tables crossing the side margins at 640–1023 px (a new layout principle, Willi's call; a variant of at most 3rem a side was measured); a hanging number column, or labelled rows up to 1023 px, for the copies table alone.

## 22. Going live (21 November 2026)

Willi asked to switch the live site to the Handbook and to self-host the fonts.

- **Config.** `config/_default/hugo.toml` is the Handbook's config with the live address (`https://mutschler.dev/`), `enableRobotsTXT` and Wowchemy's `removePathAccents`. A theme template writes `robots.txt` with the sitemap line, as Wowchemy's did. Wowchemy's YAML files (`config.yaml`, `params.yaml`, `menus.yaml`, `languages.yaml`), `go.mod` (its Hugo module) and its data files are gone. The publish action (`.github/workflows/hugo.yml`) stays as it was: Hugo 0.120.3 extended, a checkout with the full history (the revision table on the contents page reads git), `hugo --gc --minify`, GitHub Pages.
- **Fonts.** Literata (optical size 7–72, weight 300–800, upright and italic) and Atkinson Hyperlegible Mono (weight 400–700, upright and italic) are served from `/fonts/`: 18 WOFF2 files, one per script as Google Fonts serves them (Literata in Latin, Latin Extended, Cyrillic, Cyrillic Extended, Greek, Greek Extended and Vietnamese; the mono in Latin and Latin Extended), 806 KB in all; a browser loads only the scripts a page uses (`unicode-range`). `assets/css/fonts.css` holds their `@font-face` rules and is joined with `handbook.css` into one stylesheet; the text face's Latin file is preloaded. Both families are under the SIL Open Font License 1.1, whose texts sit next to the files. The files were downloaded from Google Fonts (the stylesheet the preview used, with the same axes) and the licences from google/fonts on GitHub. No page requests anything from Google any more.
- **Checked before the push.** Every URL of the live sitemap (98) exists in the new build except Wowchemy's empty `/categories/` and `/publication_types/` lists. The minified build and an unminified one of the same source are identical on all 96 pages at 390 and 1440 px (page and table heights), and every one of the 1,111 listings copies the same text. No page throws a JavaScript error or scrolls sideways; the four font styles load from the site; 0 broken internal links (97 pages, 5,998 references).
- **Still loaded from elsewhere:** Mermaid, which draws the night chart on the two backup pages, comes from jsDelivr (`themes/base/layouts/partials/base/scripts.html`).
