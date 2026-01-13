# Mutschler.dev

Source code for my technical homepage at [mutschler.dev](https://mutschler.dev).

## Tech Stack

- **Static Site Generator**: [Hugo](https://github.com/gohugoio/hugo) (Extended version)
- **Theme**: [Wowchemy](https://github.com/wowchemy/starter-hugo-academic) (formerly Academic Theme)
- **Hosting**: [GitHub Pages](https://pages.github.com/)
- **CI/CD**: GitHub Actions (automatic deployment on push to main branch)

## Repository Structure

- `config/`: Hugo configuration files
- `content/`: All content for the website (blog posts, pages, etc.)
  - `linux/`: Linux-related guides and tutorials
  - `apple/`: macOS-related guides
  - `stuff/`: Miscellaneous content
- `assets/media/`: Images and media files
- `.github/workflows/hugo.yml`: GitHub Actions workflow for automated deployment

## Local Development

```bash
# Start local development server
hugo server

# Build the site
hugo
```

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions whenever changes are pushed to the main branch. See `.github/workflows/hugo.yml` for the deployment configuration.