# Mutschler.dev

Source code for my technical homepage at [mutschler.dev](https://mutschler.dev).

## Tech Stack

- **Static Site Generator**: [Hugo](https://github.com/gohugoio/hugo) 0.120.3 (extended)
- **Theme**: the Handbook, a typeset book with contents, chapters and margin notes (`themes/handbook/` over the shared `themes/base/`), written for this site; until November 2026 the site used [Wowchemy](https://github.com/wowchemy/starter-hugo-academic)
- **Fonts**: Literata and Atkinson Hyperlegible Mono, self-hosted (`themes/handbook/static/fonts/`, SIL Open Font License); no requests to Google or other font services
- **Diagrams**: Mermaid 10.9.8, self-hosted (`themes/base/assets/js/vendor/`, MIT licence), loaded only on pages with a chart; no page requests anything from another server
- **Hosting**: [GitHub Pages](https://pages.github.com/)
- **CI/CD**: GitHub Actions (automatic deployment on push to main branch)

## Repository Structure

- `config/_default/hugo.toml`: Hugo configuration
- `content/`: All content for the website (guides, pages)
  - `linux/`: Linux-related guides and tutorials
  - `apple/`: macOS-related guides
  - `stuff/`: Miscellaneous content
- `assets/media/`: Images and media files
- `themes/handbook/`: the theme; `themes/handbook/DESIGN.md` records its design and every decision behind it
- `themes/base/`: shared shortcodes, render hooks, search index and helpers
- `layouts/shortcodes/`: site-specific shortcodes (`svg-figure`)
- `redesign/`: notes from the redesign (brief, rounds, decisions)
- `.github/workflows/hugo.yml`: GitHub Actions workflow for automated deployment

## Writing listings

Shell listings mark what is output, so that the Copy button copies only what can be run:

```text
# Explanation for the reader                stays "#": text in the listing
sudo nano /etc/fstab
#> UUID=…  /  btrfs  defaults  0  0           output or file content, boxed, never copied
#~ the root file system, mounted with btrfs  output described in words
```

Details: `themes/handbook/DESIGN.md`, section 20.

## Local Development

```bash
# Start local development server
hugo server

# Build the site as the deployment does
hugo --gc --minify
```

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions whenever changes are pushed to the main branch. See `.github/workflows/hugo.yml` for the deployment configuration.
