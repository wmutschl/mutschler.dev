---
widget: pages
headless: true
active: true
weight: 20
title: 'Recent Apple related posts'
subtitle:
content:
  offset: 0
  order: desc
  count: 10
  filters:
    folders:
      - apple
    tag: ''
    category: ''
    publication_type: ''
    author: ''
    exclude_featured: false
  archive:
    enable: true
    text: See all Apple posts
    link: apple/
design:
  columns: '2'
  view: compact
  flip_alt_rows: true
  background:
    # Name of image in `assets/media/`.
    image: apple-store.jpg
    # Darken the image? Range 0-1 where 0 is transparent and 1 is opaque.
    image_darken: 0.6
    #  Options are `cover` (default), `contain`, or `actual` size.
    image_size: cover
    # Options include `left`, `center` (default), or `right`.
    image_position: center
    # Use a fun parallax-like fixed background effect on desktop? true/false
    image_parallax: true
    # Text color (true=light, false=dark, or remove for the dynamic theme color).
    text_color_light: true
---