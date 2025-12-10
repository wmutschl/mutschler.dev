---
# Homepage
type: widget_page
widget: tag_cloud
weight: 12
# Homepage is headless, other widget pages are not.
headless: true
content:
  # Choose the taxonomy from `config.yaml` to display (e.g. tags, categories)
  taxonomy: tags
  # Choose how many tags you would like to display (0 = all tags)
  count: 30
design:
  # Minimum and maximum font sizes (1.0 = 100%).
  font_size_min: 0.7
  font_size_max: 2.0
  background:
        # Name of image in `assets/media/`.
        #image: haven1-i_see_stars-01.png
        image: YouTubePicture.png
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
title: 'Topic Cloud'
---