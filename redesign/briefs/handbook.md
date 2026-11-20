# Creative brief: "Handbook" (slug: handbook)

**In one sentence:** mutschler.dev as a carefully typeset handbook in its seventh year of revisions: contents up front, chapters with margin notes, earlier editions kept in an appendix.

**Why it fits this subject.** The guides are long, sequential, numbered procedures that people follow step by step, often printed or on a second screen while installing. Wowchemy already models them as a book (`type: book`). What helps readers most is excellent long-form typography and orientation (where am I, what comes next, is this edition current), not decoration. A handbook also explains the archive honestly: older guides are earlier editions, kept for reference.

## Home: the contents page

- Title block: the site name, a plain subtitle that says what the handbook covers (derive it from the content; no slogans), "by Willi Mutschler", and a revision line with the date of the most recent change (latest git date of any guide).
- Contents in parts, curated from the catalogue (choose the grouping and names with judgement; for example: installing Linux with encryption and snapshots; after installation; home server; snapshots and backups). Chapter numbers follow the order of the contents, which is a real sequence. Each entry: number, title (`short` or full), one line of summary, and on the right the reading time or revision date with dotted leaders, as in a printed contents page.
- "Earlier editions" appendix: the previous guides, grouped by platform, each with the catalogue note (for example end of life) so readers understand why it is there.
- Revision history: the most recently revised chapters with their git dates (a real book idiom, real data).
- About the author: Willi's real photo (`media/YouTubePicture2.jpg`), roles, a short version of the about text or the bio, and links (YouTube, GitHub, GitLab, email, Buy me a coffee).

## Chapter pages (guides)

- Running head (handbook title and chapter title, small) instead of a heavy site header.
- Chapter number and title as display type, the summary as a standfirst, then the facts: first published, last revised, reading time, commands (a short labelled list, not a dotted string).
- Body: a serif made for long screen reading, measure around 66 characters, generous leading. The guides' headings already carry section numbers (1, 3.1 …); typeset them so the numbering reads as structure.
- Margin notes: on wide screens `callout note` sits in the right margin as a sidenote when it is short and has no code block; longer notes stay in the text column as an aside. `callout warning` always stays in the text column as a strong "Caution" box with the spot colour and a label, because a warning must interrupt the procedure. Write down the rule in DESIGN.md.
- TOC in the left margin on wide screens, sticky, current section marked; collapsible at the top on phones.
- Code as listings: mono, a light tint, the shell name in the corner, the copy button.
- End of chapter: previous and next chapter following the contents order, the feedback links (edit on GitHub, open an issue) and Buy me a coffee.
- Earlier-edition chapters: a notice at the top ("This chapter is from an earlier edition…" with the note and a link to the current chapter if the catalogue names one).
- A real print stylesheet: people print install guides to follow them offline. Hide navigation, print link URLs after external links, keep listings readable, avoid breaking short listings across pages.

## Visual system (starting point, refine with judgement)

- Paper: white or a cool off-white. Not warm cream.
- Ink and one spot colour, used sparingly for chapter numbers, links and the caution mark. Not terracotta or clay, not acid green; also keep clear of the firmware blue of the "Boot menu" prototype. Justify the choice in DESIGN.md.
- Type: one serif family with optical sizes for text and display (for example Literata, Source Serif 4 or Newsreader; avoid Fraunces, Playfair, Instrument Serif and Cormorant), plus a mono with unambiguous 0/O and 1/l/I for code. No all-caps labels; running heads in small italic or small roman type.
- The memorable thing is the typesetting itself: the contents page and the margin notes. No decorative imagery.
- Motion: next to none.
- Distinct from the other two prototypes, which are a text-mode firmware look ("Boot menu") and a light information-design look with categorical colours ("Partition map").

## Other pages

- Section pages: the part of the contents for that section.
- Tags: the tag index is the book's index: alphabetical terms, each with the chapters that use it; tag pages list those chapters. The search lives here too (and is reachable from every page).
- 404: "This page is not in the contents", with the search and a link to the contents.
- Privacy: set as a plain chapter-like page.
