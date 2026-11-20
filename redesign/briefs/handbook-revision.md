# Revision brief: "Handbook" (slug: handbook), round 2

Willi likes the Handbook and keeps it. Keep its concept, typography, palette, contents page, margin notes, Caution panels and print stylesheet. Change only what follows, and keep DESIGN.md accurate (add a "Round 2 changes" section).

## 1. Scale with the window on computers

His screenshot at about 2000 px wide: the left TOC, a narrow text column and an empty right margin together use barely half the window; the text looks small and cramped, and the code window is clipped on the right.

- From 1024 px up, make the type and the composition grow with the viewport: fluid root or body size with `clamp()` and `vw`, all frame widths in `rem` so they grow with it. Rough targets: text about 17 to 18 px at 1024 to 1280 px, 19 to 20 px at 1440 to 1680 px, 21 to 22 px from about 2000 px, capped around 2560 px.
- At 1440, 1680, 2000 and 2560 px the page (TOC column, text, margin) should fill the window comfortably, with balanced outer margins, not a narrow island. Keep the measure readable (Literata at about 66 to 75 characters).
- Phones and tablets keep their current sizes unless something breaks.

## 2. Wider listings (code windows)

- Listings break out of the text column and span the text plus the right margin column, so typical commands and their output fit without horizontal scrolling at desktop widths. Longer lines scroll inside the listing with a visible hint at the right edge.
- Margin notes must never overlap a listing: define a rule (for example, a note whose anchor sits next to a listing moves below it, or listings clear the margin), implement it, and write it into DESIGN.md.

## 3. Subtle colour in listings, not greyscale

Today commands are "ink" and comments/output are "pencil": greyscale only. Willi wants to tell commands, flags, strings, variables, numbers and comments apart at a glance, with colour that is subtle but distinguishable. Follow the token rules in Round 2 of BRIEF.md (plain text and `nf` share the strongest colour; comments and output, 54 % of all code lines, clearly secondary yet comfortable to read; `err` plain; every token at least 4.5:1 on the listing background in light and dark mode). Choose hues that belong to the Handbook's paper, ink and carmine world (muted, printed-ink colours), and do not use carmine for tokens, since carmine means chapter numbers and Caution. Check the print stylesheet still prints listings legibly.

## Pages to check

`/`, `/linux/pop-os-btrfs-24-04/`, `/linux/wyse-ubuntu-nextcloud-aio/` (scroll to section 7, the one in his screenshot, `#7-backup-disks-snapshots-alerts-and-the-home-assistant-share`), `/linux/wyse-hardware/` (tables), `/apple/macos-post-install/`, `/stuff/backup/` (Mermaid), `/tags/`; at 1024, 1280, 1440, 1680, 2000 and 2560 px wide, light and dark, plus 390 px phone.
